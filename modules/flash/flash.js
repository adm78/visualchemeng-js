// VCE Project - flash.js
//
// This script facilitates the simple modelling of a flash drum
//
// Requires:
// - p5.js or p5.min.js
// - vce_utils.js
// - vce_particle.js
//
// Andrew D. McGuire 2017
// a.mcguire227@gmail.com
//----------------------------------------------------------

// --------------------------------------------------
//             visualisation functionality
// --------------------------------------------------
var debug = false;
var img; // fash tank image object used by draw
var xmax;
var ymax;
var sys = 1;
var ic = getInitialConditions(sys);
flash = new Separator(ic.x,ic.y,ic.z,ic.L,
		      ic.V,ic.F,ic.T,ic.P,ic.A,ic.components,debug);
console.log("flash = ", flash);
var feed_stream = new Ensemble();
var tops_stream = new Ensemble();
var bottoms_stream = new Ensemble();
var feed_pos;
var tops_pos;
var bottoms_pos;
var sid;
var chem_sys = 0; // chemical system index
var myFont;
var ndraws = 0; // counter for drawing the stream

// visual set-up globals (can be tuned)
var rpart = 1.5; // stream particle radii (float)
var img_shrink_factor = 0.60; // height of flash svg as fraction of canvas height (float, >0, <=1)
var paused_log = false; // logical to paused the stream updates
var resetting_log = false; // logical to indicate a reset is underway
var chem_sys_changing_log = false; //logical to indicate that chemical system is being changed
var outlet_freq = 1; // # draws/stream replenish (int)
var gravity = 0.02;  // what it says on the tin
var pout = 0.5; // controls number of particle to output at a time
var pspeed = 1.0; // dt between particle updates
var kpert = 4.0; // particle perturbation scaling constant (float)
var fr = 40;    // target frame rate
var output_delay = 60; // contro delay between feed entering flash and first particle exit
var e_coeff = 0.3; // liquid-wall coefficent of restitution (kind of)

function preload() {
    // preload the flash tank image and font
    //URL = "http://visualchemeng.com/wp-content/uploads/2018/01/flash.svg";
    URL = "../modules/flash/assets/vector/flash.svg";
    img = loadImage(URL, pic => print(pic), loadImgErrFix);

};

function setup() {

    /* This function is called upon entry to create the
       simulation canvas which we draw onto and run
       a very simple flash unit test */

    var dimensions = getSimBoxDimensions();
    xmax = dimensions.xmax;
    ymax = dimensions.ymax;
    console.log("xmax=",xmax);
    console.log("ymax=",ymax);
    var canvas= createCanvas(xmax, ymax);
    canvas.parent("sim_container");
    flash.solve_PTZF();
    

    // draw the bar charts to screen and set slider values/ranges
    plotCompositionData(flash);
    resizePlotlyContainers();
    
    // initialise the sliders
    updateAllSliders();

    // draw the flash schematic to screen
    background(51);
    imageMode(CENTER);
    sid = getImgScaledDimensions(img);
    image(img, xmax/2 , ymax/2, sid.width, sid.height);
    frameRate(fr);

    // pre-compute key canvas positions
    feed_pos = getFeedPosition(sid,xmax);
    tops_pos = getTopsPosition(sid);
    bottoms_pos = getBottomsPosition(sid);


}

