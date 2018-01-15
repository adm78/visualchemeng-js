// VCE Project - Molecular Dynamics script
//
// This script performs a simple, event-drive molecular dynamics
// simulation on a p5.js canvas.
//
// Requires:
// - p5.js or p5.min.js
// - particle.js
// - event.js
//
// Andrew D. McGuire 2017
// a.mcguire227@gmail.com
//----------------------------------------------------------

// Set-up parameters
var particles = [];    // particle array (to be filled with instances of the Particle class)
var r = null;          // particle radius to use (null = random in range)
var r_upper = 20;      // maximum radius
var r_lower = 5;       // minimum radius
var time = 0.0;        // global simulation time
var xmax;              // canvas x-width
var ymax;              // canvas y-width
var paused_log = true; // paused indicator bool


function setup() {

    /* This function is called upon entry to create the
       simulation canvas which we draw onto and the particle array.
       Canvas size and particle number is dependent on the window
       size. */

    var dimensions = getSimBoxDimensions();
    xmax = dimensions.xmax;
    ymax = dimensions.ymax;
    console.log("xmax=",xmax);
    console.log("ymax=",ymax);
    var canvas= createCanvas(xmax, ymax);
    canvas.parent("sim_container")
    restartParticles();
}

function draw() {

    /* This function drives the simulation forward in time.
       It's continuously called for the
       lifetime of the scripts executions after setup()
       has completed. */

    // set the background-up
    background(51);
    stroke(255);
    strokeWeight(1);

    // draw the particle to the canvas
    for (i = 0; i < particles.length; i++) {
	     particles[i].show();
    }

    // set up stroke for progress box
    noStroke();
    fill(0)
    rect(0.85*xmax,0.94*ymax,0.14*xmax,0.05*ymax)
    fill(255)

    // Step through time unless sim is paused,
    // reporting status in progress box.
    if (!(paused_log)) {
      var dt_step = 1000.0;
      doStep(dt_step);
    }
    writeTime();
}

function writeTime() {

    // Write the current simulation time to the process box
    stroke(255);
    strokeWeight(1);
    fill(255)
    textSize(Math.round(xmax/45.0))
    text("t = "+time.toFixed(0),0.86*xmax,0.95*ymax,0.12*xmax,0.04*ymax);
    //text("t = "+xmax,0.91*xmax,0.95*ymax,0.1*xmax,0.1*ymax);
}

function doStep(dt) {

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
    coll_list = getCollisionList(particles);
    if (coll_list.length < 1) {
      dt_col = dt + 1; // just needs to exceed dt
    } else {
      dt_col = (coll_list[0]).t;
    }

    // Check for collisions in the current time
    if (dt < dt_col) {
	// No collision in the time step
	advanceParticles(dt);
	time = time + dt;
	return 0
    }
    else  {
	// Collision has occured between the step
	// so, carry it out. Highlighting the particles
	// involved.
	advanceParticles(dt_col);
        var firstEvent = coll_list[0];
	highlightEventParticles(firstEvent)
	performCollision(firstEvent);
        time = time + dt_col
    }
}

function highlightEventParticles(CurrentEvent) {

    /* Highlight the particle(s) involved in
       an event

       args:
       CurrentEvent - a valid Event object
    */

    var p1 = particles[CurrentEvent.p1_index];
    p1.highlight();
    if (CurrentEvent.p2_index) {
        var p2 = particles[CurrentEvent.p2_index];
        p2.highlight();
    }
}

