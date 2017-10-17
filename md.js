var particles = [];
var part_to_init;
var r = 2;
var iters = 0;
var max_iters = 1;
var time = 0.0;
var clicked_log = false;
var xmax;
var ymax;

function setup() {
    xmax = min(772+28,windowWidth-2*28);
    ymax = xmax*0.618;
    var canvas= createCanvas(xmax, ymax);
    //part_to_init = Math.round(xmax*ymax/6000.0);
    part_to_init = 66;
    console.log("xmax, ymax = ", xmax, ymax);
    console.log("part_to_init = ", part_to_init);
    particles = initParticles(part_to_init,r,xmax,ymax);
    console.log(particles);
}

function draw() {
    background(51);
    stroke(255);
    strokeWeight(1);
    for (i = 0; i < particles.length; i++) {
	particles[i].show();
    }
    doStep(0.25);
    console.log("time = ", time);
    // iters = iters + 1;
    // // debug
    // if (iters > max_iters) {
    // 	noLoop();
    // }
}

function delta_p(Part1, Part2) {

    // compute the collision momentum transfer
    var hmm = 2*Part1.mass*Part2.mass/(Part1.mass + Part2.mass);
    var v12 = p5.Vector.sub(Part1.vel,Part1.vel);
    var r12 = p5.Vector.sub(Part1.pos,Part1.pos);
    var sigma2 = Math.pow((Part1.radius + Part2.radius), 2);
    var v12r12 = p5.Vector.dot(v12,r12);
    var pf = hmm*v12r12/sigma2;
    var delta_p = p5.Vector.mult(r12,pf);

    return delta_p
}

function doStep(dt) {

    // this routine advances the system over the time interval dt
    coll_list = getCollisionList(particles);
    var dt_col = coll_list[0][0];

    // debug
    console.log(coll_list);
    console.log("dt_col = ", dt_col);

    // check for collisions in the current time
    if (dt < dt_col) {
	// no collision in the time step
	advanceParticles(dt);
	time = time + dt
	return 0
    }
    else  {
	// collision has occured between the step
	advanceParticles(dt_col);
	var p1 = particles[coll_list[0][1]];
	var p2 = particles[coll_list[0][2]];
	p1.highlight();
	p2.highlight();
	console.log("particles should be highlighted...")
	time = time + dt_col
    }
    
	
}

function getCollisonTime(v1,v2,p1,p2,r1,r2) {

    // get the collision time for a collision pair the following
    // properties
    var deltaVel = p5.Vector.sub(v1,v2);
    var deltaPos = p5.Vector.sub(p1,p2);
    var minDist = r1 + r2;
    var a = p5.Vector.dot(deltaVel, deltaVel);
    var b = 2.0*p5.Vector.dot(deltaPos,deltaVel);
    var c = p5.Vector.dot(deltaPos,deltaPos) - minDist*minDist;
    var discrim = b*b - 4*a*c;

    if (discrim > 0 && b < 0) {
	var t1 = (-b - Math.sqrt(discrim))/(2*a);
	return t1
    }
    console.log("getCollisonTime: discrim = ", discrim);
    return NaN     
}

function getCollisionTimeParticles(Part1, Part2) {

    // checks the collision time between Part1
    // and each reflection of Part2 and returns
    // the time of the first collision.
    var tmin;
    var tcurr;
    
    // generate the ficticous coordinates of each reflection
    var preflects = [
    	createVector(Part2.pos.x, Part2.pos.y - ymax),
    	createVector(Part2.pos.x, Part2.pos.y + ymax),
    	createVector(Part2.pos.x - xmax, Part2.pos.y),
    	createVector(Part2.pos.x + xmax, Part2.pos.y)
    ];
    console.log("Considering collision between:", Part1, Part2);
    tmin = getCollisonTime(Part1.vel,Part2.vel,Part1.pos,Part2.pos,Part1.radius,Part2.radius);
    console.log("tmin no reflect = ", tmin);
    var i;
    for (i = 0; i < preflects.length; i++) {
	console.log("testing for collision with i = ", i , ", coordinates =");
	console.log(Part1.vel,Part2.vel,Part1.pos,preflects[i],Part1.radius,Part2.radius);
    	tcurr = getCollisonTime(Part1.vel,Part2.vel,Part1.pos,preflects[i],Part1.radius,Part2.radius);
	console.log("tcurr = ", tcurr);
    	if (tcurr < tmin) {
    	    tmin = tcurr;
    	}
    }
    console.log("tmin = ", tmin);
    return tmin
    
}

function getCollisionList(particles) {

    // compute a sorted list of collision times
    var coll_list = []
    var i, j;
    for (i = 0; i < particles.length; i++) {
	for (j = i+1; j < particles.length; j++) {
	    if (i != j) {
		console.log("getCollisionList: i = ",i, " j = ",j);
		var col_time = getCollisionTimeParticles(particles[i],particles[j]);
		if (isNaN(col_time) != true) {
		    var coll = [col_time, i, j];
		    coll_list.push(coll);
		}
	    } else {
		console.log("getCollisionList: skipping i = ",i, " j = ",j);	
	    }
	};
    };
    coll_list.sort(function(a,b){return a[0] - b[0]});
    return coll_list
}

function advanceParticles(dt) {
    // advance the ensemble forward in time
    // in a straight line trajectory (no collisions)
    for (i = 0; i < particles.length; i++) {
	particles[i].update(dt);
    }
}


function initParticles(n,r,xmax,ymax) {
    // intialise n particles with radius r
    // such that there are no overlapping particles
    var parts = [];
    var dx = initialSpacing(n, xmax, ymax);
    var n_init = 0 ;
    // for (i = 0; i < part_to_init; i++) {
    // 	// particles[i] = new Particle(random(xmax),
    // 	// 			    random(ymax),
    // 	// 			    xmax,ymax,r);
    // 	particles[i] = new Particle(x0+i*dx,
    // 				    random(ymax),
    // 				    xmax,ymax,r);
    for (i = 0; i < Math.round(xmax/dx); i++) {
    	// particles[i] = new Particle(random(xmax),
    	// 			    random(ymax),
    	// 			    xmax,ymax,r);
	for (j = 0; j < Math.round(ymax/dx); j++) {
	    if (n_init < n) {
    		parts[n_init] = new Particle(dx*(i+0.5),dx*(j+0.5),xmax,ymax,r);
		console.log("intialised particle",n_init," with x, y = ", dx*(i+1),dx*(j+1));
		parts[n_init].show();
		n_init = n_init + 1;
    	    }	
	}
    }
    return parts
}

function initialSpacing(n, x, y) {
    // computes the intialise spacing
    // between particles to put n particles
    // on a uniform grid with limits x, y
    var num1 = -(x+y);
    var num2sqred = Math.pow(x+y,2.0) + 4.0*x*y*(n-1);
    var num2 = Math.pow(num2sqred, 0.5);
    var den = 2.0*(n-1);
    var dx = (num1 + num2) / den;
    console.log("initialSpacing: dx = ", dx);
    return dx
}

function addParticle() {
    var new_part = new Particle(mouseX,mouseY,xmax,ymax,r);
    particles.push(new_part);
}

function mousePressed() {
    addParticle()
  }
