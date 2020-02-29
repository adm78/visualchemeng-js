// VCE Project - reactor_conc_plot.js
//
// Collison rate plotter class (plotly wrapper class).
//
// Requires:
// - plotly.js
//
// Andrew D. McGuire 2018
// a.mcguire227@gmail.com
//----------------------------------------------------------
function CollisionRatePlot(container_id) {

    this.__init__ = function() {
	this._container_id = container_id;
	Plotly.newPlot(this._container_id, this._initialise_traces(), this._layout());
    };

    this.update = function(simulation) {
	var extension_info = this._get_extension_info(simulation);
	Plotly.extendTraces(this._container_id, extension_info.data, extension_info.indices);
    };

    
    this._layout = function() {
	return  {
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
	    paper_bgcolor: '#333333',
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
		title: 'collisions/s',
		showgrid: true,
		gridcolor: '#44474c',
		autorange: true,
		titlefont: {
		    family: 'Roboto, serif',
		    size: 18,
		    color: 'white'
		},
		tickfont: {color:'white'}
	    }
	};
    };


    this._initialise_traces = function() {
	var trace = {
	    type: "scatter",
	    mode: "lines",
	    name: 'kinectic energy',
	    x: [], 
	    y: [],
	    line: {color: 'red'},
	    maxdisplayed: 20000,
	    fill : 'tozeroy'
	};
	return [trace];
    };


    this._get_extension_info = function(simulation) {
	// unpacks data to extend plotly graph
	var x = [[simulation.event_log.t()]];
	var y = [[simulation.event_log.average_collision_rate()]];
	return { data: { x : x, y : y },
		 indices: [0]};
    }

    this.__init__();
};
