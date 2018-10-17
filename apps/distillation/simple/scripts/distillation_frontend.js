1// VCE Project - test_distillation_frontend.js
//
// This script facilitates the testing of a distillation simulation
// module.
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
// - fix outflow
// - walls show functionality should just be handled by the boundaries themselves
// - add particles to conderser
// - liquify tops outflow
//
// --------------------------------------------------
//               set-up variables
// --------------------------------------------------
var paused_log = false;
var debug = true;
var isDragging = false;
var Graphics,
    images = {};

// --------------------------------------------------
//             p5 visualisation functionality
// --------------------------------------------------
function preload() {
    // load the canvas images
    if (vce_online) {
	var column_img_URL = "../../images/distillation_grey.svg";
	var feed_img_URL = "../../images/feed_pipe.svg";
    } else {
	var column_img_URL = "http://visualchemeng.com/wp-content/uploads/2018/10/distillation_grey.svg";
	var feed_img_URL = "http://visualchemeng.com/wp-content/uploads/2018/10/feed_pipe.svg";
    };
    images.column = loadImage(column_img_URL, pic => print(pic), utils.loadImgErrFix);
    images.feed = loadImage(feed_img_URL, pic => print(pic), utils.loadImgErrFix);
};

function setup(first_time=true) {

    /* This function is called upon entry to create the
       simulation canvas which we draw onto.  */

    // Create the canvas
    var dimensions = utils.getSimBoxDimensions();
    var canvas= createCanvas(dimensions.xmax, screen.height*0.95);
    canvas.parent("sim_container");

    // Initialise the backend column properties THIS IS A TEST
    options = {};
    column = new DistTestBackend(options);
    column.n_stages = 20;
    column.feed_pos = 10;
    for (var i=0; i < column.n_stages; i++) {
	var stage = new Stage();
	stage.x = i/column.n_stages;
	stage.y = 1.0 - stage.x;
	column.stages.push(stage);
    };
    column.F = 100.0;
    column.Fmax = 200.0;
    column.R = 0.5;
    console.log(column);
    
    // Initialise the graphical column representation
    Graphics = new DistillationGraphics(canvas, column, images, debug);
    console.log(Graphics);

    // Update any labels based on the initialised state
    update_labels();

    
}

function draw() {

    /* Draws background and img to the canvas.
       This function is continuously called for the
       lifetime of the scripts executions after setup()
       has completed. Effectively advances time. */

    if (!(paused_log)) {
	// step the system forward in time
	Graphics.update();
    };

    // render graphics
    Graphics.show()
    
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
    if (!Graphics.show_boundaries_log) {
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
	$('#run').prop('title', 'Un-pause the reaction');
    }
    else {
	$("#run").text('Pause');
	$('#run').prop('title', 'Pause the reaction');
    }
});


// show boundaries button
$('#bounds').click(async function(){

    // boundary show hide
    console.log("You just clicked show boundaries!");
    Graphics.show_boundaries_log = !(Graphics.show_boundaries_log);
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


function mouseDragged() {
    if (isDragging) {
	for (var key in Graphics.valves) {
	    var valve = Graphics.valves[key];
	    if (valve.active) {
		valve.drag_handle(mouseX, mouseY);
	    };
	};
	Graphics.update_backend();
	Graphics.update_feed_rates();
    };
};

function mouseClicked() {
    for (var key in Graphics.valves) {
	var valve = Graphics.valves[key];
	if (valve.is_on_handle(mouseX, mouseY)) {
	    for (var key in Graphics.valves) {
		var alt_valve = Graphics.valves[key];
		alt_valve.unclick();
	    };
	    valve.click();
	    break;
	} else {
	    valve.unclick();
	};
    };
};


function mousePressed() {
    var m = createVector(mouseX, mouseY);
    console.log("mouse pressed!");
    for (var key in Graphics.valves) {
	var valve = Graphics.valves[key];
	if (valve.is_on_handle(mouseX, mouseY)) {
	    for (var key in Graphics.valves) {
		var alt_valve = Graphics.valves[key];
		alt_valve.unclick();
	    };
	    isDragging = true;
	    valve.click();
	    break;
	};
    };
};


function mouseReleased() {
    isDragging = false;
    for (var key in Graphics.valves) {
	var valve = Graphics.valves[key];
	valve.unclick();
    };
};
