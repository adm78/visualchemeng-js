// VCE Project - edmd_kinetic_energy_plot.js
//
//
// Requires:
// - plotly.js
//
// TODO: use real kernel data in the plot
//
// Andrew D. McGuire 2019
// a.mcguire227@gmail.com
//----------------------------------------------------------
function getrandom(num , mul) 
	{
	 var value = [ ];
	 for(i=0;i<=num;i++)
	 {
	  var rand = Math.random() * mul;
	  value.push(rand);
	 }
	 return value;
	}

function CollisionKernelPlot(container_id) {

    this.__init__ = function() {
	this._container_id = container_id;
	Plotly.newPlot(this._container_id, this._initialise_traces(), this._layout());
    };

    this.update = function(simulation) {
	var latest_data = this._get_latest_data(simulation);
	Plotly.restyle(this._container_id, latest_data);
    };

    
    this._layout = function() {
	return  {
	    margin : {
	    	l: 60,
	    	r: 50,
	    	b: 20,
	    	t: 10,
	    	pad: 4
	    },
	    scene: {
		xaxis:{title: 'x',
		       gridcolor: '#44474c',
		       titlefont: {
	    		   family: 'Roboto, serif',
	    		   size: 18,
	    		   color: 'white'
	    	       },
	    	       tickfont: {color:'white'}
		      },
		yaxis:{title: 'y',
		       gridcolor: '#44474c',
		       titlefont: {
	    		   family: 'Roboto, serif',
	    		   size: 18,
	    		   color: 'white'
	    	       },
	    	       tickfont: {color:'white'}},
		zaxis:{title: 'K(x,y)',
		       titlefont: {
	    		   family: 'Roboto, serif',
	    		   size: 18,
	    		   color: 'white'
	    	       },
	    	       tickfont: {color:'white'}},
	    },
	    hoverlabel: {bordercolor:'#333438'},
	    plot_bgcolor: '#333438',
	    paper_bgcolor: '#333333'
	};
    };


    this._initialise_traces = function() {

	var trace = {
	    type: "mesh3d",
	    x : getrandom(75 , 100),
	    y : getrandom(75 , 100),
	    z : getrandom(75 , 100),
	    color: 'green',
	    opacity:0.4,
	};
	return [trace];
    };


    this._get_latest_data = function(simulation) {
	// unpacks data to restyle plotly graph
	var x = [getrandom(75 , 100)];
	var y = [getrandom(75 , 100)];
	var z = [getrandom(75 , 100)];
	return {x : x, y: y, z: z};
    }

    this.__init__();
};
