// VCE Project - flash_frontend.js
//
// Flash tank simulation frontend script.
//
// Requires:
// - p5.js or p5.min.js
// - vce_utils.js
// - vce_particle.js
//
// @TODO: Reconnect disabled sliders to the flash backend state
// 
// Andrew D. McGuire 2017
// a.mcguire227@gmail.com
//----------------------------------------------------------
var debug = false;
var sysid = 0;
var flash;
var Graphics;
var paused_log = false; // logical to paused the stream updates
var resetting_log = false; // logical to indicate a reset is underway
var chem_sys_changing_log = false; //logical to indicate that chemical system is being changed
var isDragging = false; // valve variables
var images = {};
var canvas;


function preload() {
    // preload the images
    if (vce_online) {
	var flash_URL = "http://visualchemeng.com/wp-content/uploads/2018/01/flash.svg";
    } else {
	var flash_URL = "../../images/flash.svg";
    };
    images.tank = loadImage(flash_URL, pic => print(pic), utils.loadImgErrFix);
};


function setup() {
    /* This function is called upon entry to create the
       simulation canvas which we draw onto and run
       a very simple flash unit test */

    // create the canvas
    var dimensions = utils.getSimBoxDimensions();
    xmax = dimensions.xmax;
    ymax = dimensions.ymax;
    console.log("xmax=",xmax);
    console.log("ymax=",ymax);
    canvas = createCanvas(xmax, ymax);
    canvas.parent("sim_container");

    // initialise the backend
    var ic = data.sys[sysid].initial_conditions;
    flash = new Separator(ic.x,ic.y,ic.z,ic.L,ic.V,ic.F,ic.T,ic.P,ic.A,ic.components,debug);
    flash.solve_PTZF();

    // initialise the graphical representation object
    Graphics = new FlashGraphics(canvas, flash, images, sysid, debug);  

    // draw the bar charts to screen and set slider values/ranges
    plotCompositionData(flash);
    resizePlotlyContainers();
    
    // initialise the sliders
    updateAllSliders();

};

function draw() {

    /* Draws background and img to the canvas.
       This function is continuously called for the
       lifetime of the scripts executions after setup()
       has completed. */
    
    // update particle streams
    if (!(paused_log)) {
	Graphics.update();
    };

    Graphics.show();
};

function update_disabled_sliders(flash) {
    $( "#k3_slider" ).slider( "value", flash.F);
    $( "#k4_slider" ).slider( "value", flash.V);
    $( "#k5_slider" ).slider( "value", flash.L);
};


// @TODO: Move the plotting stuff to its own js file
function plotCompositionData(flash, debug=false) {

    if (debug) { console.log("flash.js: plotCompositionData: running plotCompositionData with input", flash) }


    var feed_data = [{
    x: utils.generateLabels(flash.z,'z'),
	y: flash.z,
	type: 'bar',
	marker: {
	    color : Graphics.colours()
	},
	text: flash.components,
	width: 0.3
    }];

    var tops_data = [{
	x: utils.generateLabels(flash.y,'y'),
	y: flash.y,
	type: 'bar',
	marker: {
	    color : Graphics.colours()
	},
	text: flash.components,
	width: 0.3
    }];

    var bottoms_data = [{
	x: utils.generateLabels(flash.x,'x'),
	y: flash.x,
	type: 'bar',
	marker: {
	    color : Graphics.colours()
	},
	text: flash.components,
	width: 0.3
    }];

    var flowrate_data = [{
	x: ['F', 'V', 'L'],
	y: [flash.F, flash.V, flash.L],
	type: 'bar',
	marker: {
	    color : '#2e8ade'
	},
	text: ['FEED','VAPOUR', 'LIQUID'],
	width: 0.3
    }];

    Plotly.newPlot('feedplotDiv', feed_data, feed_bar_chart_layout);
    Plotly.newPlot('topsplotDiv', tops_data, tops_bar_chart_layout);
    Plotly.newPlot('bottomsplotDiv', bottoms_data, bottoms_bar_chart_layout);
    Plotly.newPlot('flow_chart_container', flowrate_data, flowrate_bar_chart_layout);
};

