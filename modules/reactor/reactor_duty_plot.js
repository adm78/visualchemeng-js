// VCE Project - reactor_duty_plot.js
//
// Routines to support plotly reactor duty temporal evolution plot.
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
// - remove trace text generation dependecny on reactor_conc_plot.js.
//
//----------------------------------------------------------
function plotly_duty_layout() {
    var layout =  {
	margin : {
	    l: 50,
	    r: 50,
	    b: 50,
	    t: 50,
	    pad: 5
	},
	height: 300,
	title: "reactor duty",
	titlefont: {
	    family: 'Roboto, serif',
	    size: 18,
	    color: 'white'
	},
	legend: {
	    font: {color: 'white'},
	    x: 0.3,
	    y : 1.0	    
	},
	hoverlabel: {bordercolor:'#333438'},
	plot_bgcolor: '#333438',
	paper_bgcolor: '#333333',
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
	    title: 'Q/kW',
	    showgrid: true,
	    gridcolor: '#44474c',
	    autorange: true,
	    autoscale: false,
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


function get_duty_trace(reac) {

    var trace = {
	type: "scatter",
	mode: "lines",
	name: 'current',
	x: [reac.t],
	y: [reac.Q()],
	maxdisplayed: 200/0.1,
	text : get_hover_text(reac),
	fill : 'tozeroy'
    };
    return [trace];
};


function get_saved_duty_trace(savedData, reac) {
    // constuct duty trace from a previous save
    var trace = {
	type: "scatter",
	mode: "lines",
	name: "saved",
	x: savedData.duty_data[0].x,
	y: savedData.duty_data[0].y,
	fill : 'tozeroy',
	maxdisplayed: 200/0.1,
	text : get_saved_hover_text(savedData, reac),
    };
    return [trace];    
};


function unpack_duty_data(reac) {
    // unpacks storage data to extend plotly graph
    return {
	x : [[reac.t]],
	y : [[reac.Q()]],
    };
};
