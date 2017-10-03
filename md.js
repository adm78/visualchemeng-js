var particles = [];
var part_to_init;
var r = 2;
var iters = 0;
var max_iters = 1;
var time = 0.0;

function setup() {
    var xmax = min(772+28,windowWidth-2*28);
    var ymax = xmax*0.618;
    var canvas= createCanvas(xmax, ymax);
    part_to_init = Math.round(xmax*ymax/6000.0);
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
    //doStep(1e-09);
    console.log("time = ", time);
    iters = iters + 1;
    // debug
    if (iters > max_iters) {
	noLoop();
    }
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
    if (dt > dt_col) {
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
	time = time + dt_col
    }
    
	
}

function getCollisionTime(Part1, Part2) {
    //compute the time to pass for a collsion to take place
    //currenrtly does not respect periodic boundary conditions!!!
    var deltaVel = p5.Vector.sub(Part1.vel,Part2.vel)
    var deltaPos = p5.Vector.sub(Part1.pos,Part2.pos)
    var minDist = Part1.radius + Part2.radius
    var a = p5.Vector.dot(deltaVel, deltaVel)
    var b = 2.0*p5.Vector.dot(deltaPos,deltaVel)
    var c = p5.Vector.dot(deltaPos,deltaPos) - minDist*minDist
    var discrim = b*b - 4*a*c

    if ((discrim > 0) && (b < 0)) {
	var t1 = (-b - Math.sqrt(discrim))/(2*a)
	return t1
    }
    return NaN 
}

function getCollisionList(particles) {

    // compute a sorted list of collision times
    var coll_list = []
    for (i = 0; i < particles.length; i++) {
	for (j = i+1; j < particles.length; j++)
	    if (i != j) {
		var col_time = getCollisionTime(particles[i],particles[j])
		if (isNaN(col_time) != true) {
		    var coll = [col_time, i, j]
		    coll_list.push(coll)
		}
	    }		
    }
    coll_list.sort(function(a,b){return a[0] - b[0]})
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
	    if (n_init < n-1) {
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


