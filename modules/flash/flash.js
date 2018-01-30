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
var ic = getInitialConditions();
flash = new Separator(ic.x,ic.y,ic.z,ic.L,
		      ic.V,ic.F,ic.T,ic.P,ic.A,debug);
console.log("flash = ", flash);
var feed_stream = new Ensemble();
var tops_stream = new Ensemble();
var bottoms_stream = new Ensemble();
var feed_pos;
var tops_pos;
var bottoms_pos;
var sid;

// visualt set-up globals
var rpart = 1.5;
var img_shrink_factor = 0.60;
var paused_log = false;
var ndraws = 0;
var outlet_freq = 1;
var gravity = 0.02;
var component_colours = ['#2e8ade','#de912e','#2ede71'];
//var cc = ['rgb(46,138,222)','rgb(222,145,46)','rgb(46,222,113)'];
var flash_solution;
var pout = 0.5; // controls number of particle to output at a time
var pspeed = 1.0;
var kpert = 4.0;
var fr = 40;
var testInput;
var output_delay = 60;
var e_coeff = 0.3; // liquid-wall coefficent of restitution (kind of)

function preload() {
    // preload the flash tank image
    //URL = "http://visualchemeng.com/wp-content/uploads/2018/01/flash.svg";
    URL = "flash.svg";
    img = loadImage(URL, pic => print(pic), loadImgErrFix);
}

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
    

    // draw the bar charts to screen
    plotCompositionData(flash); 
    
    
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
	    
	    var colour = chooseColoursFromComposition(component_colours,flash)

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

function plotCompositionData(flash, debug=false) {

    if (debug) { console.log("flash.js: plotCompositionData: running plotCompositionData with input", flash) }
    
    
    var feed_data = [{
    x: ['z1', 'z2', 'z3'],
	y: [flash.z[0], flash.z[1], flash.z[2]],
	type: 'bar',
	marker: {
	    color : component_colours
	},
	width: 0.3
    }];
    
    var tops_data = [{
	x: ['y1', 'y2', 'y3'],
	y: [flash.y[0], flash.y[1], flash.y[2]],
	type: 'bar',
	marker: {
	    color : component_colours
	},
	width: 0.3
    }];

    var bottoms_data = [{
	x: ['x1', 'x2', 'x3'],
	y: [flash.x[0], flash.x[1], flash.x[2]],
	type: 'bar',
	marker: {
	    color : component_colours
	},
	width: 0.3
    }];

    var flowrate_data = [{
	x: ['F', 'V', 'L'],
	y: [flash.F, flash.V, flash.L],
	type: 'bar',
	marker: {
	    color : '#2e8ade'
	},
	width: 0.3
    }];

    bar_chart_layout.yaxis.range = [0,getMaxComposition(flash)];
    bar_chart_layout.title = 'Feed';
    Plotly.newPlot('feedplotDiv', feed_data, bar_chart_layout);
    bar_chart_layout.title = 'Tops';
    Plotly.newPlot('topsplotDiv', tops_data, bar_chart_layout);
    bar_chart_layout.title = 'Bottoms';
    Plotly.newPlot('bottomsplotDiv', bottoms_data, bar_chart_layout);
    bar_chart_layout.title = 'Flowrates';
    var F_range = getRanges().F;
    bar_chart_layout.yaxis.range = [F_range.min, F_range.max];
    Plotly.newPlot('flow_chart_container', flowrate_data, bar_chart_layout);
};


function restart() {
    
    // effectively reload the page
    paused_log = true;
    feed_stream = new Ensemble();
    tops_stream = new Ensemble();
    bottoms_stream = new Ensemble();
    resetFlash(flash)
    flash.solve_PTZF();

};

function getMaxComposition(sep) {

    // return the maximum composition value
    // across all streams
    var max = sep.z[0];
    for (var i = 0; i < sep.z.length; i++) {
	if (sep.z[i] > max) {
	    max = sep.z[i];
	};
	if (sep.x[i] > max) {
	    max = sep.x[i];   
	}
	if (sep.y[i] > max) {
	    max = sep.y[i];   
	}
    };
    return 1.0;

}



function getFeedPosition(sid,xmax) {

    // return the position the feed stream should start
    var feed_x =  0.75*(0.5*xmax - 0.5*sid.width);
    var feed_y = (ymax/2.0)+0.05*sid.height;
    return createVector(feed_x,feed_y);
}


function getTopsPosition(sid) {

    // return the position of the tops exit as a p5 vector
    var tops_x = (xmax/2) + 0.5*sid.width;
    var tops_y = (ymax/2.0) - 0.475*sid.height;
    return createVector(tops_x,tops_y);

}

