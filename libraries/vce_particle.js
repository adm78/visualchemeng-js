// VCE Project - Particle class
//
// A simple class to store particle information and apply
// various transformations to simulate particle movement.
//
// Requires:
// - p5.js or p5.min.js
//
// Andrew D. McGuire 2017
// a.mcguire227@gmail.com
//----------------------------------------------------------

function Particle(x=0,y=0,r=5.0,energy=1.0,vx=null,vy=null,theta=null,
		  acc=createVector(0,0),colour='#2e8ade') {

    /* Initialise the particle. 

       If an energy arg is passed and vx and vy are null, then the
       velocity vector is computed from the energy.
       
       The energy is split randomly between the x and y components of
       the velocity unless a theta arg is specified.  theta is the
       angle made by the particle trajectory to the normal.

       If vx and vy are given, then these directlty specify the
       velocity vector and the energy is ignored.
       
       args:
       x      - particle initial x position
       y      - particle in ital y position
       r      - particle radius     
       energy - particle energy
       vx     - particle x velocity
       vy     - particle y velocity
       theta  - angle made by inital velocity vector (radians)
       colour - particle colour for display (Hex CSS)

    */
 

    // Particle attributes
    this.pos = createVector(x,y); // position vector
    this.radius = r;              // radius
    this.acc = acc; // current acceleration vector
    this.acc_old = this.acc;      // previous acceleration vector
    this.mass = Math.pow(this.radius,3.0)/125.0; // mass 
    this.energy = energy;         // particle kinetic energy
    this.vel = initVelocity(this.mass,this.energy,vx,vy,theta);     // velocity vector
    this.colour = colour;
    
    // Particle Methods
    function initVelocity(mass,energy,vx,vy,theta) {

	// initialises particle velocity based on
	// (in order of priority)
	// 1.) mass and energy (and traj angle theta, if provided)
	// 2.) velocity components vx and vy

	if (vx === null || vy === null) {
	    var vres = Math.pow(2.0*energy/mass, 0.5);
	    if (theta === null) {
		var theta = 2.0*Math.PI*Math.random();
	    };
	    var vx = vres*Math.cos(theta);
	    var vy = -vres*Math.sin(theta);
	};
	return createVector(vx,vy);	
    };
    
    this.update = function(dt) {

	/* Compute the new acceleration, position and
	   velocity vectors using the Velocity Verlet algorithm
	   with time-step dt. Constant acceleration is
	   assumed for the moment. */
	
	this.update_acc(dt);
	this.update_pos(dt);
	this.update_vel(dt);

    }

    this.show = function() {

	/* Draw the particle as an circle on
	   the canvas. Size is controlled by
	   the particle radius. */
	
	fill(this.colour);
	noStroke();
	ellipse(this.pos.x,this.pos.y,2.0*this.radius);
    }

    this.highlight = function() {

	// Highlight the particle red.
	
	fill(256,1,1);
	noStroke();
	ellipse(this.pos.x,this.pos.y,2.0*this.radius);
    }

    this.update_acc = function(dt) {

	/* Update acceleration term. Constant
	   acceleration for now so no change.*/
	
	this.acc_old = this.acc
	this.acc = this.acc
    }

    this.update_pos = function(dt) {

	/* Update the particle position
	   according to a time-step of size dt.*/
	
	var pos_1 = this.pos
	pos_1.add(p5.Vector.mult(this.vel, dt));
	var pos_2 = p5.Vector.mult(this.acc, 0.5*Math.pow(dt,2.0));
	this.pos = p5.Vector.add(pos_1, pos_2);

    }

    this.update_vel = function(dt) {
	
	/* Update the velocity according to
	   and its accelerate over time
	   interval dt. */
	
	var v_1 = this.vel;
	var a_sum = p5.Vector.add(this.acc, this.acc);
	var v_2 = p5.Vector.mult(a_sum, 0.5*dt);
	this.vel = p5.Vector.add(v_1, v_2);
    }

    this.reflect_side = function() {
	// Invert the x velocity component
	this.vel.x = - this.vel.x;
    }

    this.reflect_top = function() {
	// Invert the y velocity component
	this.vel.y = - this.vel.y;
    }    

    this.apply_boundary_cond = function(xmax,ymax) {

	/* Update the particle position to
	   simulate periodic boundary conditions
	   with box bounds (0,xmax), (0,ymax)*/
	
	if (this.pos.x >= xmax) {
	    this.pos.x = this.pos.x - xmax
	}
	if (this.pos.x < 0) {
	    this.pos.x = this.pos.x + xmax
	}
	if (this.pos.y >= ymax) {
	    this.pos.y = this.pos.y - ymax
	}
	if (this.pos.y < 0) {
	    this.pos.y = this.pos.y + ymax
	}
    }

    this.apply_impulse = function(Jx,Jy) {

	/* 
	   Compute and apply velocity change due to
	   an impulse applied to the particle.
	   
	   args:
	   Jx - scalar x-component of the impulse vector
	   Jy - scalar y-component of the impulse vector 
	*/
	
	this.vel.x = this.vel.x + (Jx/this.mass);
	this.vel.y = this.vel.y + (Jy/this.mass);
    }

    this.perturb = function(xmax,ymax) {

	// randomly perturb the particle position
	// by [0-xmax] in the x-direction and
	// by [0-ymax] in the y-direction.
	this.pos.x = this.pos.x + getRandomSigned()*xmax;
	this.pos.y = this.pos.y + getRandomSigned()*ymax;
	
    }

    this.inDomain = function(xmax,ymax) {
    
	// check if the part lies completely within
	// the domain [0, xmax, 0, ymax]
	
	if (0 < this.pos.x - this.radius
	    && this.pos.x + this.radius < xmax
	    && 0 < this.pos.y - this.radius
	    && this.pos.y+ this.radius < ymax) {
	    return true
	};
	return false;
    };


} // end of Particle class

// Adapated from:
// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/uITcoKpbQq4

function PhysEngineParticle(world, x, y, r, colour='#2e8ade') {

    // This particle is compatible with both the matter.js
    // physics engine and the p5 rendering library.
    
    var options = {
	friction: 0,
	restitution: 0.95
    }
    
    this.body = Bodies.circle(x, y, r, options);
    this.radius = r;
    this.colour = colour;
    World.add(world, this.body);

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
	// rectMode(CENTER);
	// strokeWeight(1);
	// stroke(255);
	noStroke();
	fill(this.colour);
	ellipse(0, 0, this.radius * 2);
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
	
    }

    
    
}
