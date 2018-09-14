// VCE Project - simple_reactor_frontend.js
//
// Frontend script for modelling a simple batch reactor with the
// reaction:
//
// A + B --> C
//
// with rate k*CA*CB*V and k = A*exp(-RT/Ea).
//
// Requires:
// - p5.js or p5.min.js
// - plotly
// - jquery
// - vce_utils.js
// - vce_reaction.js
// - vce_impeller.js
// - settings.js
//
// Andrew D. McGuire 2018
// a.mcguire227@gmail.com
//
// To do:
//
//
// --------------------------------------------------
//               set-up variables
// --------------------------------------------------
var debug = settings.debug,
    paused_log = false,
    canvas,
    Reac,
    Graphics,
    n_init = 150,
    tank, imp_array,
    update_counter = 0,
    savedData = null;

const default_reactor_options = {
    components : settings.components,
    c0 : [settings.sliders.Ca0.start,
	  settings.sliders.Cb0.start,
	  settings.sliders.Cc0.start],
    T : settings.sliders.T.start,
    A : settings.reaction.A,
    Ea : settings.reaction.Ea,
    stoich : settings.reaction.stoich,
    debug : settings.debug
};
var reactor_options = utils.deep_copy(default_reactor_options);


// --------------------------------------------------
//             p5 visualisation functionality
// --------------------------------------------------
function preload() {
    // load the canvas images (tank + impeller)
    var tank_URL = "../../../../../lib/images/reactor_ni.svg";
    var imp1_URL = "../../../../../lib/images/imp_0deg.svg";
    var imp2_URL = "../../../../../lib/images/imp_45deg.svg";
    var imp3_URL = "../../../../../lib/images/imp_90deg.svg";
    var imp4_URL = "../../../../../lib/images/imp_135deg.svg";
    tank = loadImage(tank_URL, pic => print(pic), utils.loadImgErrFix);
    var imp1 = loadImage(imp1_URL, pic => print(pic), utils.loadImgErrFix);
    var imp2 = loadImage(imp2_URL, pic => print(pic), utils.loadImgErrFix);
    var imp3 = loadImage(imp3_URL, pic => print(pic), utils.loadImgErrFix);
    var imp4 = loadImage(imp4_URL, pic => print(pic), utils.loadImgErrFix);
    imp_array = [imp1, imp2, imp3, imp4];
};

function setup(first_time=true) {

    /* This function is called upon entry to create the
       simulation canvas which we draw onto.  */

    // Intialise the backend reactor
    Reac = new AnalyticalReactor(reactor_options);

    // Create the canvas
    var dimensions = utils.getSimBoxDimensions();
    var canvas= createCanvas(dimensions.xmax, dimensions.ymax);
    canvas.parent("sim_container");
    
    // Initialise the graphical reactor
    Graphics = new ReactorGraphics(canvas, Reac, n_init, tank, imp_array, 0.8, debug);

    // Construct the plotly graph
    Plotly.newPlot('conc_plot_container', get_conc_traces(Reac), plotly_conc_layout(Reac));

    // Render the conversion plot
    Plotly.newPlot('conversion_plot_container', get_conversion_trace(Reac), plotly_conversion_layout());

    // Render the duty plot
    Plotly.newPlot('duty_plot_container', get_duty_trace(Reac), plotly_duty_layout());


    // Plot any saved data
    if (savedData != null) {
	Plotly.addTraces('conc_plot_container', get_saved_conc_traces(savedData, Reac));
	Plotly.addTraces('duty_plot_container', get_saved_duty_trace(savedData, Reac));
	Plotly.addTraces('conversion_plot_container', get_saved_conversion_trace(savedData, Reac));
    };
    
    // Initialise the sliders
    if (first_time) { update_sliders()};

    // Re-size plots where required
    utils.resizePlotly('duty_plot_container');
    utils.resizePlotly('conversion_plot_container');
    
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
	// update the plots
	if (Reac.t < 200.0 && update_counter % 5 == 0) {
	    Plotly.extendTraces('conc_plot_container', unpack_conc_data(Reac), [0, 1, 2]);
	    Plotly.extendTraces('duty_plot_container', unpack_duty_data(Reac), [0]);
	    Plotly.extendTraces('conversion_plot_container', unpack_conversion_data(Reac), [0]);
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
    savedData = {
	T : Reac.T,
	c0 : Reac.c0,
	conc_data : document.getElementById('conc_plot_container').data,
	duty_data : document.getElementById('duty_plot_container').data,
	conv_data : document.getElementById('conversion_plot_container').data
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
    update_Ca0_slider();
    update_Cb0_slider();
    update_Cc0_slider();
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


function update_Ca0_slider() {
    $( "#k2_slider" ).slider({
	orientation: "vertical",
	range: "min",
	min: settings.sliders.Ca0.min,
	max: settings.sliders.Ca0.max,
	step: settings.sliders.Ca0.step,
	value: settings.sliders.Ca0.start,
	slide: update_Ca0,
	change: update_Ca0
    });
    $( "#k2_slider" ).slider( "value", settings.sliders.Ca0.start);
};
function update_Ca0() {
    reactor_options.c0[0] = $( "#k2_slider" ).slider("value");
    setup(first_time=false);        
};


function update_Cb0_slider() {
    $( "#k3_slider" ).slider({
	orientation: "vertical",
	range: "min",
	min: settings.sliders.Cb0.min,
	max: settings.sliders.Cb0.max,
	step: settings.sliders.Cb0.step,
	value: settings.sliders.Cb0.start,
	slide: update_Cb0,
	change: update_Cb0
    });
    $( "#k3_slider" ).slider( "value", settings.sliders.Cb0.start);
};
function update_Cb0() {
    reactor_options.c0[1] = $( "#k3_slider" ).slider("value");
    setup(first_time=false);        
};


function update_Cc0_slider() {
    $( "#k4_slider" ).slider({
	orientation: "vertical",
	range: "min",
	min: settings.sliders.Cc0.min,
	max: settings.sliders.Cc0.max,
	step: settings.sliders.Cc0.step,
	value: settings.sliders.Cc0.start,
	slide: update_Cc0,
	change: update_Cc0
    });
    $( "#k4_slider" ).slider( "value", settings.sliders.Cc0.start);
};
function update_Cc0() {
    reactor_options.c0[2] = $( "#k4_slider" ).slider("value");
    setup(first_time=false);        
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

// save button
$('#save').click(async function(){
    console.log("You just clicked save!");
    save_data(Reac);
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
    console.log("You just clicked reset!");
    reactor_options = utils.deep_copy(default_reactor_options);
    setup();
    update_labels();
});


// fullscreen functionality
const target = $('#target')[0]; // Get DOM element from jQuery collection
$('#fullscreen').on('click', () => {
    console.log("Fullscreen requested.");
    if (screenfull.enabled) {
	screenfull.toggle(target);
    };
});


// page resize actions
window.onresize = function() {
    utils.resizePlotly('duty_plot_container');
    utils.resizePlotly('conversion_plot_container');
};

// page full load actions
$(document).ready(function () {

});

// on-click functionality
function mousePressed() {
    if (utils.is_on_canvas(mouseX, mouseY, canvas)) {
	$('#run').click();
    };
};
