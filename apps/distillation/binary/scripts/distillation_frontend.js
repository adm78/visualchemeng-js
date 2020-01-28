// VCE Project - distillation_frontend.js
//
// This script facilitates the testing of a distillation simulation
// module.
//
//
// Requires:
// - p5.js or p5.min.js
// - vce_utils.js
//
// Andrew D. McGuire 2019
// a.mcguire227@gmail.com
//
// To do:
// - walls show functionality should just be handled by the boundaries themselves
// - add particles to conderser
//
// --------------------------------------------------
//               set-up variables
// --------------------------------------------------
var paused_log = false;
var debug = true;
var isDragging = false;
var Graphics, column, 
    images = {};

// --------------------------------------------------
//             p5 visualisation functionality
// --------------------------------------------------
function preload() {
    // load the canvas images
    if (!vce_online) {
	var column_img_URL = "../../images/distillation_grey.svg";
	var feed_img_URL = "../../images/feed_pipe_with_hex.svg";
    } else {
	var column_img_URL = "http://visualchemeng.com/wp-content/uploads/2018/10/distillation_grey.svg";
	var feed_img_URL = "http://visualchemeng.com/wp-content/uploads/2019/03/feed_pipe_with_hex.svg";
    };
    images.column = loadImage(column_img_URL, pic => print(pic), utils.loadImgErrFix);
    images.feed = loadImage(feed_img_URL, pic => print(pic), utils.loadImgErrFix);
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]); // MathJax rendering
};

function setup(first_time=true) {

    /* This function is called upon entry to create the
       simulation canvas which we draw onto.  */

    // Create the canvas
    canvas = new VceCanvas(id="#sim_container", xmax=null, ymax=window.innerHeight*0.75);
    console.log(canvas);

    // Initialise the backend column properties
    var options = {
	xf : 0.5,
	xd : 0.95,
	xb : 0.05,
	P : 101.3e3, // Pa
	q : 0.5, //7.0/6.0,
	R : 6.692,
	x_eq_data : data.equilibrium_data.x,
	y_eq_data : data.equilibrium_data.y,
	F : 100.0,
	F_max : settings.F_max,
    };
    column = new DistMcCabeTheile(options);
    column.solve();
    
    // Initialise the graphical column representation
    init_graphics();

    // Initialise the McCabe-Thiele plot
    plot_mccabe_thiele_diagram(column, 'mccabe_thiele_container');
    
    // Update any labels based on the initialised state
    update_labels();
}


function draw() {

    /* Draws background and img to the canvas.
       This function is continuously called for the
       lifetime of the scripts executions after setup()
       has completed. Effectively advances time. */
    if (!paused_log) {
	Graphics.update(); // step the system forward in time
    };
    Graphics.show(); // render graphics
    
};

function init_graphics() {
    Graphics = new DistillationGraphics(canvas, column, images, debug);
};

// --------------------------------------------------
//                 Styling updaters
// --------------------------------------------------
function update_labels() {
    // Update the UI labels so that they are conistant wit the
    // application state.
    update_bounds_button_label();
    update_theory_button_label();
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

function update_theory_button_label() {
    // update theory button label
    if (Graphics.hide) {
	$("#theory").text('Hide Theory');
    }
    else {
	$("#theory").text('Show Theory');
    } 
};

function update_pause_button_label() {
    // update the pause button label
    if (paused_log) {
	$("#run").text('Run');
	$('#run').prop('title', 'Un-pause the simulation');
    }
    else {
	$("#run").text('Pause');
	$('#run').prop('title', 'Pause the simulation');
    }
};

// --------------------------------------------------
//                 UI event listners
// --------------------------------------------------
// run/pause button
$('#run').click(async function(){
    console.log("You just clicked stream/pause!");
    paused_log = !(paused_log);
    update_pause_button_label();
});


// restart/reset button
$('#restart').click(async function(){
    setup();
});


// show boundaries button
$('#bounds').click(async function(){

    // boundary show hide
    Graphics.show_boundaries_log = !(Graphics.show_boundaries_log);
    update_bounds_button_label();
});

// theory button
$('#theory').click(async function(){

    // toggle theory mode
    paused_log = !paused_log;
    Graphics.hide = !(Graphics.hide);
    update_theory_button_label();
    if (Graphics.hide) {
	noLoop(); // stop the draw loop
	canvas.hide();
	// Show the theory container
	var theory_container = select('#theory_container');
	theory_container.show();
	theory_container.style('width', canvas.width.toString());
	theory_container.style('height', canvas.height.toString());
    } else {
	select('#theory_container').hide()
	loop(); // start te draw loop)
	canvas.show();
    };

});


// fullscreen functionality
const target = $('#target')[0]; // Get DOM element from jQuery collection
$('#fullscreen').on('click', () => {
    console.log("Fullscreen requested.");
    if (screenfull.enabled) {
	screenfull.toggle(target);
    };
});


// resize elements on window resize
window.onresize = function() {
    if (screenfull.isFullscreen) {
	canvas.stretch();
	utils.stretch('#theory_container');
    } else {
	canvas.reset();
	utils.stretch('#theory_container');
    };
    init_graphics();
    utils.resizePlotlyHeight('mccabe_thiele_container');
};


function mouseDragged() {
    if (isDragging) {
	for (var key in Graphics.valves) {
	    var valve = Graphics.valves[key];
	    if (valve.active) {
		valve.drag_handle(mouseX, mouseY);
		if (key == 'reflux') {
		    column.R = Graphics.valves.reflux.flow_capacity()*(settings.R_max - settings.R_min) + settings.R_min;
		    column.solve();
		    Graphics.reflux_update();
		} else if (key == 'feed') {
		    column.F = Graphics.valves.feed.position()*settings.F_max;
		    column.solve();
		    Graphics.feed_flow_update();
		} else if (key == 'preheater') {
		    column.q = Graphics.valves.preheater.position()*(settings.q_max - settings.q_min) + settings.q_min;
		    column.solve();
		    Graphics.q_update();
		};
		
	    };
	};
	plot_mccabe_thiele_diagram(column, 'mccabe_thiele_container');
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
