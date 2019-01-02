// VCE Project - flash_composition_plot.js
//
// Routines for plotting flash tank stream compositions and flowrates.
//
// Requires:
// - plotly.js or plotly.min.js
// - jquery
// - data.js
//
// Andrew D. McGuire 2018
// a.mcguire227@gmail.com
//----------------------------------------------------------
function plot_stream_compositions(flash, graphics) {
    Plotly.newPlot('feedplotDiv', get_comp_data(flash, graphics, 'z'), get_comp_layout('Feed'));
    Plotly.newPlot('topsplotDiv', get_comp_data(flash, graphics, 'y'), get_comp_layout('Tops'));
    Plotly.newPlot('bottomsplotDiv', get_comp_data(flash, graphics, 'x'), get_comp_layout('Bottoms'));
    Plotly.newPlot('flow_chart_container', get_flowrate_data(flash), get_flowrate_layout());
};


function get_comp_layout(title) {
    var layout = jQuery.extend(true, {}, base_bar_chart_layout); // make a copy
    layout.yaxis.range = [0,1.0];
    layout.title = title;
    return layout
};


function get_flowrate_layout() {
    var layout = jQuery.extend(true, {}, base_bar_chart_layout); // make a copy
    layout.title = 'Flowrate/ kmol/hr';
    var F_range = data.sys[sysid].range.F;
    layout.yaxis.range = [F_range.min, F_range.max];
    return layout;
};


function get_comp_data(flash, graphics, param) {
    return [{
	x: utils.generateLabels(flash[param],param),
	y: flash[param],
	type: 'bar',
	marker: {
	    color : graphics.colours()
	},
	text: flash.components,
	width: 0.3
    }];
};


function get_flowrate_data(flash) {
    return [{
	x: ['F', 'V', 'L'],
	y: [flash.F, flash.V, flash.L],
	type: 'bar',
	marker: {
	    color : '#2e8ade'
	},
	text: ['FEED','VAPOUR', 'LIQUID'],
	width: 0.3
    }];
};

var base_bar_chart_layout = {

    margin : {
	l: 30,
	r: 30,
	b: 30,
	t: 35,
	pad: 5
    },
    titlefont: {
	family: 'Roboto, serif',
	size: 16,
	color: 'white'
    },
    hoverlabel: {bordercolor:'#333438'},
    plot_bgcolor: '#333438',
    paper_bgcolor: '#333438',
    height:200,
    xaxis: {
	fixedrange: true,
	showgrid: false,
	gridcolor: '#44474c',
	tickmode: 'auto',
	titlefont: {
	    family: 'Roboto, serif',
	    size: 18,
	    color: 'white'
	},
	tickfont: {color:'white'}
    },
    yaxis: {
	fixedrange: true,
	showgrid: true,
	gridcolor: '#44474c',
	tickmode: 'auto',
	titlefont: {
	    family: 'Roboto, serif',
	    size: 18,
	    color: 'white'
	},
	tickfont: {color:'white'}
    },
};
