// VCE Project - biodieseil_reactor.js
//
// This script facilitates the modelling of sodium catalysed
// biodiesel reactor. 
//
// Requires:
// - p5.js or p5.min.js
// - vce_utils.js
// - 
//
// Andrew D. McGuire 2018
// a.mcguire227@gmail.com
//----------------------------------------------------------
// --------------------------------------------------
//               set-up variables
// --------------------------------------------------
var debug = false;
var xmax
var ymax

// --------------------------------------------------
//             p5 visualisation functionality
// --------------------------------------------------
function preload() {};

function setup() {

    /* This function is called upon entry to create the
       simulation canvas which we draw onto  */

    var dimensions = getSimBoxDimensions();
    xmax = dimensions.xmax;
    ymax = dimensions.ymax;
    var canvas= createCanvas(xmax, ymax);
    canvas.parent("sim_container");
    
    //Test the reactor
    unit_testReactor();

}

function draw() {

    /* Draws background and img to the canvas.
       This function is continuously called for the
       lifetime of the scripts executions after setup()
       has completed. Effectively advances time. */


    background(51);
    textSize(32);
    fill(255, 255, 255);
    textAlign(CENTER);    
    text("[INSERT REACTOR HERE]", xmax/2, ymax/2);
    
    
};

