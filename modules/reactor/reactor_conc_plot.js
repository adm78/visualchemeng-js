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
	    title: 'concentration/kmol/m3',
	    showgrid: true,
	    gridcolor: '#44474c',
	    autorange: true,
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

function get_fill(i) {
    if (i == 0) {
	return 'tozeroy';
    }
    else {
	return 'tonexty'
    };
};

function get_traces(reac) {

    var all_traces = [];
    for (var i = 0; i < reac.components.length; i++) {
	var trace = {
	    type: "scatter",
	    mode: "lines",
	    name: reac.components[i].name,
	    x: [reac.t],
	    y: [reac.conc[i]],
	    line: {color: settings.component_colours[i]},
	    maxdisplayed: 200/0.1,
	    text : get_hover_text(reac),
//	    fill : get_fill(i)
	};
	all_traces.push(trace);
    };
    return all_traces;
};


function get_saved_traces(savedData, reac) {
    // constuct traces from a previous save
    var all_traces = [];
    for (var i = 0; i < savedData.data.length; i++) {
	var trace = {
	    type: "scatter",
	    mode: "lines",
	    name: reac.components[i].name + " saved",
	    x: savedData.data[i].x,
	    y: savedData.data[i].y,
	    line: {
		color: settings.component_colours[i],
		dash: 'dot'
	    },
	    maxdisplayed: 200/0.1,
	    text : get_saved_hover_text(savedData, reac),
	};
	all_traces.push(trace);
    };
    return all_traces;    
    
}

function get_hover_text(reac) {
    // Format the hover text on the current data traces.
    var text = 'T = ' + reac.T.toString() + 'K';
    for (var i = 0; i < reac.components.length; i++) {
	text = text + ', C' + reac.components[i].name + '0 = ';
	text = text + reac.c0[i].toString();
    };
    return text
};

function get_saved_hover_text(savedData, reac) {
    // Format the hover text on the saved data traces.
    var text = 'T = ' + savedData.T.toString() + 'K';
    for (var i = 0; i < reac.components.length; i++) {
	text = text + ', C' + reac.components[i].name + '0 = ';
	text = text + savedData.c0[i].toString();
    };
    return text
};


function unpack_data(reac) {
    // unpacks storage data to extend plotly graph
    var x = [], y = [];
    for (var i = 0; i < reac.conc.length; i++) {
	x.push([reac.t]);
	y.push([reac.conc[i]]);
    };
    return{ x : x, y : y };
}
