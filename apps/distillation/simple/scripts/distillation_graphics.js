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

function DistillationGraphics(canvas, column, column_img, debug) {
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
    this.column_img = column_img;
    this.sid = getImgScaledDimensions(this.column_img, this.isf, this.ymax);
    this.column_top = this.ymax*0.5 - 0.37*this.sid.height;
    this.column_left = this.xmax*0.5 - 0.225*this.sid.width;
    this.column_width = this.sid.width*0.193;
    this.column_height = this.sid.height*0.68;
    this.show_boundaries_log = true;
    this.debug = debug;
    

    // Build the ensemble array (one for each feed)
    this.Ensembles = [];
    var ensemble = new Ensemble([], this.world);
    var bottoms_pos = {
	x : 0.5*(this.xmax + this.sid.width),
	y : 0.5*(this.ymax + 0.97*this.sid.height)
    };
    var particle_options = {
	type: 'single-body',
	shape : {type:'polygon', sides:6},
	radius : 3,
	colour : '#008CBA',
	init_force : { x : 0.0003, y : 0.0},
	buoyancy : 2.0,
	matter_options : {
	    friction: 0,
	    restitution: 0.5,
	}
    };
    var rate = 1.0;
    var bottoms_outflow = new ParticleFeed(bottoms_pos.x, bottoms_pos.y,
					   rate, particle_options)
    ensemble.addFeed(bottoms_outflow);
    this.Ensembles.push(ensemble);

    // Build the boundaries
    this.Boundaries = makeBoundaries(settings.boundary_positions,
				     this.xmax, this.ymax,
				     this.sid.width, this.sid.height,
				     this.world);
    var floor = new Boundary(0.5*this.xmax, this.ymax, this.xmax, 20.0, 0.0, this.world);
    this.Boundaries.push(floor);
    var levee = makeBoundaries([settings.levee_position],
			       this.xmax, this.ymax,
			       this.sid.width, this.sid.height,
			       this.world)[0];
    this.Boundaries.push(levee);

   
    // Class Methods
    this.update = function() {
	// update all the graphical elements
	this.update_ensembles();
    };
    

    this.update_ensembles = function() {
	Engine.update(this.engine);
	for (var i =0; i < this.Ensembles.length; i++) {
	    this.Ensembles[i].removeOutliers(this.xmax, this.ymax);
	    this.Ensembles[i].updateFeeds();
	    this.Ensembles[i].apply_buoyant_force(this.engine.world.gravity);
	    //this.Ensembles[i].perturb(2,2);
	};
    };



    this.show = function() {

	// render all the neccessary pieces to the canvas
	background(51);
	this.show_column();
	this.show_stages();
	this.show_boundaries();
	this.show_walls();
	this.show_ensembles();
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
	var stage_height = this.column_height/this.column.n_stages;
	for (var i=0; i < this.column.n_stages; i++) {
	    var c = lerpColor(c1, c2, column.stages[i].y);
	    fill(c);
	    var stage_top = this.column_top + i*stage_height;
	    rect(this.column_left, stage_top, this.column_width, stage_height);
	};
	pop();
    };
    

    this.show_column = function() {
	push();
	imageMode(CENTER);
	image(this.column_img, this.xmax/2 , this.ymax/2, this.sid.width, this.sid.height);
	pop();	
    };

 
    this.show_walls = function() {
	push();
	fill(128);
	noStroke();
	rectMode(CENTER);
	rect(0.5*this.xmax, this.ymax, this.xmax, 20.0);
	var abs_coords = get_absolute_coordinates(this.xmax, this.ymax, this.sid.width, this.sid.height, settings.levee_position);
	rect(abs_coords.x, abs_coords.y, abs_coords.w, abs_coords.h);
	pop();
    };
    

    this.show_boundaries = function() {
	if (this.show_boundaries_log) {
	    for (var i = 0; i < this.Boundaries.length; i++) {
		this.Boundaries[i].show();
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
