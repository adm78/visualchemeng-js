// VCE Project - biodieseil_reactor.js
//
// This script facilitates the modelling of a simple CSTR.. 
//
// Requires:
// - p5.js or p5.min.js
// - vce_utils.js
// - vce_reaction.js
//
//
// Andrew D. McGuire 2018
// a.mcguire227@gmail.com
//----------------------------------------------------------
// --------------------------------------------------
//               set-up variables
// --------------------------------------------------
var debug = false;
var paused_log = false;
var xmax;
var ymax;
var reac = new AnalyticalReactor();

// --------------------------------------------------
//             p5 visualisation functionality
// --------------------------------------------------
function preload() {};

function setup() {

    /* This function is called upon entry to create the
       simulation canvas which we draw onto  */

    var dimensions = getSimBoxDimensions();
    xmax = dimensions.xmax;
    ymax = dimensions.ymax;
    var canvas= createCanvas(xmax, ymax);
    canvas.parent("sim_container");
    
    //Test the reactor
    unit_testReactor();

    //Test the analytical reactor instance
    reac.stats();

    //Construct the plotly graph
    Plotly.newPlot('conc_plot_container',
		   get_traces(reac),layout);

}

function draw() {

    /* Draws background and img to the canvas.
       This function is continuously called for the
       lifetime of the scripts executions after setup()
       has completed. Effectively advances time. */

    if (!(paused_log)) {

	reac.step(0.1);

	// Update the concentration plot
	var new_data = unpack_data(reac);
	Plotly.extendTraces('conc_plot_container', new_data, [0, 1, 2]);
    };
    
    background(51);
    textSize(32);
    fill(255, 255, 255);
    textAlign(CENTER);
    text('reac.t = ' + reac.t.toFixed(1)+'s', xmax/2, ymax/2);
    text('Na = ' + reac.conc[0].toFixed(3) +
	 '  Nb = ' + reac.conc[1].toFixed(3) +  
	 '  Nc = ' + reac.conc[2].toFixed(3),
	 xmax/2, 0.65*ymax);


    
    
};

// --------------------------------------------------
//             reactor functionality
// --------------------------------------------------

function AnalyticalReactor() { 

    // The analytical reactor can be used to test a batch reactor with
    // simple reaction, where an analytical expression exists for the
    // temporal concentration evolutions. It inherets from the standard
    // Reactor class.
    // 
    // Assumptions:
    // - constant volume
    // - constant T

    // describe the reaction A + B => C
    var components = ['A','B','C'];
    var stoich = [1,1,-1]
    var A = 1.0;
    var Ea = 10000.0;
    var simple_reaction = new Reaction(A,Ea,components,stoich,debug)
    console.log("simple reaction = ", simple_reaction);
    var reactions = [simple_reaction];
    var V = 1.0;
    var c0 = [1.0, 2.0, 0.0];
    var T = 298;

    // call the parent constructor
    Reactor.call(this,V,reactions,components,c0,T,debug);

    this.step = function(dt) {

	// step the reactor forward in time by dt/s

	var Na0 = this.c0[0];
	var Nb0 = this.c0[1];
	var Nc0 = this.c0[2];
	var alpha = Nb0 - Na0;
	var num = Na0*alpha;
	var k = this.reactions[0].k(this.T)
	var exp = Math.exp(+k*alpha*this.t/this.V)
	var den = Nb0*exp-Na0;
	var Na = num/den;
	var Nb = Na + Nb0 - Na0;
	var Nc = Nc0 + Na0 - Na;
	
	if (debug) {
	    console.log("Na0, Nb0, Nc0 = ", this.c0[0],this.c0[1],this.c0[2]);
	    console.log("k = ", k);
	    console.log("exp = ", exp);
	    console.log("alpha = ", alpha);
	    console.log("den = ", den);
	    console.log("num = ", num);
	    console.log("t = ", this.t);
	    console.log("[Na, Nb, Nc] = ", [Na, Nb, Nc]);
	};

	this.conc = [Na/this.V, Nb/this.V, Nc/this.V];
	this.t = this.t + dt;	
    };

    
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
    //height: '100%',
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
    paper_bgcolor: 'black',
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
	range: [0.0, Math.max.apply(Math, reac.conc)*1.1],
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
	line: {color: '#FF0000'},
	maxdisplayed: 200/0.1
    };

    var trace2 = {
	type: "scatter",
	mode: "lines",
	name: 'B',
	x: [reac.t],
	y: [reac.conc[1]],
	line: {color: '#0000FF'},
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
