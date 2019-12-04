// VCE Project - reactor_conc_plot.js
//
// Routines to support plotly reaction concentration evolution figure.
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
function plotly_collision_rate_plot_layout() {
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
	    autorange: true,
	    autoscale: true,
	    showgrid: true,
	    gridcolor: '#44474c',
	    tickmode: 'auto',
	    title: 'time/s',
	    titlefont: {
		family: 'Roboto, serif',
		size: 18,
		color: 'white'
	    },
	    tickfont: {color:'white'}
	},
	yaxis: {
	    title: 'events/s',
	    showgrid: true,
	    gridcolor: '#44474c',
	    autorange: true,
	    // autoscale: false,
	    // range: [0.0, Math.max.apply(Math, reac.conc)*1.1],
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

function get_fill(i) {
    if (i == 0) {
	return 'tozeroy';
    }
    else {
	return 'tonexty'
    };
};

function get_collision_rate_traces(event_log) {

    var data = this.unpack_collision_rate_data(event_log)
    var trace = {
	type: "scatter",
	mode: "lines",
	name: 'test',
	x: data.x[0],
	y: data.y[0],
	line: {color: 'red'},
	// maxdisplayed: 20000,
	//	    fill : get_fill(i)
    };
    return [trace];
};


function unpack_collision_rate_data(event_log) {
    // unpacks storage data to extend plotly graph
    var x = [[event_log.t()]];
    var y = [[event_log.average_collision_rate()]];
    return{ x : x, y : y };
}
