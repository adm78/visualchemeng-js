// VCE Project - distillation_graphics.js
//
// This class is intended to provide a graphical representation of a
// distillation column.  Its primary attribute is a list of
// vce_ensemble.Ensemble objects. Each ensemble object in this list
// represents a component in the main reaction. THIS CLASS IS UNDER
// DEVELOPMENT AND SHOULD NOT BE CONSIDERED STABLE. ONLY ONE REACTION
// IS SUPPORTED FOR THE MOMENT.
//
//
//
// Requires:

//
// Andrew D. McGuire 2018
// a.mcguire227@gmail.com
//
// To do:
//
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

    */

    // Set the main class attributes
    this.canvas = canvas;
    this.column = column;
    this.xmax = canvas.width;
    this.ymax = canvas.height;
    this.isf = 0.85;
    this.engine = Engine.create();
    this.world = this.engine.world;
    this.images = images;
    this.sid = utils.getImgScaledDimensions(this.images.column, this.isf, this.ymax);
    this.column_top = this.ymax*0.5 - 0.37*this.sid.height;
    this.column_left = this.xmax*0.5 - 0.225*this.sid.width;
    this.column_width = this.sid.width*0.193;
    this.column_height = this.sid.height*0.68;
    this.column_bottom = this.column_top + this.column_height;
    this.show_boundaries_log = true;
    this.Ensembles = [];
    this.debug = debug;
    this.valves = {}
    
    this.stage_pos = function(i) {
	// Return the centre position of stage number i.
	// Note stages number is the stage index + 1, i.e.
	// stages start counting at 1 not 0.
	return {
	    x : this.column_left + 0.5*this.column_width,
	    y : this.column_bottom - (i-0.5)*this.stage_height()
	};
    };


    this.stage_height = function() {
	return this.column_height/this.column.n_stages;
    };

    this.feed_pos = function() {
	var feed_stage_pos = this.stage_pos(column.feed_pos);
	var sf = this.sid.width/this.images.column.width;
	return {
	    x : feed_stage_pos.x
		- 0.5*this.column_width
		- 0.5*this.images.feed.width*sf,
	    y : feed_stage_pos.y
	};

    };


    this.reset_feed_boundaries = function() {
	// Move the feed boundaries so they line up with the feed pipe
	// position.
	var sf = this.sid.width/this.images.column.width;
	var dy = this.feed_pos().y - this.feed_boundaries[0].body.position.y + 0.40*this.images.feed.height*sf;
	for (var i=0; i < this.feed_boundaries.length; i++) {
	    this.feed_boundaries[i].translate(0, dy);
	};
    };


    // Build the ensemble array (one for each feed)

    // feed particles
    var feed_ensemble = new Ensemble([], this.world);
    var sf = this.sid.width/this.images.column.width;
    var feed_pos = {
	x : this.column_left - sf*this.images.feed.width + 2,
	y : this.feed_pos().y 
    };
    var feed_particle_options = {
	type: 'single-body',
	shape : {type:'polygon', sides:6},
	radius : 3,
	colour : '#008CBA',
	init_force : { x : 0.0003, y : 0.0},
	buoyancy : 0.0,
	matter_options : {
	    friction: 0,
	    restitution: 0.5,
	}
    };
    var rate = 1.0;
    var feed_inflow = new ParticleFeed(feed_pos.x, feed_pos.y,
				       rate, feed_particle_options)
    feed_ensemble.addFeed(feed_inflow);
    this.Ensembles.push(feed_ensemble);

    // bottoms particles
    var bottoms_ensemble = new Ensemble([], this.world);
    var bottoms_pos = {
	x : 0.5*(this.xmax + this.sid.width),
	y : 0.5*(this.ymax + 0.97*this.sid.height)
    };
    var bottoms_particle_options = {
	type: 'single-body',
	shape : {type:'polygon', sides:6},
	radius : 3,
	colour : '#008CBA',
	init_force : { x : 0.0003, y : 0.0},
	buoyancy : 0.0,
	matter_options : {
	    friction: 0,
	    restitution: 0.5,
	}
    };
    var rate = 2.0;
    var bottoms_outflow = new ParticleFeed(bottoms_pos.x, bottoms_pos.y,
					   rate, bottoms_particle_options)
    bottoms_ensemble.addFeed(bottoms_outflow);
    this.Ensembles.push(bottoms_ensemble);

    // tops particles
    var tops_ensemble = new Ensemble([], this.world);
    var tops_pos = {
	x : 0.5*(this.xmax + this.sid.width),
	y : 0.5*(this.ymax - 0.76*this.sid.height)
    };
    var tops_particle_options = {
	type: 'single-body',
	shape : {type:'polygon', sides:6},
	radius : 3,
	colour : '#008CBA',
	init_force : { x : 0.0002, y : 0.0},
	buoyancy : 1.05,
	perturbation : { x : 2, y : 2 },
	matter_options : {
	    friction: 0,
	    restitution: 0.5,
	}
    };
    var rate = 1.0;
    var tops_outflow = new ParticleFeed(tops_pos.x, tops_pos.y,
					rate, tops_particle_options)
    tops_ensemble.addFeed(tops_outflow);
    this.Ensembles.push(tops_ensemble);

    

    // Build the boundaries
    this.Boundaries = makeBoundaries(settings.boundary_positions,
				     this.xmax, this.ymax,
				     this.sid.width, this.sid.height,
				     this.world);
    var floor = new Boundary(0.5*this.xmax, this.ymax, this.xmax, 20.0, 0.0, this.world);
    var levee = makeBoundaries([settings.levee_position],
			       this.xmax, this.ymax,
			       this.sid.width, this.sid.height,
			       this.world)[0];
    this.Boundaries.push(floor);
    this.Boundaries.push(levee);

    // generate the feed pipe boundaries and translate the 
    this.feed_boundaries = makeBoundaries(settings.feed_positions, this.xmax, this.ymax,
					  this.sid.width, this.sid.height, this.world);
    this.reset_feed_boundaries();

    // Set-up the valves
    this.valves = {
	reflux : new Valve(this.xmax/2, this.ymax/2, this.images.valve)
    };
    
    // Class Methods
    this.update = function() {
	// update all the graphical elements
	Engine.update(this.engine);
	this.update_ensembles();
    };
    

    this.update_ensembles = function() {
	// Update each ensemble in sequence.
	for (var i = 0; i < this.Ensembles.length; i++) {
	    var update_options = {
		    xmax : this.xmax,
		    ymax : this.ymax,
		    gravity : this.engine.world.gravity
	    };
	    if (i == 0) { update_options.xmax = this.column_left };
	    this.Ensembles[i].update(update_options);
	};
    };



    this.show = function() {
	// render all the neccessary pieces to the canvas
	background(51);
	this.show_column();
	this.show_stages();
	this.show_feed();
	this.show_boundaries();
	this.show_walls();
	this.show_ensembles();
	this.show_valves();
	if (this.debug) {
	    this.show_fps();
	};
    };


    this.show_ensembles = function() {
	for (var i=0; i < this.Ensembles.length; i++) {
	    this.Ensembles[i].show();
	};

    };


    this.show_stages = function() {
	push();
	rectMode(CORNER);
	var c1 = color(settings.components[0].colour);
	var c2 = color(settings.components[1].colour);
	for (var i=0; i < this.column.n_stages; i++) {
	    var c = lerpColor(c1, c2, column.stages[i].y);
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
	this.valves.reflux.show();
    };


    this.show_feed = function() {
	push();
	imageMode(CENTER);
	var img = this.images.feed;
	var sf = this.sid.width/this.images.column.width;
	var pos = this.feed_pos();
	image(img, pos.x, pos.y, img.width*sf, img.height*sf);
	pop();

    };

 
    this.show_walls = function() {
	push();
	fill(128);
	noStroke();
	rectMode(CENTER);
	rect(0.5*this.xmax, this.ymax, this.xmax, 20.0);
	var abs_coords = utils.get_absolute_coordinates(this.xmax, this.ymax, this.sid.width, this.sid.height, settings.levee_position);
	rect(abs_coords.x, abs_coords.y, abs_coords.w, abs_coords.h);
	pop();
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

    
    this.show_fps = function() {
	push()
	textAlign(LEFT,BOTTOM);
	text(frameRate().toFixed(0) + 'fps', this.canvas.width*0.02, this.canvas.height*0.98);
	pop()
    };

};
