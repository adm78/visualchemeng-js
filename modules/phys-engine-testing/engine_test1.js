// VCE Project - engine_test1.js
//
// A test of the matter.js physics engine in conjunction with p5.js
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
var paused_log = false;
var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies;

// --------------------------------------------------
//             Visualisation functionality
// --------------------------------------------------
function preload() {
    // var tank_URL = "../resources/reactor_ni.svg";
    // tank = loadImage(tank_URL, pic => print(pic), loadImgErrFix);
};

function setup() {

    /* This function is called upon entry to create the
       simulation canvas which we draw onto  */

    // set-up the canvas
    xmax = 400;
    ymax = 400;
    var canvas= createCanvas(xmax, ymax);
    canvas.parent("sim_container");

    // set-up the physics engine
    
}

function draw() {

    /* Draws background and img to the canvas.
       This function is continuously called for the
       lifetime of the scripts executions after setup()
       has completed. Effectively advances time. */
    
    background(51);
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
