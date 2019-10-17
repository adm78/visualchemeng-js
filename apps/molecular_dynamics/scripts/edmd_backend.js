// VCE Project - Event-Driven Molecular Dynamics Backend
//
// This library contains the various routines required to run a simple
// event-driven molecular dynamics simulation.
//
// Requires:
// - p5.js or p5.min.js
// - vce_particle.js
// - event.js
//
// Andrew D. McGuire 2019
// a.mcguire227@gmail.com
//----------------------------------------------------------
function EDMDSimulation(canvas) {

    this.particles = [];    // particle array (to be filled with instances of the Particle class)
    this.time = 0.0;
    this.ensemble_full = false; // ensemble full bool
    
    this._canvas = canvas; // A canvas object
    this._collision_list = []; // An array of Event objects
        
    // config parameters
    this.r = null;          // particle radius to use (null = random in range)
    this.r_upper = 20;      // maximum radius
    this.r_lower = 5;       // minimum radius


    // class public methods
    this.initialise_particles(n,r,xmax, ymax) {

	/* Intialise n particles with radius r in box with
	   dimensions (xmax,ymax)
	   such that there are no overlapping particles	*/

	this.particles = [];
	var dx = initialSpacing(n, xmax, ymax);
	var n_init = 0 ;
	var n_try = 0;
	for (i = 0; i < Math.round(xmax/dx); i++) {
	    for (j = 0; j < Math.round(ymax/dx); j++) {
		if (n_try < n) {
		    var particle_options =  { radius : getRadius() };
		    potential_part = new Particle(dx*(i+0.5),dx*(j+0.5),particle_options);
		    // On small screens, there may be some overlap with the wall
		    if (particleInSimBox(potential_part)) {
    			this.particles[n_init] = potential_part;
			n_init = n_init + 1;
		    };
		    n_try = n_try + 1;
		
    		};
            };
	};
    };

    
    this.step = function(dt) {

	/* Advances the particle ensemble over the
	   time interval dt, or to the next collision time,
	   whichever comes first.
	   If a collision is detected within (time,time+dt)
	   then it's carried out and the sim time is updated.

	   args:
	   dt - time to try and advance simulation by
	*/

	// Compute the time to the next collision
	var dt_col;
	this._collision_list = this._get_new_collision_list(this.particles);
	if (this._collision_list.length < 1) {
	    dt_col = dt + 1; // just needs to exceed dt
	} else {
	    dt_col = (this._collision_list[0]).t;
	}

	// Check for collisions in the current time
	if (dt < dt_col) {
	    // No collision in the time step
	    this._advance_particles(dt);
	    this.time = this.time + dt;
	}
	else  {
	    // Collision has occured between the step
	    // so, carry it out. Highlighting the particles
	    // involved.
	    this._advance_particles(dt_col);
	    this._collide(this.first_event());
            this.time = this.time + dt_col
	}
    };

    this.add_particle = function(particle) {
	// return bool indication success/fail of particle addition
	if (!this._overlap_exists(particle)) {
	    this.particles.push(particle);
	    return true;
	};
	return false;
    };


    this.first_event = function() {
	return this._collision_list[0];
    };

    this._get_new_collision_list() {

	/* Returns an array of collision Event objects,
	   ordered by their time attribute
	   (smallest to largest, NaNs at the end)

	   args:
	   particles - an array of Particle objects */

	var new_collision_list = []
	var col_time;
	var i, j;
	var first_event;

	// loop through the particle array
	for (i = 0; i < this.particles.length; i++) {

	    var wall_collision_event = this.get_wall_collision_event(this.particles[i]);
	    first_event = wall_collision_event; 

	    for (j = i+1; j < this.particles.length; j++) {
		if (i != j) {
		    col_time = this._get_collision_time(this.particles[i],this.particles[j]);

		    // Replace first_event if coll time is smaller than current
		    // first_event.time
	            if (isNaN(col_time) != true) {
			if (col_time < first_event.t) {
			    first_event = new Event('p',col_time,i,j,null);
			}
		    }
		}
            }
	    // Add to the collision list if event is valid
	    if (first_event.t != NaN) {
		new_collision_list.push(first_event);
	    }
	}
	// Sort the Event array and return it
	new_collision_list.sort(function(a,b){return a.t - b.t});
	return new_collision_list;
    }
    
    this._get_wall_collision_event = function(part_index) {

	/* Compute the first collision time with between
	   particle with index part_index and any wall */

	// locals vars
	var t_side // side wall collision time
	var t_ud   // top or bottom wall collision time
	var w_side // which side wall ('r' or 'l')
	var w_ud   // top or bottom wall first? ('u' ,d')
	var part = this.particles[part_index]
	
	// side walls
	if (part.vel.x > 0) {
	    t_side = (xmax - part.pos.x - part.radius)/part.vel.x;
	    w_side = 'r';
	} else if (part.vel.x < 0) {
	    t_side = (0 - part.pos.x + part.radius)/part.vel.x;
	    w_side = 'l';
	} else {
	    // particle not moving in x direction
	    t_side = NaN;
	    w_side = null;
	}

	// top and bottom
	if (part.vel.y > 0) {
	    t_ud = (ymax - part.pos.y - part.radius)/part.vel.y;
	    w_ud = 'd';
	} else if (part.vel.y < 0) {
	    t_ud = (0 - part.pos.y + part.radius)/part.vel.y;
	    w_ud = 'u';
	} else {
	    // particle not moving in y direction
	    t_ud = NaN;
	    w_ud = null;
	}

	if (t_side === NaN && t_ud === NaN) {
	    // part is stationary
	    t = NaN;
	    wall= null;
	} else if (t_side <= t_ud) {
	    t = t_side;
	    wall = w_side;
	} else {
	    t = t_ud;
	    wall = w_ud;
	}
	return new Event('w', t, i, null, wall);
    };


    this._advance_particles = function(dt) {

	/* Advance the ensemble forward in time by dt
	   in a straight line trajectory (no collisions) */

	for (i = 0; i < this.particles.length; i++) {
	    this.particles[i].update(dt);
	}
    };

    this._collide = function(event) {

	/* Apply collision operator according according to event

	   args:
	   event - a valid Event object
	*/

	if (event.wc_log) {
	    // Perform wall collision
	    if (event.wall === 'r' || event.wall === 'l') {
		this.particles[event.p1_index].reflect_side();
	    } else if (event.wall === 'u' || event.wall === 'd') {
		this.particles[event.p1_index].reflect_top();
	    } else {
		console.log("Error: collide: invalid event");
		console.log(event);
	    }
	} else {
	    // Perform binary particle collision
	    var J = this._get_impulse(this.particles[event.p1_index],
				      this.particles[event.p2_index]);
	    this.particles[event.p1_index].apply_impulse(J.x,J.y);
	    this.particles[event.p2_index].apply_impulse(-J.x,-J.y);
	}
    };

    this._get_collision_time = function(part_1, part_2) {

	/* Compute the time until collision between particle part_1 and
	   part_2.

	   return time as NaN if no collision time solution found */

	var deltaVel = p5.Vector.sub(part_1.vel,part_2.vel);
	var deltaPos = p5.Vector.sub(part_1.pos,part_2.pos);
	var minDist = part_1.radius + part_2.radius;
	var a = p5.Vector.dot(deltaVel, deltaVel);
	var b = 2.0*p5.Vector.dot(deltaPos,deltaVel);
	var c = p5.Vector.dot(deltaPos,deltaPos) - minDist*minDist;
	var discrim = b*b - 4*a*c;

	if ((discrim > 0) && (b < 0)) {
	    var t1 = (-b - Math.sqrt(discrim))/(2*a);
	    return t1;
	}
	return NaN;
    };


    this._get_impulse = function(part_1,part_2) {

	/* Compute the impulse associated with a particle-particle
	   collision
	   https://introcs.cs.princeton.edu/java/assignments/collisions.html

	   J = 2*m1*m2*(dv*dr)/(sigma*(m1+m2))

	   args:
	   part_1 - valid Particle object
	   part_2 - valid Particle object
	*/
	var dr = createVector(part_2.pos.x - part_1.pos.x,
			      part_2.pos.y - part_1.pos.y);
	var dv = createVector(part_2.vel.x - part_1.vel.x,
			      part_2.vel.y - part_1.vel.y);
	var sigma = part_1.radius + part_2.radius;
	var hmm = 2*part_1.mass*part_2.mass/(part_1h.mass + part_2.mass);
	var J = p5.Vector.dot(dv,dr)*hmm/sigma;
	return {
	    x: J*dr.x/sigma,
	    y: J*dr.y/sigma
	};

    };


    this._get_initial_spacing = function(n, x, y) {

	/* Returns the intialise spacing
	   between particles to put n particles
	   on a uniform grid with limits x, y */

	var num1 = -(x+y);
	var num2sqred = Math.pow(x+y,2.0) + 4.0*x*y*(n-1);
	var num2 = Math.pow(num2sqred, 0.5);
	var den = 2.0*(n-1);
	var dx = (num1 + num2) / den;
	return dx;
    };

    this._overlap_exists = function(part) {
	
	// Checks the ensemble for particle/wall overlaps,
	// returns a bool
	
	if (!this._particle_in_sim_box(part)) {
    	    return true;
	}
	for (i=0; i < this.particles.length; i++) {
	    if (this._overlap_exists_particle(part, this.particles[i])) {
		return true;
	    };
	};
	return false;
    }

    this._overlap_exists_particle = function(p1, p2) {
	// Check if particles p1 and p2 overlap	
	if (distParticles(p1,p2) < p1.radius + p2.radius) {
	    return true;
	};
	return false;
    };

    this._dist = function(p1, p2) {
	// return the distance between two particles
	var dx2 = Math.pow(p1.pos.x - p2.pos.x,2.0);
	var dy2 = Math.pow(p1.pos.y - p2.pos.y,2.0);
	return Math.pow(dx2 + dy2, 0.5);
    };

    
};




























function randomMove(part) {
    
    // translate a particle by a small random amount, ensuring the
    // resulting position lies within the sim box.

    while (true) {
	var old_x = part.pos.x;
	var old_y = part.pos.y;
        part.pos.x = part.pos.x + part.radius*(Math.random()*2.0-1.0);
        part.pos.y = part.pos.y + part.radius*(Math.random()*2.0-1.0);
        // reject if we're outwith the sim box
        if (!particleInSimBox(part)) {
	    part.pos.x = old_x;
	    part.pos.y = old_y;
        }
	else { break;};
    }
    return part;
}

function particleInSimBox(part) {
    
    // check if the part lies completely within the sim box
    
    if (0 < part.pos.x - part.radius
	&& part.pos.x + part.radius < xmax
	&& 0 < part.pos.y - part.radius
	&& part.pos.y+ part.radius < ymax) {
	return true
    };
    return false;
};
