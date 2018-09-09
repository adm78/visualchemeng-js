// VCE Project - Ensemble class
//
// The Ensemble class is intended to hold and manipulate an array of
// particle objects. It is currently compatible with the
// PhyEngineParticle class.
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

function Ensemble(p=[],world=null) {

    /* Initialise the ensemble. 
      
       args:
       particles - an array of vce_particle.Particle or
       vce_particle.PhysEngineParticle objects.
       world - a Matter.World object (required when PhysEngineParticles
       are passed).

    */
 
    // Ensemble attributes
    this.particles = p;
    this.outlier_removed = false; // at least one outlier has been removed
    this.outliers = 0;
    this.world = world;
    this.engine_mode = isEngineMode(world);
    this.feeds = [];
    
    
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

    
    this.addFeed = function(feed) {
	// add a new feed to the feed list
	this.feeds.push(feed);
    };


    this.updateFeeds = function() {
	// Stochastically add particles to match the desired feed
	// rates. Supports both vce_particle.Particle and
	// vce_particle.PhysEngineParticle-based feeds.

	for (var i=0; i < this.feeds.length; i++) {
	    var feed = this.feeds[i];
	    var n1 = Math.floor(feed.rate);
	    var n2 = feed.rate - n1;
	    var p = Math.random();
	    if (p <= n2) {
		n1 = n1 + 1;
	    };
	    for (var j=0; j < n1; j++) {
		if (this.engine_mode) {
		    var part = ParticleFactory(this.world, feed.x, feed.y, feed.particle_options);
		}
		else {
		    var part = Particle(feed.x, feed.y);
		};
		this.addParticle(part);
	    };
	};

    };
    

    // vce_particle.Particle-based ensemble specific methods
    if (~this.engine_mode) {
	
	this.update = function(dt) {

	    //move all the particles forward in time by dt
	    for (i = 0; i < this.particles.length; i++) {
		this.particles[i].update(dt);
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
	
	this.applyBoundary = function(ymax,e_coeff) {

	    // Bounce articles that hit lower ymax boundary
	    // mutiplying the magnitude of their y-velocity by
	    // a factor e_coag
	
	    for (i = 0; i < this.particles.length; i++) {
		if (!this.particles[i].inDomain(100*ymax,ymax)) {
		    this.particles[i].reflect_top();
		    this.particles[i].vel.y = this.particles[i].vel.y*e_coeff;
		};
	    };
	};

    };    

} // end of Ensemble class