function getWallCollisionTime(Part) {

    /* Compute the first collision time with between
       particle Part and any wall */

    // returns object with attributes
    var t    // first collision time
    var wall // wall associated with first collision

    // locals vars
    var t_side // side wall collision time
    var t_ud   // top or bottom wall collision time
    var w_side // which side wall ('r' or 'l')
    var w_ud   // top or bottom wall first? ('u' ,d')

    // side walls
    if (Part.vel.x > 0) {
	t_side = (xmax - Part.pos.x - Part.radius)/Part.vel.x;
	w_side = 'r';
    } else if (Part.vel.x < 0) {
	t_side = (0 - Part.pos.x + Part.radius)/Part.vel.x;
	w_side = 'l';
    } else {
	// particle not moving in x direction
	t_side = NaN;
	w_side = null;
    }

    // top and bottom
    if (Part.vel.y > 0) {
	t_ud = (ymax - Part.pos.y - Part.radius)/Part.vel.y;
	w_ud = 'd';
    } else if (Part.vel.y < 0) {
	t_ud = (0 - Part.pos.y + Part.radius)/Part.vel.y;
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

    return {
        t: t,
        wall: wall
    };
}


function getCollisionTime(Part1, Part2) {

    /* Compute the time until collision
       between particle Part1 and Part2.

       return time as NaN if no collision
       time solution found */

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

    /* Returns an array of collision Event objects,
       ordered by their time attribute
       (smallest to largest, NaNs at the end)

       args:
       particles - an array of Particle objects */

    // return
    var coll_list = []

    // local vars
    var col_time;
    var i, j;
    var firstEvent;
    var wc_time;
    var wall;

    // loop through the particle array
    for (i = 0; i < particles.length; i++) {

	var wall_collision = getWallCollisionTime(particles[i]);
	firstEvent = new Event('w',wall_collision.t,i,null,wall_collision.wall);

	for (j = i+1; j < particles.length; j++) {
	    if (i != j) {
		col_time = getCollisionTime(particles[i],particles[j]);

		// Replace firstEvent if coll time is smaller than current
		// firstEvent.time
	        if (isNaN(col_time) != true) {
                    if (col_time < firstEvent.t) {
			firstEvent = new Event('p',col_time,i,j,null);
                    }
		}
            }
        }
	// Add to the collision list if event is valid
	if (firstEvent.t != NaN) {
            coll_list.push(firstEvent);
	}
    }
    // Sort the Event array and return it
    coll_list.sort(function(a,b){return a.t - b.t});
    return coll_list
}

function performCollision(event) {

    /* Apply collision operator according according to event

       args:
       event - a valid Event object
    */

    if (event.wc_log) {
	// Perform wall collision
	if (event.wall === 'r' || event.wall === 'l') {
	    particles[event.p1_index].reflect_side();
	} else if (event.wall === 'u' || event.wall === 'd') {
	    particles[event.p1_index].reflect_top();
	} else {
	    console.log("Error: performCollision: invalid event");
	    console.log(event);
	}
    } else {
	// Perform binary particle collision
	var J = impulse(particles[event.p1_index],
			particles[event.p2_index]);
	particles[event.p1_index].apply_impulse(J.x,J.y);
	particles[event.p2_index].apply_impulse(-J.x,-J.y);
    }
}

function impulse(Part1,Part2) {

    /* Compute the impulse associated with a particle-particle
       collision
       https://introcs.cs.princeton.edu/java/assignments/collisions.html

       J = 2*m1*m2*(dv*dr)/(sigma*(m1+m2))

       args:
       Part1 - valid Particle object
       Part2 - valid Particle object
    */
    var dr = createVector(Part2.pos.x - Part1.pos.x,
			  Part2.pos.y - Part1.pos.y);
    var dv = createVector(Part2.vel.x - Part1.vel.x,
			  Part2.vel.y - Part1.vel.y);
    var sigma = Part1.radius + Part2.radius;
    var hmm = 2*Part1.mass*Part2.mass/(Part1.mass + Part2.mass);
    var J = p5.Vector.dot(dv,dr)*hmm/sigma;
    return {
	x: J*dr.x/sigma,
	y: J*dr.y/sigma
    };

}

function advanceParticles(dt) {

    /* Advance the ensemble forward in time by dt
       in a straight line trajectory (no collisions) */

    for (i = 0; i < particles.length; i++) {
      particles[i].update(dt);
    }
}


function initParticles(n,r,xmax, ymax) {

    /* Intialise n particles with radius r in box with
       dimensions (xmax,ymax)
       such that there are no overlapping particles

       return:
       particle - an array of Particle objects
    */

    var parts = [];
    var dx = initialSpacing(n, xmax, ymax);
    var n_init = 0 ;
    for (i = 0; i < Math.round(xmax/dx); i++) {
	for (j = 0; j < Math.round(ymax/dx); j++) {
	    if (n_init < n) {
    		parts[n_init] = new Particle(dx*(i+0.5),dx*(j+0.5),getRadius());
	        parts[n_init].show();
		n_init = n_init + 1;
    	    };
        };
    };
    return parts
}

function initialSpacing(n, x, y) {

    /* Returns the intialise spacing
       between particles to put n particles
       on a uniform grid with limits x, y */

    var num1 = -(x+y);
    var num2sqred = Math.pow(x+y,2.0) + 4.0*x*y*(n-1);
    var num2 = Math.pow(num2sqred, 0.5);
    var den = 2.0*(n-1);
    var dx = (num1 + num2) / den;
    return dx
}

function addParticle() {

    // Add a new Particle object to the particles array
    var new_part = new Particle(mouseX,mouseY,getRadius());
    particles.push(new_part);
}

function restartParticles() {
    // re-intialises the particle ensemble
    paused_log = true;
    var dimensions = getSimBoxDimensions();
    xmax = dimensions.xmax;
    ymax = dimensions.ymax;
    var part_to_init = Math.round(xmax*ymax/5000.0);
    particles = initParticles(part_to_init,getRadius(),xmax,ymax);
};

//--------------------------------------------------------------------
//                  Visualisation functionality
//--------------------------------------------------------------------

function mouseinSimBox() {

    if (0 < mouseX && mouseX < xmax && 0 < mouseY && mouseY < ymax) {
	return true;
    };
    return false;
}

function mousePressed() {

    // Act on left mouse press
    if (mouseinSimBox()) {addParticle()};
}


function getSimBoxDimensions() {
        //get the dimension of the simbox
        var sb_ymax = document.getElementById('sim_container').offsetHeight;
        var sb_xmax = $('#sim_container').outerWidth()*0.97;
        return {ymax: sb_ymax,
                xmax: sb_xmax};
};

function getRadius() {
    return Math.random()*(r_upper-r_lower) + r_lower;
}
//--------------------------------------------------------------------
//                  UI event listners
//--------------------------------------------------------------------
// run button
$('#run').click(async function(){

    // run/pause button functionality
    console.log("You just clicked stream/pause!");
    paused_log = !(paused_log);
    if (paused_log) {
	$("#run").text('Run');
    }
    else {
	$("#run").text('Pause');
    }
});

// restart button
$('#restart').click(async function(){

    // restart button functionality
    console.log("You just clicked restart!");
    restartParticles();
    if (paused_log) {
	$("#run").text('Run');
    }
    else {
	$("#run").text('Pause');
    }
})

// full screen button
const target = $('#target')[0]; // Get DOM element from jQuery collection
$('#fullscreen').on('click', () => {
    console.log("fullscreen requested");
    if (screenfull.enabled) {
	screenfull.request(target);
    }
});
