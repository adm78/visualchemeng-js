// VCE Project - simple_reactor.js
//
// This script facilitates the modelling of a simple batch reactor
// with the reaction:
//
// A + B --> C
//
// with rate k*CA*CB*V and k = A*exp(-RT/Ea).
//
// Requires:
// - p5.js or p5.min.js
// - plotly
// - vce_utils.js
// - vce_reaction.js
// - vce_impeller.js
//
// Andrew D. McGuire 2018
// a.mcguire227@gmail.com
//
// To do:
// - improve ensemble update efficiency
// - confine particles to the tank
//
//
// --------------------------------------------------
//               set-up variables
// --------------------------------------------------
var debug = false, paused_log = false,
    canvas,
    Reac,
    Graphics,
    n_init = 150,
    tank, imp_array,
    update_counter = 0,
    savedData = null;

const default_reactor_options = {
    components : settings.components,
    c0 : [settings.sliders.CA0.start,
	  settings.sliders.CB0.start,
	  settings.sliders.CC0.start],
    T : settings.sliders.T.start,
    A : 1.0,
    Ea : 10000.0,
    debug : debug
};
var reactor_options = deep_copy(default_reactor_options);


// --------------------------------------------------
//             p5 visualisation functionality
// --------------------------------------------------
function preload() {
    // load the canvas images (tank + impeller)
    var tank_URL = "../resources/reactor_ni.svg";
    var imp1_URL = "../resources/imp_0deg.svg";
    var imp2_URL = "../resources/imp_45deg.svg";
    var imp3_URL = "../resources/imp_90deg.svg";
    var imp4_URL = "../resources/imp_135deg.svg";
    tank = loadImage(tank_URL, pic => print(pic), loadImgErrFix);
    var imp1 = loadImage(imp1_URL, pic => print(pic), loadImgErrFix);
    var imp2 = loadImage(imp2_URL, pic => print(pic), loadImgErrFix);
    var imp3 = loadImage(imp3_URL, pic => print(pic), loadImgErrFix);
    var imp4 = loadImage(imp4_URL, pic => print(pic), loadImgErrFix);
    imp_array = [imp1, imp2, imp3, imp4];
};

function setup(first_time=true) {

    /* This function is called upon entry to create the
       simulation canvas which we draw onto.  */

    // Intialise the backend reactor
    Reac = new AnalyticalReactor(reactor_options);

    // Create the canvas
    var dimensions = getSimBoxDimensions();
    var canvas= createCanvas(dimensions.xmax, dimensions.ymax);
    canvas.parent("sim_container");
    
    // Initialise the graphical reactor
    Graphics = new ReactorGraphics(canvas, Reac, n_init, tank, imp_array, 0.8, debug);

    // Construct the plotly graph
    const layout = plotly_layout(Reac);
    Plotly.newPlot('conc_plot_container', get_traces(Reac),layout);

    // Plot any saved data
    if (savedData != null) {
	Plotly.addTraces('conc_plot_container', get_saved_traces(savedData, Reac));
    };
    console.log(savedData);
    
    // Initialise the sliders
    if (first_time) { update_sliders()};

}

function draw() {

    /* Draws background and img to the canvas.
       This function is continuously called for the
       lifetime of the scripts executions after setup()
       has completed. Effectively advances time. */

    if (!(paused_log)) {

	// step the reactor
	Reac.step(0.1);
	Graphics.update();
	// update the concentration plot
	if (Reac.t < 200.0 && update_counter % 5 == 0) {
	    var new_data = unpack_data(Reac);
	    Plotly.extendTraces('conc_plot_container', new_data, [0, 1, 2]);
	};
	update_counter += 1;
	if (update_counter > 5000) {update_counter = 0;};
    };


    // show all the other graphics
    Graphics.show()
    
};
// --------------------------------------------------
//                 Saving functionality
// --------------------------------------------------
function save_data(Reac) {
    // Save concentration time-series and stats for the current
    // simulations.
    var myplot = document.getElementById('conc_plot_container');
    savedData = {
	T : Reac.T,
	c0 : Reac.c0,
	data : myplot.data
    };
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
//                 Slider UI
// ----------------------------------------------
function update_sliders() {
    update_T_slider();
    update_CA0_slider();
    update_CB0_slider();
    update_CC0_slider();
};


function update_T_slider() {
    $( "#k1_slider" ).slider({
	orientation: "vertical",
	range: "min",
	min: settings.sliders.T.min,
	max: settings.sliders.T.max,
	step: settings.sliders.T.step,
	value: settings.sliders.T.start,
	slide: update_temp,
	change: update_temp
    });
    $( "#k1_slider" ).slider( "value", settings.sliders.T.start);
};
function update_temp() {
    reactor_options.T = $( "#k1_slider" ).slider("value");
    setup(first_time=false);        
};


function update_CA0_slider() {
    $( "#k2_slider" ).slider({
	orientation: "vertical",
	range: "min",
	min: settings.sliders.CA0.min,
	max: settings.sliders.CA0.max,
	step: settings.sliders.CA0.step,
	value: settings.sliders.CA0.start,
	slide: update_CA0,
	change: update_CA0
    });
    $( "#k2_slider" ).slider( "value", settings.sliders.CA0.start);
};
function update_CA0() {
    reactor_options.c0[0] = $( "#k2_slider" ).slider("value");
    setup(first_time=false);        
};


function update_CB0_slider() {
    $( "#k3_slider" ).slider({
	orientation: "vertical",
	range: "min",
	min: settings.sliders.CB0.min,
	max: settings.sliders.CB0.max,
	step: settings.sliders.CB0.step,
	value: settings.sliders.CB0.start,
	slide: update_CB0,
	change: update_CB0
    });
    $( "#k3_slider" ).slider( "value", settings.sliders.CB0.start);
};
function update_CB0() {
    reactor_options.c0[1] = $( "#k3_slider" ).slider("value");
    setup(first_time=false);        
};


function update_CC0_slider() {
    $( "#k4_slider" ).slider({
	orientation: "vertical",
	range: "min",
	min: settings.sliders.CC0.min,
	max: settings.sliders.CC0.max,
	step: settings.sliders.CC0.step,
	value: settings.sliders.CC0.start,
	slide: update_CC0,
	change: update_CC0
    });
    $( "#k4_slider" ).slider( "value", settings.sliders.CC0.start);
};
function update_CC0() {
    reactor_options.c0[2] = $( "#k4_slider" ).slider("value");
    setup(first_time=false);        
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

// save button
$('#save').click(async function(){

    // run/pause button functionality
    console.log("You just clicked save!");
    save_data(Reac);
    console.log(savedData);
});


// show boundaries button
$('#bounds').click(async function(){

    // boundary show hide
    console.log("You just clicked show boundaries!");
    Graphics.show_boundaries_log = !(Graphics.show_boundaries_log);
    update_bounds_button_label();
});


// reset button
$('#restart').click(async function(){

    // boundary show hide
    console.log("You just clicked reset!");
    reactor_options = deep_copy(default_reactor_options);
    setup();
    update_labels();
    
});


// fullscreen functionality
const target = $('#target')[0]; // Get DOM element from jQuery collection
$('#fullscreen').on('click', () => {
    console.log("Fullscreen requested.");
    if (screenfull.enabled) {
	screenfull.toggle(target);
    }
});