function restartFlash(debug=false) {

    // effectively reload the page
    ic = data.sys[sysid].initial_conditions;
    if (debug) {console.log("flash.js: restartFlash: initial conditions before solve =", ic)};
    flash = new Separator(ic.x,ic.y,ic.z,ic.L, ic.V,ic.F,ic.T,ic.P,ic.A,ic.components,debug);
    flash.solve_PTZF();
    if (debug) {console.log("flash.js: restartFlash: flash after restart =", flash)};
};


//@TODO: move composition plotting to a seperate js file
// --------------------------------------------------
//              composition graph layout
// --------------------------------------------------
var base_bar_chart_layout = {

    margin : {
	l: 30,
	r: 30,
	b: 30,
	t: 35,
	pad: 5
    },
    titlefont: {
	family: 'Roboto, serif',
	size: 16,
	color: 'white'
    },
    hoverlabel: {bordercolor:'#333438'},
    plot_bgcolor: '#333438',
    paper_bgcolor: '#333438',
    height:200,
    xaxis: {
	fixedrange: true,
	showgrid: false,
	gridcolor: '#44474c',
	tickmode: 'auto',
	titlefont: {
	    family: 'Roboto, serif',
	    size: 18,
	    color: 'white'
	},
	tickfont: {color:'white'}
    },
    yaxis: {
	fixedrange: true,
	showgrid: true,
	gridcolor: '#44474c',
	tickmode: 'auto',
	titlefont: {
	    family: 'Roboto, serif',
	    size: 18,
	    color: 'white'
	},
	tickfont: {color:'white'}
    },
};

var feed_bar_chart_layout = jQuery.extend(true, {}, base_bar_chart_layout);
feed_bar_chart_layout.yaxis.range = [0,1.0];
feed_bar_chart_layout.title = 'Feed';

var tops_bar_chart_layout = jQuery.extend(true, {}, base_bar_chart_layout);
tops_bar_chart_layout.yaxis.range = [0,1.0];
tops_bar_chart_layout.title = 'Tops';

var bottoms_bar_chart_layout = jQuery.extend(true, {}, base_bar_chart_layout);
bottoms_bar_chart_layout.yaxis.range = [0,1.0];
bottoms_bar_chart_layout.title = 'Bottoms';

var flowrate_bar_chart_layout = jQuery.extend(true, {}, base_bar_chart_layout);
flowrate_bar_chart_layout.title = 'Flowrate/ kmol/hr';
var F_range = data.sys[sysid].range.F;
flowrate_bar_chart_layout.yaxis.range = [F_range.min, F_range.max];


// --------------------------------------------------
//              flash tank operations
// --------------------------------------------------
function update_pressure() {
    if (!resetting_log && !chem_sys_changing_log) {
	flash.updateP($( "#k1_slider" ).slider( "value"));
	flash.solve_PTZF(debug=debug);
	plotCompositionData(flash,debug=debug);
    };
};

function update_temp() {
    if (!resetting_log && !chem_sys_changing_log) {
	flash.updateT($( "#k2_slider" ).slider( "value"));
	flash.solve_PTZF();
	plotCompositionData(flash);
    };
};

function update_F() {
    if (!resetting_log && !chem_sys_changing_log) {
	var F_range = data.sys[sysid].range.F
    	flash.F = F_range.min + Graphics.valve.position*(F_range.max - F_range.min);
    	flash.solve_PTZF();
    	plotCompositionData(flash);
    };
};


function do_nothing() {};

function update_V() {};

function update_L() {};


//--------------------------------------------------------------------
//                  UI event listners
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
    resetting_log = true;
    console.log("You just clicked restart!");
    restartFlash(debug);
    updateAllSliders();
    resetting_log = false;
    plotCompositionData(flash, debug=false);
});

function updateAllSliders() {
    // update all sliders based on the initial
    // conditions of chemical system index 'sys'
    
    updatePSlider(); // pressure slider
    updateTSlider(); // temp slider
    updateFSlider(); // F slider
    updateVSlider(); // V slider
    updateLSlider(); // L slider  

};


function updatePSlider() {
    var P_range = data.sys[sysid].range.P;
    $( "#k1_slider" ).slider({
	orientation: "vertical",
	range: "min",
	min: P_range.min,
	max: P_range.max,
	step: (P_range.max-P_range.min)/200.0,
	value: P_range.min,
	slide: update_pressure,
	change: update_pressure
    });

    $( "#k1_slider" ).slider( "value", flash.P );
};

