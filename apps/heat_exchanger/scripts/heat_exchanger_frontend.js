// VCE Project - heat_exchanger_frontend.js
//
// This script drives the shell and tube heat exchanger application.
//
//
// Requires:
// - p5.js or p5.min.js
// - vce_utils.js
//
// Andrew D. McGuire 2018
// a.mcguire227@gmail.com
//
// To do:
// - make a test backend
// - make temporary canvas outputs to aid backend development
// - make fully functional heat exchanger backend class
// - make full heat exchanger graphics class
// - create a settings.js file for this app
//
// --------------------------------------------------
//               set-up variables
// --------------------------------------------------
var paused_log = false;
var debug = true;
var graphics,
    images = {};

// --------------------------------------------------
//             p5 visualisation functionality
// --------------------------------------------------
function preload() {
    // load the canvas images
    if (vce_online) {
	// define online image URL variables here
    } else {
	// define offline image URL variables here
    };
    // load images into 'images' here
};

function setup() {

    /* This function is called upon entry to create the
       simulation canvas which we draw onto.  */

    // Create the canvas
    var dimensions = utils.getSimBoxDimensions();
    var canvas= createCanvas(dimensions.xmax, screen.height*0.85);
    canvas.parent("sim_container");

    // Initialise the backend exchanger
    options = {};
    exchanger = new HeatExchanger(options);
    console.log(exchanger);
    
    // Initialise the graphical column representation
    graphics = new HeatExchangerGraphics(canvas, exchanger, images, debug);
    console.log(graphics);

    // Update any labels based on the initialised state
    update_labels();


    // test the backend
    console.log("duty = ", exchanger.duty());
    
}

function draw() {

    /* Draws background and img to the canvas.
       This function is continuously called for the
       lifetime of the scripts executions after setup()
       has completed. Effectively advances time. */

    if (!(paused_log)) {
	// step the system forward in time
	graphics.update();
    };

    // render graphics
    graphics.show()
    
};

// --------------------------------------------------
//                 Styling updaters
// --------------------------------------------------
function update_labels() {
    // Update the UI labels so that they are conistant wit the
    // application state.
    update_bounds_button_label();
};


function update_bounds_button_label() {
    // update bounds button label
    if (!graphics.show_boundaries_log) {
	$("#bounds").text('Show Bounds');
    }
    else {
	$("#bounds").text('Hide Bounds');
    }    
};



// --------------------------------------------------
//                 UI event listners
// --------------------------------------------------
// run/pause button
$('#run').click(async function(){
    console.log("You just clicked stream/pause!");
    paused_log = !(paused_log);
    if (paused_log) {
	$("#run").text('Run');
	$('#run').prop('title', 'Un-pause the system');
    }
    else {
	$("#run").text('Pause');
	$('#run').prop('title', 'Pause the system');
    }
});


// show boundaries button
$('#bounds').click(async function(){
    // boundary show hide
    console.log("You just clicked show boundaries!");
    graphics.show_boundaries_log = !(graphics.show_boundaries_log);
    update_bounds_button_label();
});


// fullscreen functionality
const target = $('#target')[0]; // Get DOM element from jQuery collection
$('#fullscreen').on('click', () => {
    console.log("Fullscreen requested.");
    if (screenfull.enabled) {
	screenfull.toggle(target);
    };
});
