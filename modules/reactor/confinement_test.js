// VCE Project - confinement_test.js
//
// This script is used to test the particle confinement class/routines.
//
// Requires:
// - p5.js or p5.min.js
// - ??x
//
//
// Andrew D. McGuire 2018
// a.mcguire227@gmail.com
//----------------------------------------------------------
// --------------------------------------------------
//               set-up variables
// --------------------------------------------------
var debug = false;
var paused_log = false;
var xmax;
var ymax;


// --------------------------------------------------
//             p5 visualisation functionality
// --------------------------------------------------
function setup() {

    /* This function is called upon entry to create the
       simulation canvas which we draw onto  */

    var dimensions = getSimBoxDimensions();
    xmax = dimensions.xmax;
    ymax = dimensions.ymax;
    var canvas= createCanvas(xmax, ymax);
    canvas.parent("sim_container");

}

function draw() {

    /* Draws background and img to the canvas.
       This function is continuously called for the
       lifetime of the scripts executions after setup()
       has completed. Effectively advances time. */

    rectMode(CENTER);
    fill(125,125,125);
    rect(xmax/2,ymax/2,100,100);
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
