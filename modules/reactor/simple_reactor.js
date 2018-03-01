// VCE Project - biodieseil_reactor.js
//
// This script facilitates the modelling of a simple CSTR.. 
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
var paused_log = false;
var xmax;
var ymax;
var reac;

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

    //Build the analytical reactor instance
    reac = new AnalyticalReactor();

}

function draw() {

    /* Draws background and img to the canvas.
       This function is continuously called for the
       lifetime of the scripts executions after setup()
       has completed. Effectively advances time. */

    if (!(paused_log)) {
	reac.step(0.1);
    };
    
    background(51);
    textSize(32);
    fill(255, 255, 255);
    textAlign(CENTER);
    text('reac.t = ' + reac.t.toFixed(1)+'s', xmax/2, ymax/2);
    
    
};

// --------------------------------------------------
//             reactor functionality
// --------------------------------------------------

function AnalyticalReactor() { 

    // The analytical reactor can be used to test a batch reactor with
    // simple reaction, where an analytical expression exists for the
    // temporal concentration evolutions. It inherets from the standard
    // Reactor class.

    // describe the reaction A + B => C
    var components = ['A','B','C'];
    var stoich = [1,1,-1]
    var A = 100.0;
    var Ea = 1000.0;
    var simple_reaction = Reaction(A,Ea,components,stoich,debug)
    var volume = null;
    var reactions = [simple_reaction];
    var c0 = [];
    var T = 298;

    // call the parent constructor
    Reactor.call(this,volume,reactions,components,c0,T,debug);

    this.step = function(dt) {
	// step the reactor forward in time by dt/s
	this.t = this.t + dt	
    };

    
};

// --------------------------------------------------
//                 UI event listners
// --------------------------------------------------
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
