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
// - stop labeling stages if n stages exceeds some number
//
// --------------------------------------------------

function plot_mccabe_thiele_diagram(column, container) {
    Plotly.newPlot(container,
		   _get_mccabe_thiele_traces(column),
		   _get_mccabe_thiele_layout(),
		   {responsive: true}) // scale with the screen size changes
    utils.resizePlotlyHeight(container);
};


function _get_mccabe_thiele_traces(column) {
    var traces = [];
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
    traces.push(center_line);
    var equilib_line = {
	name: 'Vapour-Liquid equilibrium',
	type: "scatter",
	mode: "lines",
	x: data.equilibrium_data.x,
	y: data.equilibrium_data.y,
	line: {
	    color : '#008CBA'
	}
    };
    traces.push(equilib_line);
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
    traces.push(feed_op_line);
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
    traces.push(rect_op_line);
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
    traces.push(stripping_op_line);
    if (column.stage_data != null) {
	var stage_line = {
	    name: 'Stage line',
	    type: "scatter",
	    mode: "lines+text",
	    x: column.stage_data.x,
	    y: column.stage_data.y,
	    line: {
		color : '#f73131'
	    },
	    text : _get_stage_labels(column),
	    textposition : 'top left',
	    textfont: {
		family: 'Roboto, serif',
		size: 14,
		color: 'grey'
	    },
	};
	traces.push(stage_line);
    };
    return traces;
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
	autosize: true,
	// width: 500,
	// height: 500,
	titlefont: {
	    family: 'Roboto, serif',
	    color: 'white',
	    size: 16,
	},
	title : 'McCabe-Thiele Diagram',
	showlegend: true,
	legend: {
	    font: {color: 'white'},
	    x: 0,
	    y: 1
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

function _get_stage_labels(column) {
    // Generate an arrays of labels that can be used with the stage
    // data.  Note that we only wish to label the points that lie on
    // the equilibrium line (i.e. every second point).
    labels = [];
    if (column.n_stages <= 20) {
	for (var i = 0; i < column.n_stages; i++) {
	    labels.push('',i+1)
	};
    };
    return labels;
};
