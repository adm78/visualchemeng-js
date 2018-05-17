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
    tank, imp_array


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

function setup() {

    /* This function is called upon entry to create the
       simulation canvas which we draw onto  */

    var dimensions = getSimBoxDimensions();
    var canvas= createCanvas(dimensions.xmax, dimensions.ymax);
    canvas.parent("sim_container");
    
    //Show the state of the backend reactor
    Reac.stats(); // debug

    // Initialise the graphical reactor
    Graphics = new ReactorGraphics(canvas, Reac, n_init, tank, imp_array, 0.8, debug);
    console.log(Graphics);

    //Construct the plotly graph
    Plotly.newPlot('conc_plot_container',
		   get_traces(Reac),layout);

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
	var new_data = unpack_data(Reac);
	Plotly.extendTraces('conc_plot_container', new_data, [0, 1, 2]);
    };

    // draw some custom text to the screen


    // show all the other graphics
    Graphics.show()
    
};


function updateParticles(reac) {
    // Update the particle ensemble to relfect the current state of the
    // reactor.

};

// --------------------------------------------------
//                 Plotly formatting
// --------------------------------------------------
const layout = {
   margin : {
	l: 80,
	r: 50,
	b: 50,
	t: 20,
	pad: 5
    },
    //autosize: true,
    height: 300,
    titlefont: {
	family: "Railway",
	color: 'white',
	size: 24,
    },
    legend: {
	font: {color: 'white'}
    },
    hoverlabel: {bordercolor:'#333438'},
    plot_bgcolor: '#333438',
    paper_bgcolor: '#333333',//'black',
    xaxis: {
	autorange: false,
	autoscale: true,
	showgrid: true,
	gridcolor: '#44474c',
	tickmode: 'auto',
	range: [0,200.0],
	title: 'time/s',
	titlefont: {
	    family: 'Roboto, serif',
	    size: 18,
	    color: 'white'
	},
	tickfont: {color:'white'}
    },
    yaxis: {
	title: 'concentration/mol/m3',
	showgrid: true,
	gridcolor: '#44474c',
	autorange: false,
	autoscale: false,
	range: [0.0, Math.max.apply(Math, Reac.conc)*1.1],
	titlefont: {
	    family: 'Roboto, serif',
	    size: 18,
	    color: 'white'
	},
	tickfont: {color:'white'}
    }
};

// Plotly routines
function get_traces(reac) {
    
    var trace1 = {
	type: "scatter",
	mode: "lines",
	name: 'A',
	x: [reac.t],
	y: [reac.conc[0]],
	line: {color: '#008CBA'},
	maxdisplayed: 200/0.1
    };

    var trace2 = {
	type: "scatter",
	mode: "lines",
	name: 'B',
	x: [reac.t],
	y: [reac.conc[1]],
	line: {color: '#BC0CDF'},
	maxdisplayed: 200/0.1
    };

    var trace3 = {
	type: "scatter",
	mode: "lines",
	name: 'C',
	x: [reac.t],
	y: [reac.conc[2]],
	line: {color: '#00FF00'},
	maxdisplayed: 200/0.1
    };

    return [trace1, trace2, trace3];
};

function unpack_data(reac) {
    // unpacks storage data to extend plotly graph
    return{
	x: [[reac.t], [reac.t], [reac.t]],
	y: [[reac.conc[0]], [reac.conc[1]], [reac.conc[2]]]
    };
}

// --------------------------------------------------
//                 UI event listners
// --------------------------------------------------
// function mouseDragged() {
//   particles.push(new Particle(mouseX, mouseY, random(5, 10)));
// };
function mouseDragged() {
    Graphics.Ensembles[0].addParticle(new PhysEngineParticle(Graphics.world, mouseX, mouseY, random(5, 10)))
//    ensemble.addParticle(new PhysEngineParticle(world, mouseX, mouseY, random(5, 10)));
    console.log(Graphics.Ensembles[0]);
};

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
    if (!Graphics.show_boundaries_log) {
	$("#bounds").text('Show Bounds');
    }
    else {
	$("#bounds").text('Hide Bounds');
    }
});


