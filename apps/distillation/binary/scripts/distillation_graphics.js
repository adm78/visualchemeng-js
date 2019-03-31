// VCE Project - distillation_graphics.js
//
// This class is intended to provide a graphical representation of a
// distillation column.  
//
// Requires:
//
//
// Andrew D. McGuire 2019
// a.mcguire227@gmail.com
//
// To do:
// - separate public and private methods
// - relfux valve not always in sync with mccabe
// - switch canvas type to vceCanvas
//----------------------------------------------------------
var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Constraint = Matter.Constraint,
    Body = Matter.Body;

function DistillationGraphics(canvas, column, images, debug) {

    this.__init__ = function(canvas, column, images, debug) {
	/*
	  Args:
              cavas (p5.canvas) : The p5 canvas to render on top of.
	      column : The backend column object
	      images : a JSON object
	      debug : debug bool
	*/
	
	// Set the main class attributes
	this.debug = debug;
	this.canvas = canvas;
	this.column = column;
	this.xmax = canvas.width;
	this.ymax = canvas.height;
	this.canvas_sf = 0.85; // fraction of canvas height to be take up by the image
	this.images = images;
	this.sid = utils.getImgScaledDimensions(this.images.column, this.canvas_sf, this.ymax);
	this.column_sf = this.sid.width/this.images.column.width; // col scale factor
	this.pm = 0.01; // particle multiplier 
	this.engine = Engine.create();
	this.world = this.engine.world;
	this.Ensembles = {};
	this.valves = {};
	this.valve_scaling_factor = 0.0005; // control size of valve relative to the column
	this.Boundaries = [];
	this.show_boundaries_log = false;
	this.alpha_R_min = settings.alpha_R_min; // controls how close we can push to column towards Rmin (1.1 == within 10%)
	this.key = null;
	
	// Initalise everything else
	this._init_column_positions();
	this._init_ensembles();
	this._update_particle_source_rates();
	this._init_boundaries();
	this._init_valves();
	this.realign_objects_with_feed();
	this._init_key();
    };


    this._init_column_positions = function() {
	// Initialise the column positions
	var column_int = utils.get_abs_coords(this.xmax, this.ymax, this.sid.width,
					      this.sid.height, settings.column_interior_position);
	this.column_top = column_int.y - 0.5*column_int.h;
	this.column_left = column_int.x - 0.5*column_int.w;
	this.column_width = column_int.w;
	this.column_height = column_int.h;
	this.column_bottom = this.column_top + this.column_height;
    };


    this._init_ensembles = function() {
	// Build the ensemble array (need one for each input/output stream, since some have different boundaries)
	this.Ensembles = {};
	
	// feed particles
	this.Ensembles.feed = new Ensemble([], this.world, 'feed');
	var feed_particle_source_pos = {
	    x : this.column_left - 0.2*this.images.feed.width*this.column_sf,
	    y : this.feed_pipe_pos().y 
	};
	var full_feed_particle_options = [];
	for (var i = 0; i < settings.particles.length; i++) {
	    full_feed_particle_options[i] = utils.merge_options(settings.particles[i], settings.particle_sources.feed.options);
	};
	var feed_particle_source_rate = null; // will be set later
	this.Ensembles.feed.addSource(new ParticleSource(feed_particle_source_pos.x, feed_particle_source_pos.y,
							 feed_particle_source_rate, full_feed_particle_options));


	// bottoms particles
	this.Ensembles.bottoms = new Ensemble([], this.world, 'bottoms');
	var bottoms_particle_source_pos = utils.get_abs_coords(this.xmax, this.ymax, this.sid.width,
							       this.sid.height, settings.particle_sources.bottoms.position)
	var full_bottoms_particle_options = [];
	for (var i = 0; i < settings.particles.length; i++) {
	    full_bottoms_particle_options[i] = utils.merge_options(settings.particles[i], settings.particle_sources.bottoms.options);
	};
	var bottoms_particle_source_rate = null; // will be set later
	this.Ensembles.bottoms.addSource(new ParticleSource(bottoms_particle_source_pos.x, bottoms_particle_source_pos.y,
							    bottoms_particle_source_rate, full_bottoms_particle_options));


	// tops particles
	this.Ensembles.tops = new Ensemble([], this.world, 'tops');
	var tops_pos = utils.get_abs_coords(this.xmax, this.ymax, this.sid.width,
					    this.sid.height, settings.particle_sources.tops.position)
	var full_tops_particle_options = [];
	for (var i = 0; i < settings.particles.length; i++) {
	    full_tops_particle_options[i] = utils.merge_options(settings.particles[i], settings.particle_sources.tops.options);
	};
	var tops_particle_source_rate = null; // will be set later
	this.Ensembles.tops.addSource(new ParticleSource(tops_pos.x, tops_pos.y, tops_particle_source_rate, full_tops_particle_options));
    };


    this._init_boundaries = function() {
	this.Boundaries = [];
	var floor = new Boundary(0.5*this.xmax, this.ymax, this.xmax, 20.0, 0.0, this.world);
	var levee = makeBoundaries([settings.levee_boundary_position], this.xmax, this.ymax,
				   this.sid.width, this.sid.height, this.world)[0];
	this.Boundaries.push(floor);
	this.Boundaries.push(levee);

	// generate the feed pipe boundaries and translate them 
	this.feed_boundaries = makeBoundaries(settings.feed_boundary_positions, this.xmax, this.ymax,
					      this.sid.width, this.sid.height, this.world);
    };


    this._init_valves = function() {
	this.valves = {};
	var reflux_valve_options = { scaling : this.valve_scaling_factor*this.column_height, type : 'linear'}
	var reflux_valve_pos = utils.get_abs_coords(this.xmax, this.ymax, this.sid.width,
						    this.sid.height, settings.reflux_valve_position)
	
	var feed_valve_pos = {
	    x : this.column_left - 0.27*this.images.feed.width*this.column_sf,
	    y : this.feed_pipe_pos().y
	}
	var feed_valve_options = { scaling : this.valve_scaling_factor*this.column_height, type : 'linear'}


	var preheater_valve_pos = {
	    x : this.column_left - 0.56*this.images.feed.width*this.column_sf,
	    y : 0.8*this.ymax
	};
	var preheater_valve_options = { scaling : this.valve_scaling_factor*this.column_height, type : 'linear', body_angle : PI/2}
	
	this.valves = {
	    reflux : new Valve(reflux_valve_pos.x, reflux_valve_pos.y, reflux_valve_options),
	    feed : new Valve(feed_valve_pos.x, feed_valve_pos.y, feed_valve_options),
	    preheater : new Valve(preheater_valve_pos.x, preheater_valve_pos.y, preheater_valve_options)
	};
	var reflux_flow_capacity = (this.column.R - settings.R_min)/(settings.R_max - settings.R_min)
	this.valves.reflux.set_position_from_flow_capacity(reflux_flow_capacity);

	var feed_flow_capacity = this.column.F/settings.F_max;
	this.valves.feed.set_position_from_flow_capacity(feed_flow_capacity);

	var preheater_flow_capacity = (this.column.q - settings.q_min)/(settings.q_max - settings.q_min);
	this.valves.preheater.set_position_from_flow_capacity(preheater_flow_capacity);
    };


    this._init_key = function() {
	this.key = {};
	var particle_sf = 3.0;
	var p1_options = utils.merge_options(settings.particles[0], { radius : settings.particles[0].radius*particle_sf });
	var p2_options = utils.merge_options(settings.particles[1], { radius : settings.particles[1].radius*particle_sf });
	this.key.p1 = new MatterParticle(null, this.canvas.width*0.035, this.canvas.height*0.02 + 105, p1_options);
	this.key.p2 = new MatterParticle(null, this.canvas.width*0.035, this.canvas.height*0.02 + 135, p2_options);
    };


    this.stage_height = function() {
	return this.column_height/this.column.n_stages;
    };
    

    this.feed_pipe_pos = function() {
	// central position of the feed pipe
	if (this.column.feasible) {
	    var feed_stage_pos = this.stage_pos(column.feed_pos);
	} else {
	    var feed_stage_pos = {
		x : this.column_left + 0.5*this.column_width,
		y : this.column_top + 0.5*this.column_height
	    };
	};
	return {
	    x : feed_stage_pos.x
		- 0.5*this.column_width
		- 0.5*this.images.feed.width*this.column_sf,
	    y : feed_stage_pos.y
	};

    };


    this.realign_objects_with_feed = function() {
	// Move objectcs that are aligned with the feed position, such as
	// particle source, particle stream, feed pipe image, feed pipe
	// boundaries.
	this.Ensembles.feed.empty(); // clear the ensemble, since it doesn't translate well at speed...
	this.Ensembles.feed.sources[0].y = this.feed_pipe_pos().y;
	this.valves.feed.y = this.feed_pipe_pos().y;
	var dy = this.feed_pipe_pos().y - this.feed_boundaries[0].body.position.y;
	for (var i=0; i < this.feed_boundaries.length; i++) {
	    this.feed_boundaries[i].translate(0, dy);
	};
    };

    
    this._update_particle_source_rates = function() {
	// adjust the particle generation rates at each source to
	// match the backend flowrates
	if (this.column.feasible) {
	    var new_feed_rate = this.column.F*this.pm;
	    var new_bottoms_rate = this.column.B()*this.pm;
	    var new_tops_rate = this.column.D()*this.pm;
	} else {
	    var new_feed_rate = 0;
	    var new_bottoms_rate = 0;
	    var new_tops_rate = 0;
	};
	this.Ensembles.feed.sources[0].set_rate(new_feed_rate); 
	this.Ensembles.bottoms.sources[0].set_rate(new_bottoms_rate); 
	this.Ensembles.tops.sources[0].set_rate(new_tops_rate);
    };


    this.stage_pos = function(i) {
	// Return the centre position of stage number i.
	// Note stages number is the stage index + 1, i.e.
	// stages start counting at 1 not 0.
	return {
	    x : this.column_left + 0.5*this.column_width,
	    y : this.column_top + (i-0.5)*this.stage_height()
	};
    };

    
    this.update = function() {
	// update all the graphical elements
	Engine.update(this.engine);
	this.update_ensembles();
    };
    
    
    this.update_ensembles = function() {
	// Update each ensemble in sequence.
	for (var key in this.Ensembles) {
	    var ensemble = this.Ensembles[key];
	    var x_feed = this.column.xf;
	    var x_bottoms = this.column.xb;
	    var x_tops = this.column.xd;
	    var update_options = {
		xmax : this.xmax,
		ymax : this.ymax,
		gravity : this.engine.world.gravity,
	    };
	    if (key == 'feed') {
		update_options.xmax = this.column_left;
		update_options.source_args = [[x_feed, 1.0 - x_feed]];
	    } else if (key == 'bottoms') {
		update_options.source_args = [[x_bottoms, 1.0 - x_bottoms]];
	    } else if (key == 'tops') {
		update_options.ymax = utils.get_abs_coords(this.xmax, this.ymax, this.sid.width,
							   this.sid.height, settings.tops_boundary_position).y;
		update_options.source_args = [[x_tops, 1.0 - x_tops]];
	    } else {
		throw new RangeError("No ensemble with key", key);
	    };
	    ensemble.update(update_options);
	};
    };


    this.reflux_update = function() {
	// Update graphics based on a change in the reflux valve position
	this._update_particle_source_rates();
	this.realign_objects_with_feed();
    };


    this.q_update = function() {
	// Update graphics based on a change in the feed thermal state
	this._update_particle_source_rates();
	this.realign_objects_with_feed();
    };


    this.feed_flow_update = function() {
	// Update graphics based on a change in the feed valve position
	this._update_particle_source_rates();
    };

    
    this.show = function() {
	// render all the neccessary pieces to the canvas
	background(51);
	this.show_walls();
	this.show_column();
	this.show_stages();
	this.show_R();
	this.show_q();
	this.show_n_stages();
	this.show_key();
	this.show_feed_stage_label();
	this.show_feed();
	this.show_boundaries();
	this.show_ensembles();
	this.show_valves();
	this.show_preheater_mask();
	if (this.debug) {
	    this.show_fps();
	};
    };


    this.show_ensembles = function() {
	for (var key in this.Ensembles) {
	    this.Ensembles[key].show();
	};

    };


    this.show_stages = function() {
	push();
	rectMode(CORNER);
	if (this.column.feasible) {
	    var c1 = color(settings.components[0].colour);
	    var c2 = color(settings.components[1].colour);
	    for (var i=0; i < this.column.n_stages; i++) {
		var c = lerpColor(c1, c2, this.column.stages[i].y);
		fill(c);
		var stage_top = this.column_bottom - (i+1)*this.stage_height();
		rect(this.column_left, stage_top, this.column_width, this.stage_height());
	    };
	} else {
	    var c = [190, 0.0, 0.0];
	    fill(c);
	    rect(this.column_left, this.column_top, this.column_width, this.column_height);
	};
	pop();
    };
   
    this.show_column = function() {
	push();
	imageMode(CENTER);
	image(this.images.column, this.xmax/2 , this.ymax/2, this.sid.width, this.sid.height);
	pop();	
    };


    this.show_valves = function() {
	for (var key in this.valves) {
	    this.valves[key].show();
	};
    };


    this.show_feed = function() {
	push();
	imageMode(CENTER);
	var img = this.images.feed;
	var pos = this.feed_pipe_pos();
	image(img, pos.x, pos.y, img.width*this.column_sf, img.height*this.column_sf);
	pop();

    };

    
    this.show_feed_stage_label = function() {
	push();
	var x = this.column_left + 0.5*this.column_width;
	var y = this.feed_pipe_pos().y;
	fill(255);
	textAlign(CENTER, CENTER);
	if (this.column.feasible) {
	    text(this.column.feed_pos.toFixed(0), x, y);
	} else {
	    text('!', x, y);
	};
	pop();
    };

    
    this.show_walls = function() {
	push();
	fill(128);
	noStroke();
	rectMode(CENTER);
	rect(0.5*this.xmax, this.ymax, this.xmax, 20.0); // floor
	var abs_coords = utils.get_abs_coords(this.xmax, this.ymax, this.sid.width, this.sid.height, settings.levee_boundary_position);
	rect(abs_coords.x, abs_coords.y, abs_coords.w, abs_coords.h); // bottoms leves
	pop()
    };
    

    this.show_boundaries = function() {
	if (this.show_boundaries_log) {
	    for (var i = 0; i < this.Boundaries.length; i++) {
		this.Boundaries[i].show();
	    };
	    for (var i = 0; i < this.feed_boundaries.length; i++) {
		this.feed_boundaries[i].show();
	    };
	};
    };

    this.show_R = function() {
	push();
	textSize(24);
	fill(255, 255, 255);
	textAlign(LEFT, TOP);
	text('R = '+ this.column.R.toFixed(2), this.canvas.width*0.02, this.canvas.height*0.02);
	pop();
    };

    this.show_q = function() {
	push();
	textSize(24);
	fill(255, 255, 255);
	textAlign(LEFT, TOP);
	text('q = '+ this.column.q.toFixed(2), this.canvas.width*0.02, this.canvas.height*0.02 + 30);
	pop();
    };

    this.show_n_stages = function() {
	push();
	textSize(24);
	fill(255, 255, 255);
	textAlign(LEFT, TOP);
	if (!this.column.feasible) {
	    text('Distillation infeasible', this.canvas.width*0.02, this.canvas.height*0.02 + 60);
	} else {
	    text(this.column.n_stages.toFixed(0) + ' stages', this.canvas.width*0.02, this.canvas.height*0.02 + 60);
	};
	pop()
    };

    this.show_key = function() {
	push();
	this.key.p1.show();
	this.key.p2.show();
	textSize(24);
	fill(255, 255, 255);
	textAlign(LEFT, CENTER);
	text(settings.components[0].name, this.key.p1.body.position.x + this.key.p1.radius*2.0, this.key.p1.body.position.y);
	text(settings.components[1].name, this.key.p2.body.position.x + this.key.p2.radius*2.0, this.key.p2.body.position.y);
	pop();
    };

    
    this.show_fps = function() {
	push();
	textAlign(LEFT,BOTTOM);
	text(frameRate().toFixed(0) + 'fps', this.canvas.width*0.02, this.canvas.height*0.98);
	pop();
    };


    this.show_preheater_mask = function() {
	push();
	var feed_pipe_pos = this.feed_pipe_pos();
	var w = 0.36*this.images.feed.width*this.column_sf;
	var h = 0.0508*this.images.feed.height*this.column_sf;
	var r = h/2.0;
	var opacity = 100;
	var cold = color(0, 0, 255, opacity);
	var hot = color(255, 0, 0, opacity);
	var mask_color = lerpColor(cold, hot, this.valves.preheater.position());
	console.log(mask_color);
	fill(mask_color);
	noStroke();
	var dx = - 0.35*this.images.feed.width*this.column_sf;
	var dy = -0.05*this.images.feed.width*this.column_sf;
	rect(feed_pipe_pos.x + dx, feed_pipe_pos.y + dy,
	     w, h, r, r, r, r);
	pop();
    }


    // Now that everything is defined, we can initialise everything.
    this.__init__(canvas, column, images, debug);
};