function draw() {

    /* Draws background and img to the canvas.
       This function is continuously called for the
       lifetime of the scripts executions after setup()
       has completed. */


    // draw the tanks and particle streams
    background(51);
    imageMode(CENTER);
    image(img, xmax/2 , ymax/2, sid.width, sid.height);
    feed_stream.show();
    tops_stream.show();
    bottoms_stream.show();

    //draw the operating param values to screen
    updateCanvasText(flash,sid);


    // update particle streams
    if (!(paused_log)) {

	// update exisiting particle positions
	feed_stream.update(pspeed);
	tops_stream.update(pspeed);
	bottoms_stream.update(pspeed);
	feed_stream.removeOutliers(0.5*(xmax-sid.width),2*ymax);
	tops_stream.removeOutliers(xmax,ymax);
	bottoms_stream.applyBoundary(0.98*ymax,e_coeff);
	bottoms_stream.removeOutliers(xmax,2*ymax);
	tops_stream.perturb(kpert/1.0,kpert/1.0);
	bottoms_stream.perturb(kpert/4.0,kpert/4.0);

	// add new particles at desired freq
    	if (ndraws % outlet_freq === 0) {

	    var colour = chooseColoursFromComposition(getColours(sys),flash)

	    // handle the feed stream
	    for (i=0; i < pout*flash.F; i++) {
		var new_feed_part1 = new Particle(feed_pos.x,feed_pos.y+0.01*sid.height,
						  rpart,1.0,2.0,0.0,null,
						  createVector(0,0), colour.z);
		var new_feed_part2 = new Particle(feed_pos.x,feed_pos.y-0.01*sid.height,
						  rpart,1.0,2.0,0.0,null,
						  createVector(0,0), colour.z);
		feed_stream.addParticle(new_feed_part1);
		feed_stream.addParticle(new_feed_part2);
	    };

	    // handle the delayed outlet and inlet streams
	    if (feed_stream.outliers >  output_delay) {
		for (i=0; i < pout*flash.V; i++) {
		    var new_tops_part = new Particle(tops_pos.x,tops_pos.y,rpart,
						     1.0,2.0,0.0,null,
						     createVector(0,-gravity), colour.y);
    		    tops_stream.addParticle(new_tops_part);

		};
		for (i=0; i < pout*flash.L; i++) {
		    var new_bottoms_part = new Particle(bottoms_pos.x,bottoms_pos.y,rpart,
							1.0,2.0,0.0,null,
							createVector(0,gravity), colour.x);
		    bottoms_stream.addParticle(new_bottoms_part);
		}
	    };
    	};

    	// prevent potential overflow
    	ndraws = ndraws + 1;
    	if (ndraws === 10000) {
    	    ndraws = 0;
    	};
    };
};

function updateCanvasText(flash, sid) {

    // write/update the canvas text based on
    // separator object 'flash' and scaled flash image
    // dimensions 'sid'.
    
    var T_string = flash.T.toFixed(0)+" K";
    var P_string = flash.P.toFixed(2)+" bar";
    var F_string_pos_x = 0.5*(xmax-sid.width);
    var F_string_pos_y = feed_pos.y-30;
    var V_string_pos_x = tops_pos.x;
    var V_string_pos_y = tops_pos.y-30;
    var L_string_pos_x = bottoms_pos.x;
    var L_string_pos_y = bottoms_pos.y+50;

    textSize(32);
    fill(255, 255, 255);
    textAlign(LEFT);    
    text(T_string, 10, 30);
    text(P_string, 10, 65);
    textAlign(CENTER);
    textSize(24);
    fill('#444');
    ellipse(F_string_pos_x,F_string_pos_y-8,30);
    ellipse(V_string_pos_x,V_string_pos_y-8,30);
    ellipse(L_string_pos_x,L_string_pos_y-8,30);
    fill(255, 255, 255);
    text("F", F_string_pos_x,F_string_pos_y);
    text("V", V_string_pos_x,V_string_pos_y);
    text("L", L_string_pos_x,L_string_pos_y);

    // update disabled sliders while we're here
    $( "#k4_slider" ).slider( "value", flash.V);
    $( "#k5_slider" ).slider( "value", flash.L);

};

