// VCE Project - reactor_conc_plot.js
//
// Routines to support plotly reaction concentration evolution figure.
//
// Requires:
// - plotly
//
//
// Andrew D. McGuire 2018
// a.mcguire227@gmail.com
//
// To do:
//
//
//----------------------------------------------------------
function plotly_layout(reac) {
    var layout =  {
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
	    range: [0.0, Math.max.apply(Math, reac.conc)*1.1],
	    titlefont: {
		family: 'Roboto, serif',
		size: 18,
		color: 'white'
	    },
	    tickfont: {color:'white'}
	}
    };
    return layout
};


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
