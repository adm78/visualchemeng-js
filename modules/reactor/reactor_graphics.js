// VCE Project - reactor_graphics.js
//
// This class is intended to provide a graphical representation of a
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
    Bodies = Matter.Bodies,
    Constraint = Matter.Constraint;

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
    this.pcolour = ['#008CBA','#BC0CDF','#00FF00']
    this.shapes = [{type:'polygon', sides:6}, {type:'circle'}]
    this.psize = [10, 5, Math.pow(Math.pow(5,3)+Math.pow(10,3),1.0/3.0)]
    

    // Build the ensemble array (one ensemble for each component)
    this.Ensembles = [];
    var cT = sum(this.Reac.conc);
    for (i = 0; i < Reac.components.length; i++) {
	var component_ensemble = new Ensemble([],this.world);
	var component_n_init = Math.round(this.Reac.conc[i]*n_init/cT);
	for (j = 0; j < component_n_init; j++) {
	    var inlet_x = 0.5*(this.xmax + 0.8*getRandomSigned()*this.sid.width); 
	    var inlet_y = (this.ymax)*0.7 + 0.2*getRandomSigned()*this.sid.height;
	    if (i < 2) {
		var Part = new PhysEngineParticle(this.world, inlet_x, inlet_y,
						  this.psize[i], this.pcolour[i],
						  this.shapes[i]);
	    }
	    else {
		var prod_part_options = TBP_defaultOptions();
		prod_part_options.world = this.world;
		prod_part_options.particles[0].colour = this.pcolour[2]
		prod_part_options.particles[1].colour = this.pcolour[2]
		prod_part_options.x = inlet_x;
		prod_part_options.y = inlet_y;
		var Part = new TwoBodyParticle(prod_part_options);
	    }
	    component_ensemble.addParticle(Part);
	};
	this.Ensembles.push(component_ensemble);
    };

    // Compute the ratio between graphical particles to 'real' particles. 
    var component_n_init_0 = Math.round(this.Reac.conc[0]*n_init/cT);
    this.k = component_n_init_0/(this.Reac.conc[0]*this.Reac.V);


    // Build the boundaries (ideally these co-ordinates should be loaded from file...)
    this.Boundaries = []; 
    this.Boundaries.push(new Boundary((this.xmax-this.sid.width)/2-30,
				      (this.ymax)/2,
				      72, this.sid.height*0.7, 0.0,
				      this.world));
    this.Boundaries.push(new Boundary((this.xmax+this.sid.width)/2+30,
				      (this.ymax)/2,
				      72, this.sid.height*0.7, 0.0,
				      this.world));
    this.Boundaries.push(new Boundary((this.xmax)/2,
				      (this.ymax+1.25*this.sid.height)/2,
				      this.sid.width, 72, 0.0,
				      this.world));
    this.Boundaries.push(new Boundary((this.xmax-this.sid.width*0.7)/2,
				      (this.ymax+1.12*this.sid.height)/2,
				      0.8*this.sid.width, 72, 0.5,
				      this.world));
    this.Boundaries.push(new Boundary((this.xmax+this.sid.width*0.7)/2,
				      (this.ymax+1.12*this.sid.height)/2,
				      0.8*this.sid.width, 72, 2*PI-0.5,
				      this.world));
    this.Boundaries.push(new Boundary((this.xmax-this.sid.width*0.96)/2,
				      (this.ymax+1.0*this.sid.height)/2,
				      0.8*this.sid.width, 72, 1.0,
				      this.world));
    this.Boundaries.push(new Boundary((this.xmax+this.sid.width*0.96)/2,
				      (this.ymax+1.0*this.sid.height)/2,
				      0.8*this.sid.width, 72, 2*PI-1.0,
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
	/* Update the graphical particles in time by updating the
	 * physics engine and adding/deleting particles to handle
	 * outliers and reactor concentration changes. */
	
	Engine.update(this.engine);
	var inlet_x = 0.5*(this.xmax + 0.8*getRandomSigned()*this.sid.width); 
	var inlet_y = (this.ymax)*0.7 + 0.2*getRandomSigned()*this.sid.height;
	for (var i = 0; i < this.Ensembles.length; i++) {
	    var dN = this.get_dN_int(i);
	    if (dN < 0) {
		this.Ensembles[i].removeRandom(-dN);
	    }
	    else if (dN > 0) {
		for (var j=0; j < dN; j++) {
		    if (i < 2) {
			var Part = new PhysEngineParticle(this.world, inlet_x, inlet_y, this.psize[i], this.pcolour[i]);
		    }
		    else {
			var prod_part_options = TBP_defaultOptions();
			prod_part_options.world = this.world;
			prod_part_options.particles[0].colour = this.pcolour[2]
			prod_part_options.particles[1].colour = this.pcolour[2]
			prod_part_options.x = inlet_x;
			prod_part_options.y = inlet_y;
			var Part = new TwoBodyParticle(prod_part_options);
		    };
		    this.Ensembles[i].addParticle(Part);
		};
	    }
	    this.Ensembles[i].removeOutliers(this.xmax,this.ymax);
	};

	
	
    };

    this.get_dN_int = function(i) {
	/* Compute the change in the number of grahical particles
	   associated with reactor component with index i, based on
	   the current reactor compoisition. Will always return an
	   int. */
	
	var target_Ni = this.k*this.Reac.conc[i]*this.Reac.V;
	var actual_Ni = this.Ensembles[i].particles.length;
	if (Math.round(target_Ni) === 0.0) {
	    var dNi_int = -actual_Ni;
	    return dNi_int
	};	    
	
	var dNi = target_Ni - actual_Ni;
	if (dNi >= 0.0) {
	    var sign = +1;
	}
	else {
	    var sign = -1
	};
	var dNi_abs = Math.abs(dNi);
	var dNi_abs_int = Math.floor(dNi_abs);
	var dNi_int = Math.round(sign*dNi_abs_int);
	return dNi_int
	

    };


    this.show = function() {

	// render all the neccessary pieces to the canvas
	background(51);
	this.show_timer();
	this.show_fps();
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
    };

    
    this.show_fps = function() {
	push()
	textAlign(LEFT,BOTTOM);
	text(frameRate().toFixed(0) + 'fps', this.canvas.width*0.02, this.canvas.height*0.98);
	pop()
    };


};
