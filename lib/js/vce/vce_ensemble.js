// VCE Project - Ensemble class
//
// The Ensemble class is intended to hold and manipulate an array of
// particle objects. Particles can either of type
// vce_particle.Particle or vce_matter_particle.MatterParticle but
// mixing these may result in unpredictable behaviour. 
//
// Requires:
// - p5.js or p5.min.js
// - vce_particle.js
// - vce_multibody.js
// - matter.js (if PhysEngineParticle instances are passed or world is
//   not null)
//
// Andrew D. McGuire 2018
// a.mcguire227@gmail.com
//----------------------------------------------------------

function Ensemble(p=[],world=null,name='',) {

    /* Initialise the ensemble. 
      
       args:
       particles - an array of vce_particle.Particle or
       vce_particle.PhysEngineParticle objects.
       world - a Matter.World object (required when PhysEngineParticles
       are passed).

    */
 
    // Ensemble attributes
    this.name = name;
    this.particles = p;
    this.outlier_removed = false; // at least one outlier has been removed
    this.outliers = 0;
    this.world = world;
    this.engine_mode = isEngineMode(world);
    this.sources = [];
    
    
    // Ensemble methods for both vce_particle.Particle and
    // vce_particles.PhysEngineParticle-based ensembles
    function isEngineMode(world) {

	// Check if the ensemble is being used in conjunction with the
	// matter.js physics engine.
	if (world != null) { return true}
	else { return false};
    };
    
    this.addParticle = function(p,n=1) {
	for (var i = 0; i < n; i++) {
	    this.particles.push(p);
	};
    };

    this.show = function() {

	/* Draw all particles to the canvas */
	for (i = 0; i < this.particles.length; i++) {
	    this.particles[i].show();
	};
    };


    this.update = function(options) {
	// Perform all the revelant updates to the ensemble. Note,
	// this does not update the physics engine, since multiple
	// ensembles may be associated with the same engine.
	
	// options attributes: xmax, ymax dx_max, dy_max, gravity
	default_options = {
	    perturb : true,
	    apply_vbound : false,
	};
	options = utils.merge_options(default_options, options)
	if (!this.engine_mode) {
	    for (i = 0; i < this.particles.length; i++) {
		this.particles[i].update(options.dt);
	    };
	};
	this.removeOutliers(options.xmax, options.ymax);
	this.updateOutliers();
	this.updateSources(options.source_args);
	if (options.perturb) {
	    this.perturb(options.dx_max, options.dy_max);
	};
	if (!this.engine_mode) {
	    this.apply_buoyant_force(options.gravity);
	    if (options.apply_vbound) {
		this.impose_vertical_boundary(options.vbound, options.ecoeff);
	    };
	};
    };

    
    this.highlight = function() {

	// Highlight the particles red.
	fill(256,1,1);
	noStroke();
	for (i = 0; i < this.particles.length; i++) {
	    this.particles[i].highlight();
	};
    }

    this.removeOutliers = function(xmax,ymax) {

	// remove any particles that lie outwith the simualtion domain
	for (i = 0; i < this.particles.length; i++) {
	    if (!this.particles[i].inDomain(xmax,ymax)) {
		if (this.engine_mode) {
		    this.particles[i].removeFromWorld(this.world);
		};
		this.particles.splice(i,1);
		i = i - 1;
		this.updateOutliers();
	    };
	};
    };

    this.updateOutliers = function() {

	// update the number of outliers
	this.outliers = Math.min(this.outliers + 1,1000);
	this.outlier_removed = true;
	
    };

    this.removeRandom = function(n) {

	// randomly remove n particles from the ensemble
	for (var i = 0; i < n; i ++) {
	    if (this.particles.length > 0) {
		var index = Math.ceil(Math.random()*this.particles.length)-1;
		if (this.engine_mode) {
		    this.particles[index].removeFromWorld(this.world);
		};
		this.particles.splice(index,1);
	    }
	    else {
		break;
	    };
	};
	
    };

    
    this.addSource = function(source) {
	// add a new particle source to the source list
	this.sources.push(source);
    };


    this.updateSources = function(source_args) {
	/* Stochastically add particles to match the desired particle
	generation rates. Supports both vce_particle.Particle and
	vce_particle.PhysEngineParticle-based sources.
	
	Parameters
	----------
	source_args : array of array of float or null
	    List of probability arrays to pass to
	    ParticleSource.get_particle_options_weighted, one list
	    element per stream.
	
	Notes
	-----
	If source_args is null, null is passed to
	get_particle_options_weighted for each stream.
	
	See Also
	--------
	vce_particle_source.ParticleSource.get_particle_options_weighted
	*/

	for (var i=0; i < this.sources.length; i++) {
	    var source = this.sources[i];
	    var n1 = Math.floor(source.rate);
	    var n2 = source.rate - n1;
	    var p = Math.random();
	    if (p <= n2) {
		n1 = n1 + 1;
	    };
	    if (source_args == null) {
		var current_source_args = null;
	    }
	    else {
		if (utils.isArray(source_args[i])) {
		    var current_source_args = source_args[i];
		} else {
		    throw new Error("source_args in not an array type. Check that your particle options are correctly formed. source_args = " + source_args + ", i = " + i)
		}
	    };
	    var p_options = source.get_particle_options_weighted(current_source_args);
	    for (var j=0; j < n1; j++) {
		var part = ParticleFactory(this.world, source.x, source.y, p_options);
		this.addParticle(part);
	    };
	};

    };

    this.perturb = function(xmax,ymax) {

	// randomly perturb all particle positions
	// by [0-xmax] in the x-direction and
	// by [0-ymax] in the y-direction.
	for (i = 0; i < this.particles.length; i++) {
	    this.particles[i].perturb(xmax,ymax);
	};
    };


    this.apply_buoyant_force = function(gravity) {
	if (this.engine_mode) {
	    for (i = 0; i < this.particles.length; i++) {
		this.particles[i].apply_buoyant_force(gravity);
	    };   
	};
    };


    this.impose_vertical_boundary = function(ymax,e_coeff) {
	if (!this.engine_mode) {
	    // Bounce articles that hit lower ymax boundary
	    // mutiplying the magnitude of their y-velocity by
	    // a factor e_coag
	    for (i = 0; i < this.particles.length; i++) {
		if (!this.particles[i].inDomain(100*ymax,ymax)) {
		    this.particles[i].reflect_top();
		    this.particles[i].vel.y = this.particles[i].vel.y*e_coeff;
		};
	    };
	} else {
	    throw new Error("applyBoundary only available for vce_particle.Particle based Ensemble instances (engine_mode===false). You should implement boundaries using vce_boundary.Boudary in conjunction with the matter.js physics engine.")
	};

    };    

} // end of Ensemble class
