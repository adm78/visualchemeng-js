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

function Particle(x,y,r) {

    /* Initialise the particle with a random velocity
       and zero acceleration.
       
       args:
       x - particle initial x position
       y - particle in ital y position
       r - particle radius                  
    */
    this.initVelocity = function() {

	// intialise a random velocity based on the size
	// of the particles (all particles have equal energy)
	var v1 = Math.random()*4.0-2.0;
	var k1 = Math.pow(125.0/Math.pow(this.radius,3),0.5);
	var vel = createVector(k1*v1,k1*v1);
	return vel
	
    }    

    // Particle attributes
    this.pos = createVector(x,y); // position vector
    this.radius = r;              // radius
    this.vel = this.initVelocity();     // velocity vector
    this.acc = createVector(0,0); // current acceleration vector
    this.acc_old = this.acc;      // previous acceleration vector
    this.mass = 1;                // mass (fixed for now)
    
    // Particle Methods
    this.update = function(dt) {

	/* Compute the new acceleration, position and
	   velocity vectors using the Velocity Verlet algorithm
	   with time-step dt. Constant acceleration is
	   assumed for the moment. */
	
	this.update_acc(dt)
	this.update_pos(dt)
	this.update_vel(dt)

    }

    this.show = function() {

	/* Draw the particle as an circle on
	   the canvas. Size is controlled by
	   the particle radius. */
	
	fill(46,138,222);
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


} // end of Particle class
