// VCE Project - heatrod.js
//
// This script facilitates the simple modelling of a heat rod
//
// Requires:
// - p5.js or p5.min.js
// - vce_utils.js
//
// Fraser M. Baigent, Andrew D. McGuire 2018
// a.mcguire227@gmail.com
//----------------------------------------------------------

// --------------------------------------------------
//             visualisation functionality
// --------------------------------------------------
var debug = false;
var paused_log = false;
var restarting_log = false;
var num_meth_changing = false;

var t= 0.0; //initial time
var L; // Bar length
var t_end; //simulation end time 

var debug = false;
var img;
var sys = 0;
var ic = getProperties(sys);
var sid;
var chem_sys = 0; // chemical system index
var myFont;
var ndraws = 0; // counter for drawing the stream

// visual set-up globals (can be tuned)

var img_shrink_factor = 0.60; // height of flash svg as fraction of canvas height (float, >0, <=1)
var paused_log = false; // logical to paused the stream updates
var resetting_log = false; // logical to indicate a reset is underway
var bar_temp_changing_log = false; //logical to indicate that chemical system is being changed
var outlet_freq = 1; // # draws/stream replenish (int)
var fr = 40;    // target frame rate

function preload() {
    // preload the flash tank image and fontan images that are required

     URL = "../modules/heatrod/assets/vector/heatrod.svg";
     img = loadImage(URL, pic => print(pic), loadImgErrFix);

};

function setup() {

    /* This function is called upon entry to create the
       simulation canvas which we draw onto */

    var dimensions = getSimBoxDimensions();
    xmax = dimensions.xmax;
    ymax = dimensions.ymax;
    console.log("xmax=",xmax);
    console.log("ymax=",ymax);
    var canvas= createCanvas(xmax, ymax);
    canvas.parent("sim_container");

    // intialise a solution
    

    // draw the bar charts to screen and set slider values/ranges

    
    // initialise the sliders
    updateAllSliders()

    
    // draw background any preloaded images to screen
    background(51);

    // pre-compute key canvas positions


}

function draw() {

    /* Draws background and img to the canvas.
       This function is continuously called for the
       lifetime of the scripts executions after setup()
       has completed. */

    // draw any images to the canvas (including preloaded ones)
    background(51);

    // draw any reuired text on the canvas
    updateCanvasText();


    // seqeunce of functions to be called to generate canvas animations
    if (!(paused_log)) {


    };
};

function updateCanvasText() {

    // write somehting to the canvas
    textSize(32);
    fill(255, 255, 255);
    textAlign(CENTER);    
    text('IF YOU CAN READING THIS, I\'M ALIVE' , xmax/2.0, ymax/2.0);

};


//--------------------------------------------------------------------
//                   UI functions
//--------------------------------------------------------------------
function update_TL() {
    if (!resetting_log && !chem_sys_changing_log) {
	flash.updateP($( "#k1_slider" ).slider( "value"));
	flash.solve_PTZF(debug=debug);
	plotCompositionData(flash,debug=debug);
    };
};

function update_TR() {
    if (!resetting_log && !chem_sys_changing_log) {
	flash.updateT($( "#k2_slider" ).slider( "value"));
	flash.solve_PTZF();
	plotCompositionData(flash);
    };
};

function update_T0() {
    if (!resetting_log && !chem_sys_changing_log) {
	flash.updateT($( "#k3_slider" ).slider( "value"));
	flash.solve_PTZF();
	plotCompositionData(flash);
    };
};

function update_L() {
    if (!resetting_log && !chem_sys_changing_log) {
	flash.updateT($( "#k4_slider" ).slider( "value"));
	flash.solve_PTZF();
	plotCompositionData(flash);
    };
};

function update_t() {
    if (!resetting_log && !chem_sys_changing_log) {
	flash.updateT($( "#k5_slider" ).slider( "value"));
	flash.solve_PTZF();
	plotCompositionData(flash);
    };
};

//--------------------------------------------------------------------
//                  UI event listeners
//--------------------------------------------------------------------
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

// restart button
$('#restart').click(async function(){

    // restart button functionality
    //
    // the bool is there so the sliders can check it,
    // otherwise. changing the range/value can break them
    
    resetting_log = true;
    console.log("You just clicked restart!");
    resetting_log = false;

});

function updateAllSliders() {
    
    // update all sliders at once
    
    updateTLSlider(); 
    updateTRSlider(); 
    updateT0Slider(); 
    updateLSlider();
    updatetSlider();

};


function updateTLSlider() {
    //Left side temperature slider
    var tl_range = getRanges(sys).tl;
    $( "#k1_slider" ).slider({
	orientation: "vertical",
	range: "min",
	min: tl_range.min,
	max: 1.0,
	step: 1.0/20.0,
	value: 0.0,
	slide: update_T1,
	change: update_T1
    });

    $( "#k1_slider" ).slider( "value", 0.5 );
};

function updateTRSlider() {
    
    $( "#k2_slider" ).slider({
	orientation: "vertical",
	range: "min",
	min: tl_range.min,
	max: tl_range.max,
	step: (t_range.min-tl_range.max) / 20.0,
	value: tl_range.min,
	slide: update_TL,
	change: update_TL
    });
    
    $( "#k2_slider" ).slider( "value", 0.5 );
};

function updateT0Slider() {
    
    $( "#k3_slider" ).slider({
	orientation: "vertical",
	range: "min",
	min: 0.0,
	max: 1.0,
	step: 1.0/20.0,
	value: 0.0,
	slide: update_A,
	change: update_A,
//	disabled: true
    });
    $( "#k3_slider" ).slider( "value", 0.5 );
};


function updateLSlider() {
    
    $( "#k4_slider" ).slider({
	orientation: "vertical",
	range: "min",
	min: 0.0,
	max: 1.0,
	step: 1.0/20.0,
	value: 0.0,
	slide: update_B,
	change: update_B,
//	disabled: true
    });
    $( "#k4_slider" ).slider( "value", 0.5 );
};


function updatetSlider() {

    $( "#k5_slider" ).slider({
	orientation: "vertical",
	range: "min",
	min: 0.0,
	max: 1.0,
	step: 1.0/20.0,
	value: 0.0,
	slide: update_C,
	change: update_C,
//	disabled: true
    });
    $( "#k5_slider" ).slider( "value", 0.5 );
};


// render selectors on full page load (jquery)
$(document).ready(function () {
    $('#num_method_selector').niceSelect();
});

// fullscreen functionality
const target = $('#target')[0]; // Get DOM element from jQuery collection
$('#fullscreen').on('click', () => {
    console.log("fullscreen requested");
    if (screenfull.enabled) {
	screenfull.toggle(target);
    }
});

// render selectors on full page load (jquery)
$(document).ready(function () {
    $('#system_id').niceSelect();
    $('#flash_type').niceSelect();
    var dimensions = getSimBoxDimensions();
    xmax = dimensions.xmax;
    ymax = dimensions.ymax;
    resizeCanvas(xmax, ymax);
});

// numerical method selector
$('#num_method_selector').on('change', function() {

    // To avoid breaking the sliders, you need a bool
    // to know when your changing the system, so you can check it
    // and skip ay slider updates that might get triggered before you
    // wanted them to...
    
    num_method_changing_log = true;
    console.log("-------potential numerical method change-------");
    num_method_changing_log = false;
})
