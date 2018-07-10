// VCE Project - reactor_bar_plot.js
//
// Routines to support plotly reaction bar plots.
//
// Requires:
// - none
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
	static: true,
	title: 'conversion',
	titlefont: {
	    family: 'Roboto, serif',
	    size: 18,
	    color: 'white'
	    },
    	plot_bgcolor: '#333438',
	paper_bgcolor: '#333333',
	hoverlabel: {bordercolor:'#333438'},
	xaxis: {
	    title : 'time/s',
	    showgrid: true,
	    gridcolor: '#44474c',
	    range: [0, 200.0],
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
	    tickfont: {color:'white'},
	    autorange: false,
	    autoscale: false,
	},
	margin: {
	    t: 50, 
	    l: 50, 
	    r: 50, 
	    b: 50
	}
    };
    return layout
};


function get_conversion_trace(reac) {
    var conversion_trace = {
	x : [reac.t],
	y : [reac.conversion()*100.0],
	type : 'scatter',
	mode : 'lines',
	fill : 'tozeroy',
	maxdisplayed: 200/0.1,
	text : get_hover_text(reac)
	// marker: {
	//     color : 'rgba(31,119,180,0.5)',
	//     line : {
	// 	color: 'rgba(31,119,180,1.0)',
	// 	width : 1.5,
	//     },
	// }
    };
    return [conversion_trace];
};


function unpack_conversion_data(reac) {
    // unpacks current conversion data to extend plotly graph
    return {
	x : [[reac.t]],
	y : [[reac.conversion()*100.0]],
    };
};
