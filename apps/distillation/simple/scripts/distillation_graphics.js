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
    

    // Build the ensemble array (one ensemble for each component)
    this.Ensembles = [];

    // Build the boundaries
    this.Boundaries = makeBoundaries(settings.boundary_positions, this.xmax, this.ymax,
				     this.sid.width, this.sid.height, this.world);

   
    // Class Methods
    this.update = function() {

	this.update_ensemble();
	
    };

    this.update_ensemble = function() {   };



    this.show = function() {

	// render all the neccessary pieces to the canvas
	background(51);
	this.show_column();
	this.show_stages();
	this.show_boundaries();
	if (this.debug) {
	    this.show_fps();
	};
    };


    this.show_stages = function() {
	push();
	rectMode(CORNER);
	var stage_height = this.column_height/this.column.n_stages;
	for (var i=0; i < this.column.n_stages; i++) {
	    fill(column.stages[i].y*255);
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