function updateTSlider() {
    var T_range = data.sys[sysid].range.T;
    $( "#k2_slider" ).slider({
	orientation: "vertical",
	range: "min",
	min: T_range.min,
	max: T_range.max,
	step: 1.0,
	value: T_range.min,
	slide: update_temp,
	change: update_temp
    });
    $( "#k2_slider" ).slider( "value", flash.T );
};

function updateFSlider() {
    var F_range = data.sys[sysid].range.F;
    $( "#k3_slider" ).slider({
	orientation: "vertical",
	range: "min",
	min: F_range.min,
	max: F_range.max,
	step: (F_range.max-F_range.min)/50.0,
	value: F_range.min,
	slide: do_nothing,
	change: do_nothing,
	disabled: true
    });
    $( "#k3_slider" ).slider( "value", flash.F );
};

function updateLSlider() {
    // bottoms flowrate slider
    var L_range = data.sys[sysid].range.L;
    $( "#k4_slider" ).slider({
	orientation: "vertical",
	range: "min",
	min: L_range.min,
	max: L_range.max,
	step: (L_range.max-L_range.min)/20.0,
	value: L_range.min,
	slide: update_L,
	change: update_L,
	disabled: true
    });
    $( "#k4_slider" ).slider( "value", flash.L );
};


function updateVSlider() {
    // tops flowrate slider
    var V_range = data.sys[sysid].range.V;
    $( "#k5_slider" ).slider({
	orientation: "vertical",
	range: "min",
	min: V_range.min,
	max: V_range.max,
	step: (V_range.max-V_range.min)/20.0,
	value: V_range.min,
	slide: update_V,
	disabled: true
    });
    $( "#k5_slider" ).slider( "value", flash.L );
};

function resizePlotlyContainers() {
    
    var d3 = Plotly.d3;
    var gd0 = d3.select("div[id='flow_chart_container']");
    var gd0_node = gd0.node();
    utils.resizePlotlyHeight(gd0_node,'flow_chart_container');
    var gd1 = d3.select("div[id='feedplotDiv']");
    var gd1_node = gd1.node();
    utils.resizePlotlyWidth(gd1_node,'feedplotDiv');
    var gd2 = d3.select("div[id='topsplotDiv']");
    var gd2_node = gd2.node();
    utils.resizePlotlyWidth(gd2_node,'topsplotDiv');
    var gd3 = d3.select("div[id='bottomsplotDiv']");
    var gd3_node = gd3.node();
    utils.resizePlotlyWidth(gd3_node,'bottomsplotDiv');
};

// resize on window resize
window.onresize = function() {
    resizePlotlyContainers();
    plotCompositionData(flash, debug);
};

// render selectors on full page load (jquery)
$(document).ready(function () {
    $('#system_id').niceSelect();
    $('#flash_type').niceSelect();
});

// fullscreen functionality
const target = $('#target')[0]; // Get DOM element from jQuery collection
$('#fullscreen').on('click', () => {
    console.log("fullscreen requested");
    if (screenfull.enabled) {
	screenfull.toggle(target);
    }
});

// chemical system selector
$('#system_id').on('change', function() {
    
    chem_sys_changing_log = true;
    console.log("-------potential chemical system change------");
    var old_sysid = sysid;
    console.log("old sysid = ", old_sysid);
    sysid = Number(this.value);
    console.log("new sys = ", sysid);   
    if (old_sysid != sysid) {
	restartFlash(debug);
	Graphics = new FlashGraphics(canvas, flash, images, sysid, debug);
	plotCompositionData(flash, debug=false);
	updateAllSliders();
    };
    chem_sys_changing_log = false;
})


// drag/valve control
function mouseClicked() {
    if (Graphics.valve.is_on_handle(mouseX, mouseY)) { Graphics.valve.click(); }
    else {Graphics.valve.unclick();};
};


function mousePressed() {
    var m = createVector(mouseX, mouseY);
    if (Graphics.valve.is_on_handle(mouseX, mouseY)) {
	isDragging = true;
	Graphics.valve.click();
    };
};


function mouseReleased() {
    // Note: This is important! Other things can be dragged after
    // clicking the Graphics.valve... like all the sliders.
    isDragging = false;
    Graphics.valve.unclick();
};


function mouseDragged() {
  if (isDragging) {
      Graphics.valve.drag_handle(mouseX, mouseY);
      update_F();
  };
};
