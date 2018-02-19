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
//             visualisation functionality
// --------------------------------------------------
var debug = false;


function preload() {

};

function setup() {

    /* This function is called upon entry to create the
       simulation canvas which we draw onto and run
       a very simple flash unit test */

    var dimensions = getSimBoxDimensions();
    xmax = dimensions.xmax;
    ymax = dimensions.ymax;


}

function draw() {

    /* Draws background and img to the canvas.
       This function is continuously called for the
       lifetime of the scripts executions after setup()
       has completed. */


    background(51);
};

