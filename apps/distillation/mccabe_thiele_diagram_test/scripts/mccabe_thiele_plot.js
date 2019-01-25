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

function plot_mccabe_thiele_diagram(column, container) {
    Plotly.newPlot(container,
		   _get_mccabe_thiele_traces(column),
		   _get_mccabe_thiele_layout(),
		   {responsive: true}) // scale with the screen size changes
};


function _get_mccabe_thiele_traces(column) {
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
	name: 'VLE',
	type: "scatter",
	mode: "lines",
	x: data.equilibrium_data.x,
	y: data.equilibrium_data.y,
	line: {
	    color : '#008CBA'
	}
    };
    var intersect = column.op_line_intersect();
    var feed_op_line = {
	name: 'Feed op. line',
	type: "scatter",
	mode: "lines",
	x: [column.xf, intersect.x],
	y: [column.xf, intersect.y],
	line: {
	    color : '#32c143'
	}
    };
    var x_rect_op = [0.0, 1.0]; 
    var rect_op_line = {
	name: 'Rectifying op. line',
	type: "scatter",
	mode: "lines",
	x: [intersect.x, column.xd],
	y: [intersect.y, column.xd],
	line: {
	    color : '#ef9921'
	}
    };
    var stripping_op_line = {
	name: 'Stripping op. line',
	type: "scatter",
	mode: "lines",
	x: [column.xb, intersect.x],
	y: [column.xb, intersect.y],
	line: {
	    color : '#c932d1'
	}
    };
    var stage_data = column.stage_data();
    var stage_line = {
	name: 'Stage line',
	type: "scatter",
	mode: "lines+text",
	x: stage_data.x,
	y: stage_data.y,
	line: {
	    color : '#f73131'
	},
	text : _get_stage_labels(stage_data),
	textposition : 'top left',
	textfont: {
	    family: 'Roboto, serif',
	    size: 14,
	    color: 'grey'
	},
    };
    return [center_line, equilib_line, feed_op_line, rect_op_line, stripping_op_line, stage_line];
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
	width: 500,
	height: 500,
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

function _get_stage_labels(stage_data) {
    // Generate an arrays of labels that can be used with the stage
    // data.  Note that we only wish to label the points that lie on
    // the equilibrium line (i.e. every second point).
    labels = [];
    for (var i = 0; i < stage_data.n_stages; i++) {
	labels.push('',i+1)
    };
    return labels;
};
