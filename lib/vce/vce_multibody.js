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


function TwoBodyParticle(world, x, y, options) {
    /* 
       Create a dumbell-esque particle. This is a wrapper around
       vce_multibody.MultiBodyParticle.  For the options arg, see
       TBP_defaultOptions. For more particle options and defaults see
       vce_particle.PhysEngineParticle. For more bond options and
       defaults see vce_constraint.PhysEngineConstraint.
       
       x (float) : The x coordinate of the bond centre.
       options.y (float) : The y coordinate of the bond centre.
       options.world (matter.World) : The wold in which the MPB will live.

    
    */

    
    var p_options = options.particles || { particles : [{}, {}]};
    var bond_options = options.bond || {};
    
    // build the particles
    var particles = [];
    var dx = 0.5*bond_options.length*Math.cos(bond_options.angle)
    var dy = 0.5*bond_options.length*Math.sin(bond_options.angle)
    var sign = 1;
    for (var i = 0; i < 2; i++) {
	var x_i = x + sign*dx;;
	var y_i = y + sign*dy;
	sign = - sign;
	particles.push(new PhysEngineParticle(world, x_i, y_i, p_options[i]));
    };

    // build the bond
    if (typeof bond_options.matter_options == 'undefined') {
	bond_options.matter_options = {bodyA: particles[0].body, bodyB: particles[1].body, stiffness: 1.0};
    };
    var bond = new PhysEngineConstraint(world, bond_options);

    // build the MBP
    var twoBodyParticle = new MultiBodyParticle(particles,[bond]);
    return twoBodyParticle;
};


function TBP_defaultOptions() {
    // This is an example of a TwoBodyParticle object argument. It
    // should create a body with the a hexagon with attached sphere.
    // Note: you must append a world, x and y attribute to the
    // returned option list to use it in practice.
    var options = {
	particles : [
	    {
		colour : '#008CBA',
		radius : 5.0,
		shape : { type : 'circle'}
	    },
	    {
		colour : '#BC0CDF',
		radius : 10.0,
		shape : {
		    type : 'polygon',
		    sides : 6
		}
	    }   
	],
	bond : {
	    length : 20.0,
	    width : 2.0,
	    colour : '#BAACDF',
	    angle : 0.0
	}
    }
    return options
};
