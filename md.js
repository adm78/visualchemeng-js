var particles = [];
var part_to_init = 100;
var r = 2;
var dt = 1;

function setup() {
    var xmax = min(772+28,windowWidth-2*28);
    var ymax = xmax*0.618;
    var canvas= createCanvas(xmax, ymax);
    for (i = 0; i < part_to_init; i++) {
	particles[i] = new Particle(random(xmax),
				    random(ymax),
				    xmax,ymax,r);
    }
    var coll_times = getCollisionList(particles);
    console.log(coll_times);
}

function draw() {
    background(51);
    stroke(255);
    strokeWeight(4);
    for (i = 0; i < particles.length; i++) {
	particles[i].show(1);
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





