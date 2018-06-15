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
//----------------------------------------------------------
// --------------------------------------------------
//               set-up variables
// --------------------------------------------------
var debug = false, paused_log = false,
    canvas, 
    Reac = new AnalyticalReactor(),
    Graphics,
    n_init = 150,
    tank, imp_array,
    update_counter = 0;
    


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

    var dimensions = getSimBoxDimensions();
    var canvas= createCanvas(dimensions.xmax, dimensions.ymax);
    canvas.parent("sim_container");
    
    // Show the state of the backend reactor
    Reac.stats(); // debug

    // Initialise the graphical reactor
    Graphics = new ReactorGraphics(canvas, Reac, n_init, tank, imp_array, 0.8, debug);
    console.log(Graphics);

    // Construct the plotly graph
    const layout = plotly_layout(Reac);
    Plotly.newPlot('conc_plot_container', get_traces(Reac),layout);

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
    Reac = new AnalyticalReactor();
    Reac.T = $( "#k1_slider" ).slider("value");
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
    Reac = new AnalyticalReactor();
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
