// VCE Project - mccabe_theile_plot.js
//
// This script provides functions to create a mccabe-theile plot.
//
//
// Requires:
// plotly.js or plotly.min.js
//
// Andrew D. McGuire 2018
// a.mcguire227@gmail.com
//
// To do:
//
//
// --------------------------------------------------

function plot_mccabe_thiele_diagram(container) {
    Plotly.newPlot(container,
		   _get_mccabe_thiele_traces(),
		   _get_mccabe_thiele_layout(),
		   {responsive: true}) // scale with the screen size changes
};


function _get_mccabe_thiele_traces() {
    // central line
    var center_line = {
	name : 'x=y',
	type: "scatter",
	mode: "lines",
	x: [0.0, 1.0],
	y: [0.0, 1.0],
	line: {
	    color : '#aeb1b7'
	}
    };
    var equilib_line = {
	name: 'Vapour-Liquid Equilibirum',
	type: "scatter",
	mode: "lines",
	x: settings.equilibrium_data.x,
	y: settings.equilibrium_data.y,
	line: {
	    color : '#008CBA'
	}
    }
    return [center_line, equilib_line];
};


function _get_mccabe_thiele_layout() {
    var layout =  {
	margin : {
	    l: 50,
	    r: 20,
	    b: 50,
	    t: 35,
	    pad: 5
	},
	//autosize: true,
	height: 300,
	titlefont: {
	    family: 'Roboto, serif',
	    color: 'white',
	    size: 16,
	},
	title : 'McCabe-Thiele Diagram',
	showlegend: false,
	legend: {
	    font: {color: 'white'}
	},
	hoverlabel: {bordercolor:'#333438'},
	plot_bgcolor: '#333438',
	paper_bgcolor: '#333333',
	xaxis: {
	    autorange: false,
	    autoscale: false,
	    showgrid: true,
	    gridcolor: '#44474c',
	    tickmode: 'auto',
	    range: [0.0, 1.0],
	    title: 'x',
	    titlefont: {
		family: 'Roboto, serif',
		size: 18,
		color: 'white'
	    },
	    tickfont: {color:'white'}
	},
	yaxis: {
	    title: 'y',
	    showgrid: true,
	    gridcolor: '#44474c',
	    autorange: false,
	    autoscale: false,
	    range: [0.0, 1.0],
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