function plotCompositionData(flash, debug=false) {

    if (debug) { console.log("flash.js: plotCompositionData: running plotCompositionData with input", flash) }


    var feed_data = [{
    x: generateLabels(flash.z,'z'),
	y: flash.z,
	type: 'bar',
	marker: {
	    color : getColours(sys)
	},
	text: flash.components,
	width: 0.3
    }];

    var tops_data = [{
	x: generateLabels(flash.y,'y'),
	y: flash.y,
	type: 'bar',
	marker: {
	    color : getColours(sys)
	},
	text: flash.components,
	width: 0.3
    }];

    var bottoms_data = [{
	x: generateLabels(flash.x,'x'),
	y: flash.x,
	type: 'bar',
	marker: {
	    color : getColours(sys)
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
    feed_stream = new Ensemble();
    tops_stream = new Ensemble();
    bottoms_stream = new Ensemble();
    ic = getInitialConditions(sys,debug);
    if (debug) {console.log("flash.js: restartFlash: initial conditions before solve =", ic)};
    flash = new Separator(ic.x,ic.y,ic.z,ic.L,
			  ic.V,ic.F,ic.T,ic.P,ic.A,ic.components,debug);
    flash.solve_PTZF();
    if (debug) {console.log("flash.js: restartFlash: flash after restart =", flash)};

};

function getFeedPosition(sid,xmax) {

    // return the position the feed stream should start
    var feed_x =  0.75*(0.5*xmax - 0.5*sid.width);
    var feed_y = (ymax/2.0)+0.05*sid.height;
    return createVector(feed_x,feed_y);
};


function getTopsPosition(sid) {

    // return the position of the tops exit as a p5 vector
    var tops_x = (xmax/2) + 0.5*sid.width;
    var tops_y = (ymax/2.0) - 0.475*sid.height;
    return createVector(tops_x,tops_y);

};

function getBottomsPosition(sid) {

    // return the position of the bottoms exit as a p5 vector
    var tops_x = (xmax/2.0) + 0.5*sid.width;
    var tops_y = (ymax/2.0) + 0.475*sid.height;
    return createVector(tops_x,tops_y);

};

function getImgScaledDimensions(img) {

    // return the scaled image dimensions
    var scaled_height =  ymax*img_shrink_factor;
    var scaled_width = img.width*scaled_height/img.height;
    return { width : scaled_width,
	     height: scaled_height }

};

function chooseColoursFromComposition(colours, sep) {

    // select a particle colour from a list, based on
    // compositions on flash solution s (Output object).
    var x_cum = [sep.x[0]];
    var y_cum = [sep.y[0]];
    var z_cum = [sep.z[0]];

    // generate cumulative composition lists
    for (var i = 1; i < sep.x.length; i++) {
	x_cum[i] = x_cum[i-1] + sep.x[i];
	y_cum[i] = y_cum[i-1] + sep.y[i];
	z_cum[i] = z_cum[i-1] + sep.z[i];
    };
    // choose a component
    var rndx = Math.random();
    for (var i = 0; i < x_cum.length; i++) {
	if (rndx <= x_cum[i]) {
	    var i_x = i;
	    break;
	}
    };
    var rndy = Math.random();
    for (var i = 0; i < y_cum.length; i++) {
	if (rndy <= y_cum[i]) {
	    var i_y = i;
	    break;
	}
    };
    var rndy = Math.random();
    for (var i = 0; i < y_cum.length; i++) {
	if (rndy <= y_cum[i]) {
	    var i_y = i;
	    break;
	}
    };
    var rndz = Math.random();
    for (var i = 0; i < z_cum.length; i++) {
	if (rndz <= z_cum[i]) {
	    var i_z = i;
	    break;
	}
    };
    return {x : colours[i_x],
	    y : colours[i_y],
	    z : colours[i_z]};
};
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
var F_range = getRanges(sys).F;
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
	flash.F = $( "#k3_slider" ).slider( "value");
	flash.solve_PTZF();
	plotCompositionData(flash);
    };
};

function update_V() {

};

function update_L() {

};

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
    var P_range = getRanges(sys).P;
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
    var T_range = getRanges(sys).T;
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
    var F_range = getRanges(sys).F;
    $( "#k3_slider" ).slider({
	orientation: "vertical",
	range: "min",
	min: F_range.min,
	max: F_range.max,
	step: (F_range.max-F_range.min)/50.0,
	value: F_range.min,
	slide: update_F,
	change: update_F
    });
    $( "#k3_slider" ).slider( "value", flash.F );
};

function updateLSlider() {
    // bottoms flowrate slider
    var L_range = getRanges(sys).L;
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
    var V_range = getRanges(sys).V;
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
    resizePlotlyHeight(gd0_node,'flow_chart_container');
    var gd1 = d3.select("div[id='feedplotDiv']");
    var gd1_node = gd1.node();
    resizePlotlyWidth(gd1_node,'feedplotDiv');
    var gd2 = d3.select("div[id='topsplotDiv']");
    var gd2_node = gd2.node();
    resizePlotlyWidth(gd2_node,'topsplotDiv');
    var gd3 = d3.select("div[id='bottomsplotDiv']");
    var gd3_node = gd3.node();
    resizePlotlyWidth(gd3_node,'bottomsplotDiv');
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
    var old_sys = sys;
    console.log("old sys = ", old_sys);
    sys = Number(this.value) + 1;
    console.log("new sys = ", sys);   
    if (old_sys != sys) {
	restartFlash(debug);
	plotCompositionData(flash, debug=false);
	updateAllSliders();
    };
    chem_sys_changing_log = false;
})