function getBottomsPosition(sid) {

    // return the position of the bottoms exit as a p5 vector
    var tops_x = (xmax/2.0) + 0.5*sid.width;
    var tops_y = (ymax/2.0) + 0.475*sid.height;
    return createVector(tops_x,tops_y);

}

function getImgScaledDimensions(img) {

    // return the scaled image dimensions
    var scaled_height =  ymax*img_shrink_factor;
    var scaled_width = img.width*scaled_height/img.height;
    return { width : scaled_width,
	     height: scaled_height }

}

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
var bar_chart_layout = {
    
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


// --------------------------------------------------
//              flash tank operations
// --------------------------------------------------
function resetFlash(flash) {
    var ic = getInitialConditions();
    flash = new Separator(ic.x,ic.y,ic.z,ic.L,
			  ic.V,ic.F,ic.T,ic.P,ic.A);
    return flash;
}

function getInitialConditions() {
    return {
	x : null,
	y : null,
	z : [0.5,0.3,0.2],
	P : 5,
	T : 390.0,
	A : [ [3.97786,1064.840,-41.136],
	      [4.00139,1170.875,-48.833],
	      [3.93002,1182.774,-52.532]],
	F : 20.0
    };
}

function getRanges() {

    // return an object containing
    // the limits of each slider prop
    return {
	P: {
	    min: 4.6,
	    max: 5.8
	},
	T: {
	    min:330,
	    max:450
	},
	F: {
	    min: 1.0,
	    max: 40.0
	},
	V: {
	    min: 0.0,
	    max: 40.0
	},
	L: {
	    min: 0.0,
	    max: 40.0
	}
    };  	
}

function update_pressure() {
    console.log("P = ", $( "#k1_slider" ).slider( "value"));
    flash.updateP($( "#k1_slider" ).slider( "value"));
    flash.solve_PTZF(debug=debug);
    plotCompositionData(flash,debug=debug);
};

function update_temp() {
    console.log("T = ", $( "#k2_slider" ).slider( "value"));
    flash.updateT($( "#k2_slider" ).slider( "value"));
    flash.solve_PTZF();
    plotCompositionData(flash);
};

function update_F() {
    console.log("F = ", $( "#k3_slider" ).slider( "value"));
    flash.F = $( "#k3_slider" ).slider( "value");
    flash.solve_PTZF();
    plotCompositionData(flash);
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
    console.log("You just clicked restart!");
    restart();
    if (paused_log) {
	$("#run").text('Run');
    }
    else {
	$("#run").text('Pause');
    }
});

// resize on full page load (jquery)
$(document).ready(function () {
    //resizeWindow()
});


// sliders
$( function() {
    // pressure slider
    var P_range = getRanges().P;
    $( "#k1_slider" ).slider({
	orientation: "horizontal",
	range: "min",
	min: P_range.min,
	max: P_range.max,
	step: 0.1,
	value: P_range.min,
	slide: update_pressure,
	change: update_pressure
    });
    
    $( "#k1_slider" ).slider( "value", flash.P );
} );


$( function() {
    // temp slider
    var T_range = getRanges().T;
    $( "#k2_slider" ).slider({
	orientation: "horizontal",
	range: "min",
	min: T_range.min,
	max: T_range.max,
	step: 0.1,
	value: T_range.min,
	slide: update_temp,
	change: update_temp
    });
    $( "#k2_slider" ).slider( "value", flash.T );
} );

$( function() {
    // feed flowrate slider
    var F_range = getRanges().F;
    $( "#k3_slider" ).slider({
	orientation: "horizontal",
	range: "min",
	min: F_range.min,
	max: F_range.max,
	step: 0.1,
	value: F_range.min,	
	slide: update_F,
	change: update_F
    });
    $( "#k3_slider" ).slider( "value", flash.F );
} );

$( function() {
    // bottoms flowrate slider
    var L_range = getRanges().L;
    $( "#k4_slider" ).slider({
	orientation: "horizontal",
	range: "min",
	min: L_range.min,
	max: L_range.max,
	step: 0.1,
	value: L_range.min,
	slide: update_L,
	change: update_L,
	disabled: true
    });
    $( "#k4_slider" ).slider( "value", flash.L );
} );

$( function() {
    // tops flowrate slider
    var V_range = getRanges().V;
    $( "#k5_slider" ).slider({
	orientation: "horizontal",
	range: "min",
	min: V_range.min,
	max: V_range.max,
	step: 0.1,
	value: V_range.min,
	slide: update_V,
	change: update_V,
	disabled: true
    });
    $( "#k5_slider" ).slider( "value", flash.L );
} );

