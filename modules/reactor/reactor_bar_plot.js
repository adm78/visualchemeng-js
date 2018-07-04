// VCE Project - reactor_bar_plot.js
//
// Routines to support plotly reaction bar plots.
//
// Requires:
// - plotly.js
// - appropprioate settings.js file to define plot colours etc.
//
//
// Andrew D. McGuire 2018
// a.mcguire227@gmail.com
//
// To do:
//
//
//----------------------------------------------------------
function plotly_conversion_layout() {
    layout = {
    	plot_bgcolor: '#333438',
	paper_bgcolor: '#333333',
	xaxis: {
	    showgrid: true,
	    gridcolor: '#44474c',
	    titlefont: {
		family: 'Roboto, serif',
		size: 18,
		color: 'white'
	    },
	    tickfont: {color:'white'}
	},
	yaxis: {
	    title: '%',
	    showgrid: true,
	    gridcolor: '#44474c',
	    range: [0.0, 100.0],
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


function get_conversion_trace(reac) {
    var conversion_trace = {
	x : ['conversion'],
	y : [reac.conversion()*100.0],
	type : 'bar'
    };
    return [conversion_trace];
//     var all_traces = [];
//     for (var i = 0; i < reac.components.length; i++) {
// 	var trace = {
// 	    type: "scatter",
// 	    mode: "lines",
// 	    name: reac.components[i].name,
// 	    x: [reac.t],
// 	    y: [reac.conc[i]],
// 	    line: {color: settings.component_colours[i]},
// 	    maxdisplayed: 200/0.1,
// 	    text : get_hover_text(reac),
// //	    fill : get_fill(i)
// 	};
// 	all_traces.push(trace);
    // };
    // return all_traces;
};


