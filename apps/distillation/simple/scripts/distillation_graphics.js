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
// - separate methods from constructor (general clean-up)
// - feed valve movement should not reset feed ensemble
// - relfux valve not always in sync with mccabe
//----------------------------------------------------------
var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Constraint = Matter.Constraint,
    Body = Matter.Body;

function DistillationGraphics(canvas, column, images, debug) {
    /*
      
    Args:
        cavas (p5.canvas) : The p5 canvas to render on top of.
	column : The backend column object
	images : a JSON object
	debug : debug bool
    */

    // Set the main class attributes
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
    var column_int = utils.get_abs_coords(this.xmax, this.ymax, this.sid.width,
					       this.sid.height, settings.column_interior_position)
    this.column_top = column_int.y - 0.5*column_int.h;
    this.column_left = column_int.x - 0.5*column_int.w;
    this.column_width = column_int.w;
    this.column_height = column_int.h;
    this.column_bottom = this.column_top + this.column_height;
    this.show_boundaries_log = false;
    this.Ensembles = {};
    this.debug = debug;
    this.alpha_R_min = 1.1; // controls how close we can push to column towards Rmin (1.1 == with 10%)
    this.valves = {};
   
    this.stage_pos = function(i) {
	// Return the centre position of stage number i.
	// Note stages number is the stage index + 1, i.e.
	// stages start counting at 1 not 0.
	return {
	    x : this.column_left + 0.5*this.column_width,
	    y : this.column_top + (i-0.5)*this.stage_height()
	};
    };


    this.stage_height = function() {
	return this.column_height/this.column.n_stages;
    };

    this.feed_pipe_pos = function() {
	// central position of the feed pipe
	var feed_stage_pos = this.stage_pos(column.feed_pos);
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

    
    this.update_particle_source_rates = function() {
	// adjust the particle generation rates at each source to
	// match the backend flowrates
	this.Ensembles.feed.sources[0].set_rate(this.column.F*this.pm); 
	this.Ensembles.bottoms.sources[0].set_rate(this.column.B()*this.pm); 
	this.Ensembles.tops.sources[0].set_rate(this.column.D()*this.pm); 
    };


    // THIS IS A BIT OF A MESS, METHODS MIXED WITH CONSTRUCTOR, DUE TO
    // THE NEED FOR SOME OF THE METHODS IN CONSTRUCTION. MIGHT HAVE TO
    // EXTRACT THESE AS PROTOTYPE FUNCTIONS.
    
    // Build the ensemble array (need one for each input/output stream, since some have different boundaries)
    
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

    // set the particle source rates all together
    this.update_particle_source_rates();
    
    // Build the boundaries
    this.Boundaries = [];
    var floor = new Boundary(0.5*this.xmax, this.ymax, this.xmax, 20.0, 0.0, this.world);
    var levee = makeBoundaries([settings.levee_boundary_position], this.xmax, this.ymax,
			       this.sid.width, this.sid.height, this.world)[0];
    this.Boundaries.push(floor);
    this.Boundaries.push(levee);
    
    // generate the feed pipe boundaries and translate them 
    this.feed_boundaries = makeBoundaries(settings.feed_boundary_positions, this.xmax, this.ymax,
					  this.sid.width, this.sid.height, this.world);

    
    // Set-up the valves
    var reflux_valve_pos = utils.get_abs_coords(this.xmax, this.ymax, this.sid.width,
							  this.sid.height, settings.reflux_valve_position)
    var feed_valve_pos = {
	x: this.column_left - 0.27*this.images.feed.width*this.column_sf,
	y : this.feed_pipe_pos().y
    }
    this.valves = {
	reflux : new Valve(reflux_valve_pos.x, reflux_valve_pos.y),
	feed : new Valve(feed_valve_pos.x, feed_valve_pos.y)
    };
    this.valves.reflux.set_position((this.column.R - this.alpha_R_min*this.column.R_min())/(1 + this.column.R - this.alpha_R_min*this.column.R_min()));
    this.valves.feed.set_position(this.column.F/settings.Fmax);


    // reposition some parts relative to the feed
    this.realign_objects_with_feed();
    
    // Class Methods
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


    this.update_backend = function() {
	// update the column based on any UI controls and reset any
	// graphics elements as required.
	this.column.F = this.valves.feed.position*settings.Fmax;
	this.column.R = this.valves.reflux.position/(1.0 - this.valves.reflux.position) + column.R_min()*this.alpha_R_min;
	this.column.solve();

	this.realign_objects_with_feed();
    };


    this.show = function() {
	// render all the neccessary pieces to the canvas
	background(51);
	this.show_walls();
	this.show_column();
	this.show_stages();
	this.show_R();
	this.show_feed();
	this.show_boundaries();
	this.show_ensembles();
	this.show_valves();
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
	var c1 = color(settings.components[0].colour);
	var c2 = color(settings.components[1].colour);
	for (var i=0; i < this.column.n_stages; i++) {
	    var c = lerpColor(c1, c2, this.column.stages[i].y);
	    fill(c);
	    var stage_top = this.column_bottom - (i+1)*this.stage_height();
	    rect(this.column_left, stage_top, this.column_width, this.stage_height());
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
	this.valves.feed.show();
	this.valves.reflux.show();
    };


    this.show_feed = function() {
	push();
	imageMode(CENTER);
	var img = this.images.feed;
	var pos = this.feed_pipe_pos();
	image(img, pos.x, pos.y, img.width*this.column_sf, img.height*this.column_sf);
	pop();

    };

 
    this.show_walls = function() {
	push();
	fill(128);
	noStroke();
	rectMode(CENTER);
	rect(0.5*this.xmax, this.ymax, this.xmax, 20.0); // floor
	var abs_coords = utils.get_abs_coords(this.xmax, this.ymax, this.sid.width, this.sid.height, settings.levee_boundary_position);
	rect(abs_coords.x, abs_coords.y, abs_coords.w, abs_coords.h); // bottoms levess
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
	push()
	textSize(32);
	fill(255, 255, 255);
	textAlign(LEFT, TOP);
	text('R = '+ this.column.R.toFixed(2), this.canvas.width*0.02, this.canvas.height*0.02);
	pop()
    };
    
    this.show_fps = function() {
	push()
	textAlign(LEFT,BOTTOM);
	text(frameRate().toFixed(0) + 'fps', this.canvas.width*0.02, this.canvas.height*0.98);
	pop()
    };

};
