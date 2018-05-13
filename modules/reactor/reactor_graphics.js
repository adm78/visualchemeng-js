// VCE Project - reactor_graphics.js
//
// This class is intented to provide a graphical represntation of a
// reactive system.  Its primary attribute is a list of
// vce_ensemble.Ensemble objects. Each ensemble object in this list
// represents a component in the main reaction. THIS CLASS IS UNDER
// DEVELOPMENT AND SHOULD NOT BE CONSIDERED STABLE. ONLY ONE REACTION
// IS SUPPORTED FOR THE MOMENT.
//
//
//
// Requires:
// matter.min.js
// vce_utils.js
// p5.min.js
// boundary.js
// vce_ensemble.Ensemble
// vce_particle.PhysEngineParticle
//
// Andrew D. McGuire 2018
// a.mcguire227@gmail.com
//
// To do:
//
//----------------------------------------------------------
var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies;

function ReactorGraphics(canvas, Reac, n_init, Tank, imp_array=[], isf=0.8, debug) {
    /*
      
    Args:
        Reac (vce_reactor.Reactor) : 
        n_init (init) : 
	Tank (Image) : 
	imp_array (Image array) :
	isf (float) :
	debug (boolean) : 


    */

    // Set the main class attributes
    this.canvas = canvas;
    this.xmax = canvas.width;
    this.ymax = canvas.height;
    this.isf = isf;
    this.Reac = Reac;
    this.engine = Engine.create();
    this.world = this.engine.world;
    this.Tank = Tank;
    this.sid = getImgScaledDimensions(this.Tank, this.isf, this.ymax);
    this.show_boundaries_log = false;
    this.debug = debug;


    // Build the ensemble array
    this.Ensembles = [];
    var colour = ['#008CBA','#BC0CDF','#00FF00'];
    var inlet_x = 0.5*this.xmax; 
    var inlet_y = (this.ymax)/2;
    for (i = 0; i < Reac.components.length; i++) {
	var component_ensemble = new Ensemble([],this.world);
	var cT = sum(this.Reac.conc);
	var component_n_init = Math.round(this.Reac.conc[i]*n_init/cT);
	for (j = 0; j < component_n_init; j++) {
	    var Part = new PhysEngineParticle(this.world, inlet_x, inlet_y, random(5, 10), colour[i]);
	    component_ensemble.addParticle(Part);
	};
	this.Ensembles.push(component_ensemble);
    };
    console.log(this.Ensembles[0]);


    // Build the boundaries
    this.Boundaries = []; 
    this.Boundaries.push(new Boundary((this.xmax-this.sid.width)/2,
				      (this.ymax)/2,
				      20, this.sid.height*0.7, 0.0,
				      this.world));
    this.Boundaries.push(new Boundary((this.xmax+this.sid.width)/2,
				      (this.ymax)/2,
				      20, this.sid.height*0.7, 0.0,
				      this.world));
    this.Boundaries.push(new Boundary((this.xmax)/2,
				      (this.ymax+1.0*this.sid.height)/2,
				      this.sid.width, 20, 0.0,
				      this.world));
    this.Boundaries.push(new Boundary((this.xmax-this.sid.width*0.7)/2,
				      (this.ymax+0.9*this.sid.height)/2,
				      0.5*this.sid.width, 20, 0.7,
				      this.world));
    this.Boundaries.push(new Boundary((this.xmax+this.sid.width*0.7)/2,
				      (this.ymax+0.9*this.sid.height)/2,
				      0.5*this.sid.width, 20, 2*PI-0.7,
				      this.world));
    

    
    // Build the impeller
    var imp_height = this.sid.height*0.6297;
    this.Impeller = new Impeller(imp_array, imp_height, this.ymax,
				 [this.xmax/2.0,this.ymax/2.0],
				 speed=0.3);


    // Class Methods
    this.update = function() {

	this.Impeller.rotate();
	this.update_ensemble();
	
    };

    this.update_ensemble = function() {
	Engine.update(this.engine);
	for (var i = 0; i < this.Ensembles.lenght; i++) {
	    this.Ensembles[i].removeOutliers(this.xmax,this.ymax);
	};
    };


    this.show = function() {

	// render all the neccessary pieces to the canvas
	background(51);
	this.show_timer();
	this.show_tank();
	this.show_boundaries();
	this.show_particles();
	this.Impeller.show();
	    
    };

    this.show_tank = function() {
	push();
	imageMode(CENTER);
	image(this.Tank, this.xmax/2 , this.ymax/2, this.sid.width, this.sid.height);
	pop();	
    };

    this.show_boundaries = function() {
	if (this.show_boundaries_log) {
	    for (var i = 0; i < this.Boundaries.length; i++) {
		this.Boundaries[i].show();
	    };
	};
    };

    this.show_particles = function() {
	for (var i = 0; i < this.Ensembles.length; i++) {
	    this.Ensembles[i].show();
	};
    };


    this.show_timer = function() {
	push()
	textSize(32);
	fill(255, 255, 255);
	textAlign(LEFT, TOP);
	text(this.Reac.t.toFixed(1)+'s', this.canvas.width*0.02, this.canvas.height*0.02);
	pop()
	push()
	textAlign(LEFT,BOTTOM);
	text(frameRate().toFixed(0) + 'fps', this.canvas.width*0.02, this.canvas.height*0.98);
	pop()
    };


};
