var particles = [];
var part_to_init;
var r = 2;
var iters = 0;
var max_iters = 1;
var time = 0.0;
var clicked_log = false;
var xmax;
var ymax;
var time = 0.0;
var paused_log = true;

function setup() {
    xmax = min(772+28,windowWidth-2*28);
    ymax = xmax*0.618;
    var canvas= createCanvas(xmax, ymax);
    //part_to_init = Math.round(xmax*ymax/6000.0);
    part_to_init = 60;
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
    // set up stroke for progress box
    noStroke();
    fill(0)
    rect(0.9*xmax,0.9*ymax,0.1*xmax,0.1*ymax)
    fill(255)

    // step through time unless sim is paused
    if (!(paused_log)) {
      text("Running",0.91*xmax,0.9*ymax,0.2*xmax,0.1*ymax);
      var dt_step = 1.0;
      doStep(dt_step);
    }
    else {
      text("Paused",0.91*xmax,0.9*ymax,0.2*xmax,0.1*ymax);
    }
    // write the time to the screen
    stroke(255);
    strokeWeight(1);
    text(time.toString(),0.91*xmax,0.95*ymax,20,20);
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
    var dt_col;
    coll_list = getCollisionList(particles);
    if (coll_list.length < 1) {
      dt_col = dt + 1; // just needs to exceed dt
    } else {
      dt_col = (coll_list[0]).t;
    }

    // debug
    //console.log(coll_list);
    //console.log("dt_col = ", dt_col);

    // check for collisions in the current time
    if (dt < dt_col) {
	     // no collision in the time step
      advanceParticles(dt);
     time = time + dt;
     return 0
    }
    else  {
	     // collision has occured between the step
	      advanceParticles(dt_col);
        var firstEvent = coll_list[0];
        var p1 = particles[firstEvent.p1_index];
	      p1.highlight();
        if (!firstEvent.wc_log) {
          var p2 = particles[firstEvent.p2_index];
          p2.highlight();
        }
        //console.log("particle(s) should be highlighted...")
        //paused_log = true //debug only
        time = time + dt_col
    }
}

function getWallCollisionTime(Part) {
    // compute the first collision time with a wall.
    // return the wall object with t and wall (r,l,u,d)
        // no functionality for now.
    // check each wall in series
    return {
          t: 100000,
          wall: 'r'
    };
}


function getCollisionTime(Part1, Part2) {

    //compute the time to pass for a collsion to take place
    //currenrtly does not respect periodic boundary conditions!!!
    //console.log("Considering collision between:", Part1, Part2);

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

    // compute a sorted list of collision times.
    // we only want to hold the first collision time for any particle.
    var coll_list = []
    var col_time;
    var i, j;
    var firstEvent;
    var wc_time;
    var wall;

    for (i = 0; i < particles.length; i++) {

      var wall_collision = getWallCollisionTime(particles[i]);
      firstEvent = new Event('w',wall_collision.t,i,null,wall_collision.wall);
      //console.log("firstEvent = ", firstEvent)

	     for (j = i+1; j < particles.length; j++) {
	        if (i != j) {
		          //console.log("getCollisionList: i = ",i, " j = ",j);
		          col_time = getCollisionTime(particles[i],particles[j]);
              //console.log("col_time = ", col_time);
	            if (isNaN(col_time) != true) {
                if (col_time < firstEvent.t) {
                  firstEvent = new Event('p',col_time,i,j,null);
                }
              }
            }
        }
        coll_list.push(firstEvent);
    }
    coll_list.sort(function(a,b){return a.t - b.t});
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
    for (i = 0; i < Math.round(xmax/dx); i++) {
	     for (j = 0; j < Math.round(ymax/dx); j++) {
	        if (n_init < n) {
    		      parts[n_init] = new Particle(dx*(i+0.5),dx*(j+0.5),xmax,ymax,r);
	            parts[n_init].show();
              n_init = n_init + 1;
    	    };
        };
    };
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
    return dx
}

function addParticle() {
    var new_part = new Particle(mouseX,mouseY,xmax,ymax,r);
    particles.push(new_part);
}

function mousePressed() {
    paused_log = !(paused_log);
  }
