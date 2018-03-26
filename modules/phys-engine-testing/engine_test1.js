// VCE Project - engine_test1.js
//
// A test of the matter.js physics engine in conjunction with p5.js
// A lot of this is based on Dan Shiffman's nature of code tutorial
// https://github.com/CodingTrain/website/blob/master/Courses/natureofcode/5.17_matter_intro/sketch.js
// https://github.com/CodingTrain/website/tree/master/Courses/natureofcode/5.18_matter_intro/*.js
//
// Requires:
// - p5.js or p5.min.js
// - matter.js
// - vce_utils.js
//
// Andrew D. McGuire 2018
// a.mcguire227@gmail.com
//
// --------------------------------------------------
//               set-up variables
// --------------------------------------------------
var debug = false;
var show_boundaries = false;
var paused_log = false;
var particles = [];
var boundaries = [];
var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies;
var sid;

// --------------------------------------------------
//             Visualisation functionality
// --------------------------------------------------
function preload() {
    var tank_URL = "../resources/reactor_ni.svg";
    tank = loadImage(tank_URL, pic => print(pic), loadImgErrFix);
};

function setup() {

    /* This function is called upon entry to create the
       simulation canvas which we draw onto  */

    // set-up the canvas
    //var dimensions = getSimBoxDimensions();
    xmax = 400;//dimensions.xmax;
    ymax = 400;//dimensions.ymax;
    var canvas= createCanvas(xmax, ymax);
    canvas.parent("sim_container");
    sid = getImgScaledDimensions(tank, 0.6);
    
    // set-up the physics engine
    engine = Engine.create();
    world = engine.world;
    
    boundaries.push(new Boundary((xmax-sid.width)/2,
				 (ymax)/2,
				 20, sid.height*0.7, 0.0));
    boundaries.push(new Boundary((xmax+sid.width)/2,
				 (ymax)/2,
				 20, sid.height*0.7, 0.0));
    boundaries.push(new Boundary((xmax)/2,
				 (ymax+1.0*sid.height)/2,
				 sid.width, 20, 0.0));
    boundaries.push(new Boundary((xmax-sid.width*0.7)/2,
				 (ymax+0.9*sid.height)/2,
				 0.5*sid.width, 20, 0.7));
    boundaries.push(new Boundary((xmax+sid.width*0.7)/2,
				 (ymax+0.9*sid.height)/2,
				 0.5*sid.width, 20, 2*PI-0.7));
    // boundaries.push(new Boundary(250, 300, xmax * 0.6, 20, -0.3));
    
};

function draw() {

    /* Draws background and img to the canvas.
       This function is continuously called for the
       lifetime of the scripts executions after setup()
       has completed. Effectively advances time. */
    
    background(51);
    imageMode(CENTER);
    image(tank, xmax/2 , ymax/2, sid.width, sid.height);
    if (!paused_log) {
	Engine.update(engine);
    };
    for (var i = 0; i < particles.length; i++) {
	particles[i].show();
	if (particles[i].isOffScreen(xmax,ymax)) {
	    particles[i].removeFromWorld(world);
	    particles.splice(i, 1);
	    i--;
	}
    }
    if (show_boundaries) {
	for (var i = 0; i < boundaries.length; i++) {
	    boundaries[i].show();
	}
    };

    //console.log(particles.length, world.bodies.length);
};

function mouseDragged() {
    particles.push(new PhysEngineParticle(world, mouseX, mouseY, random(5, 10)));
};

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

// run button
$('#restart').click(async function(){

    // boundary show hide
    console.log("You just clicked show boundaries!");
    show_boundaries = !(show_boundaries);
    if (!show_boundaries) {
	$("#restart").text('Show Bounds');
    }
    else {
	$("#restart").text('Hide Bounds');
    }
});


