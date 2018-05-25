// VCE Project - mbp_test1.js
//
// Testing platform for the vce_particle.MultiBodyParticle class.
//
// Requires:
// - p5.js or p5.min.js
// - matter.js
// - vce_utils.js
// - vce_particle.js
// - vce_ensemble.js
//
// Andrew D. McGuire 2018
// a.mcguire227@gmail.com
//
// --------------------------------------------------
//               set-up variables
// --------------------------------------------------
var debug = false;
var paused_log = false;
var ensemble;
var boundaries = [];
var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Constraint = Matter.Constraint;
var sid;
var show_boundaries = false;

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
    sid = getImgScaledDimensions(tank, 0.6, ymax);
    
    // set-up the physics engine
    engine = Engine.create();
    world = engine.world;

    // initialise the ensemble
    ensemble = new Ensemble([],world);
    
    boundaries.push(new Boundary((xmax-sid.width)/2,
				 (ymax)/2,
				 20, sid.height*0.7, 0.0, world));
    boundaries.push(new Boundary((xmax+sid.width)/2,
				 (ymax)/2,
				 20, sid.height*0.7, 0.0, world));
    boundaries.push(new Boundary((xmax)/2,
				 (ymax+1.0*sid.height)/2,
				 sid.width, 20, 0.0, world));
    boundaries.push(new Boundary((xmax-sid.width*0.7)/2,
				 (ymax+0.9*sid.height)/2,
				 0.5*sid.width, 20, 0.7, world));
    boundaries.push(new Boundary((xmax+sid.width*0.7)/2,
				 (ymax+0.9*sid.height)/2,
				 0.5*sid.width, 20, 2*PI-0.7, world));

    
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
	ensemble.removeOutliers(xmax,ymax);
    };
    ensemble.show();
    if (show_boundaries) {
	    for (var i = 0; i < boundaries.length; i++) {
		boundaries[i].show();
	    };
    };
    //console.log(ensemble.particles.length, world.bodies.length);
};


//================================================
// Interactivity
//================================================
function mousePressed() {
    var two_part_options = TwoBodyParticleDefaults();
    two_part_options.world = world;
    two_part_options.x = mouseX;
    two_part_options.y = mouseY;
    ensemble.addParticle(new TwoBodyParticle(two_part_options));
    console.log(ensemble);
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

// show boundaries button
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
