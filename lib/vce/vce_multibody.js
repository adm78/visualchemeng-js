// VCE Project - Multi-Body Particle Classes
//
// A library of classes that can be used to create multi-body entities
// such as diatomic particles, polymers etc.
//
// Requires:
// - matter.js
// - p5.js or p5.min.js
// - vce_particle.js
// - vce_constraint.js
//
// Andrew D. McGuire 2018
// a.mcguire227@gmail.com
//----------------------------------------------------------

function MultiBodyParticle(particles=[],constraints=[]) {
    // Base class: a multi-body particle is a collection of
    // vce_particle.Particle or vce_particle.PhysEngineParticle
    // objects and associated vce_constraint.PhysEngineConstraint
    // objects. It provides the same interface as
    // vce_particle.PhysEngineParticle.
    
    // Class attributes
    this.particles = particles;
    this.constraints = constraints;

    // Class methods
    this.show = function() {
	for (var i = 0; i < this.constraints.length; i++) {
	    this.constraints[i].show();
	};
	for (var i = 0; i < this.particles.length; i++) {
	    this.particles[i].show();
	};
	    
    };

    this.isOffScreen = function(xmax,ymax) {
	var res = false;
	for (var i = 0; i < this.particles.length; i++) {
	    if (this.particles[i].isOffScreen(xmax,ymax)) {
		res = true;
	    };
	};
	return res
    };


    this.inDomain = function(xmax,ymax) {
	var res = false;
	for (var i = 0; i < this.particles.length; i++) {
	    if (this.particles[i].inDomain(xmax,ymax)) {
		res = true;
	    };
	};
	return res;
    };

    
    this.removeFromWorld = function(world) {
	for (var i = 0; i < this.particles.length; i++) {
	    World.remove(world, this.particles[i].body);
	};
	for (var i = 0; i < this.constraints.length; i++) {
	    World.remove(world, this.constraints[i].constraint);
	};
    };
    

    this.highlight = function() {
	for (var i = 0; i < this.particles.length; i++) {
	    this.particles.highlight();
	};
    };
};


function DiatomicParticle(world, x, y, bl, theta, colours, bcolour) {
    // First attempt at a diamtomic particle. A wrapper around
    // vce_multibody.MultiBodyParticle.
    //
    // Args:
    
    // get particle positions
    dx = 0.5*bl*Math.cos(theta)
    dy = 0.5*bl*Math.sin(theta)
    var p1 = new PhysEngineParticle(world, x+dx, y+dy, 5.0, colours[0]);
    var p2 = new PhysEngineParticle(world, x-dx, y-dy, 10.0, colours[1]);
    var bond_def = {bodyA: p1.body, bodyB: p2.body, stiffness: 1.0};
    var bond = new PhysEngineConstraint(bond_def, world, 2.0, bcolour)
    var diatomic = new MultiBodyParticle([p1,p2],[bond])
    return diatomic
};
