function Particle(x,y, xmax, ymax, r) {
    this.pos = createVector(x,y)
    this.xmax = xmax;
    this.ymax = ymax;
    this.radius = r;
    this.vel = createVector(random()*2.0-1.0,random()*2.0-1.0);
    //this.acc = createVector(getRandom(-1,1),getRandom(-1,1));
    this.acc = createVector(0,0);
    // var grav = createVector(0.0,0.3)
    // this.acc = grav
    this.acc_old = this.acc;
    this.mass = 1;



    this.update = function(dt) {

	// compute the new position and velocity vectors using the
	// Velocity Verlet algorithm with time-step dt.
	this.update_acc(dt)
	this.update_pos(dt)
	this.update_vel(dt)

    }

    this.show = function(dt) {
	stroke(46,138,222);
	strokeWeight(8);
	point(this.pos.x,this.pos.y);
	this.update(dt)
    }


    this.update_acc = function(dt) {

	this.acc_old = this.acc
	this.acc = this.acc
    }

    this.update_pos = function(dt) {

	var pos_1 = this.pos
	pos_1.add(p5.Vector.mult(this.vel, dt));
	var pos_2 = p5.Vector.mult(this.acc, 0.5*Math.pow(dt,2.0));
	this.pos = p5.Vector.add(pos_1, pos_2);
	this.apply_boundary_cond()
    }


    this.update_vel = function(dt) {

	var v_1 = this.vel;
	var a_sum = p5.Vector.add(this.acc, this.acc);
	var v_2 = p5.Vector.mult(a_sum, 0.5*dt);
	this.vel = p5.Vector.add(v_1, v_2);
    }

    this.apply_boundary_cond = function() {

	// simualte periodic boundary conditions
	if (this.pos.x >= this.xmax) {
	    this.pos.x = this.pos.x - this.xmax
	}
	if (this.pos.x < 0) {
	    this.pos.x = this.pos.x + this.xmax
	}
	if (this.pos.y >= this.ymax) {
	    this.pos.y = this.pos.y - this.ymax
	}
	if (this.pos.y < 0) {
	    this.pos.y = this.pos.y + this.ymax
	}
    }
}
