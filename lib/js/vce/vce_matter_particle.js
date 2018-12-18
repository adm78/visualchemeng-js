// VCE Project - Matter Particle Class
//
// A function-rich particle class that has been integrated with the
// matter.js physics engine. Mirrors the interface of the simpler
// vce_particle.Particle class where applicable.
//
// 
//
// Requires:
// - p5.js or p5.min.js
// - matter.js or matter.min.js
// - vce_utils.js
// - vce_math.js
//
// Andrew D. McGuire 2018
// a.mcguire227@gmail.com
//
// Adapated from:
// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/uITcoKpbQq4
//----------------------------------------------------------

function MatterParticle(world, x, y, options) {

    // This particle is compatible with both the matter.js
    // physics engine and the p5 rendering library.

    // Set some defaults
    var default_options = {
	radius : 10.0,
	shape  : {type:'circle'},
	colour : '#2e8ade',
	init_force : { x : 0, y : 0 },
	buoyancy : 0.0,
	perturbation : { x : 0, y : 0 },
	matter_options : {
	    friction: 0,
	    restitution: 0.95,
	}
    };
    var options = utils.merge_options(default_options, options);

    
    // Set the class attributes
    this.radius = options.radius;
    this.colour = options.colour;
    this.shape = options.shape;
    this.buoyancy = options.buoyancy;
    this.perturbation = options.perturbation;
    this.init_force = options.init_force;

    
    // Generate the body
    if (this.shape.type === 'circle') {
	this.body = Bodies.circle(x, y, this.radius, options.matter_options);
    }
    else if (this.shape.type == 'polygon') {
	this.body = Bodies.polygon(x, y, this.shape.sides, this.radius, options.matter_options);
    }
    else {
	throw new RangeError("'shape' arg. has invalid 'type'.");
    }
    if (world != null) {
	World.add(world, this.body);
    };

    
    // Apply an initial force
    Body.applyForce(this.body, this.body.position, this.init_force);

    
    // Class methods
    this.isOffScreen = function(xmax,ymax) {
	var pos = this.body.position;
	return ((pos.y > ymax) || (pos.y < 0) || (pos.x < 0) || (pos.x > xmax));
    }

    this.inDomain = function(xmax,ymax) {
    
	// check if the part lies completely within
	// the domain [0, xmax, 0, ymax]
	var pos = this.body.position;
	if (0 < pos.x - this.radius
	    && pos.x + this.radius < xmax
	    && 0 < pos.y - this.radius
	    && pos.y+ this.radius < ymax) {
	    return true
	};
	return false;
    };
    
    this.removeFromWorld = function(world) {
	World.remove(world, this.body);
    }
    
    
    this.show = function() {
	var pos = this.body.position;
	var angle = this.body.angle;
	push();
	translate(pos.x, pos.y);
	rotate(angle);
	noStroke();
	fill(this.colour);
	if (this.shape.type == 'circle') {
	    ellipse(0, 0, this.radius * 2);
	}
	else if (this.shape.type == 'polygon') {
	    utils.polygon(0, 0, this.radius, this.shape.sides);
	};
	pop();
    }

    this.highlight = function() {

	// Highlight the particle red.
	var pos = this.body.position;
	var angle = this.body.angle;
	push();
	translate(pos.x, pos.y);
	rotate(angle);
	fill(256,1,1);
	noStroke();
	ellipse(pos.x,pos.y,2.0*this.radius);
	pop();
	
    };


    this.perturb = function(xmax, ymax) {
	// Randomly perturb the particle position
	// by [0-xmax] in the x-direction and
	// by [0-ymax] in the y-direction.
	// If no args are passed then the particle perturbation
	// attribute is used instead.
	if (typeof xmax == 'undefined') { xmax = this.perturbation.x };
	if (typeof ymax == 'undefined') { ymax = this.perturbation.y };
	var dx = xmax*vce_math.getRandomSigned();
	var dy = ymax*vce_math.getRandomSigned();
	this.translate(dx, dy);
    };


    this.translate = function(dx, dy) {
	// Translate the particle.
	var new_pos = {
	    x : this.body.position.x + dx,
	    y : this.body.position.y + dy
	}
	Body.setPosition(this.body, new_pos);
    };


    this.apply_buoyant_force = function(gravity) {
	// Apply buoyancy forces to the particle.
	if (this.buoyancy != 0.0) {
	    Body.applyForce(this.body, {
		x: this.body.position.x,
		y: this.body.position.y
	    }, {
		x: 0.0,
		y: -this.buoyancy * gravity.y * gravity.scale * this.body.mass
	    });
	};
    };
  
};

