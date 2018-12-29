var settings = {

    // identifier
    id : 'distillation-test',


    // componentns
    components : [
	{
	    name : 'EtOH',
	    colour : '#cc6600',
	    h : 100.0,
	    h_unit : 'J/mol'
	},
	{
	    name : 'H20',
	    colour : '#006699',
	    h : 200.0,
	    h_unit : 'J/mol'
	},
    ],

    // equilibrium data (based on EtOH)
    // source: http://www.ddbst.com/en/EED/VLE/VLE%20Ethanol%3BWater.php
    equilibrium_data : {
	x : [0.0, 0.0035, 0.0045, 0.0175, 0.0585, 0.068, 0.0935, 0.165, 0.2125,
	     0.241, 0.3615, 0.474, 0.4985, 0.5815, 0.646, 0.654, 0.723,
	     0.79, 0.837, 0.8731, 0.883, 0.888, 0.8973, 0.9489, 0.9707, 0.9825, 1.0],
	y : [0.0, 0.0205, 0.0275, 0.1315, 0.305, 0.3615, 0.411, 0.52, 0.5455, 0.5675,
	     0.606, 0.6505, 0.6555, 0.697, 0.729, 0.731, 0.776, 0.82, 0.852,
	     0.8817, 0.8885, 0.893, 0.9012, 0.9502, 0.9715, 0.9835, 1.0]
    },
    

    // particle sources
    particle_sources : {
	feed : {
	    options : {
		init_force : { x : 0.0003, y : 0.0},
		buoyancy : 0.0
	    },
	},
	tops : {
	    position : {"x_scaling":0.3454965261660366,"y_scaling":-0.5141919731430687,"w_scaling":0.02752785791130974,"h_scaling":0.04278990158322636,"a":0},
	    options : {
		init_force : { x : 0.0002, y : 0.0},
		buoyancy : 0.0
	    },
	},
	bottoms : {
	    position : {"x_scaling":0.3455975048950604,"y_scaling":0.9763229265649654,"w_scaling":0.0266851683834125,"h_scaling":0.04278990158322636,"a":0},
	    options : {
		init_force : { x : 0.0003, y : 0.0},
		buoyancy : 0.0
	    },
	}
    },

    
    // particle graphics
    particles : [
	{
	    type: 'single-body',
	    shape : {type:'polygon', sides:6},
	    radius : 3,
	    colour : '#cc6600',
	    matter_options : {
		friction: 0,
		restitution: 0.5,
	    }
	},
	{
	    type: 'single-body',
	    shape : {type:'polygon', sides:6},
	    radius : 3,
	    colour : '#006699',
	    matter_options : {
		friction: 0,
		restitution: 0.5,
	    }
	},
    ],

    reflux_valve_position : {"x_scaling":0.08940744475380127,"y_scaling":-0.6368563712841944,"w_scaling":0.02752785791130974,"h_scaling":0.08304169199380357,"a":0},
    column_interior_position : {"x_scaling":-0.09233319366778506,"y_scaling":0.01212380000756345,"w_scaling":0.06921415305715777,"h_scaling":0.634954065723633,"a":0},

    // boundaries
    levee_boundary_position : {"x_scaling":0.2735250346490234,"y_scaling":1.4983598074955873,"w_scaling":0.0266851683834125,"h_scaling":0.5,"a":0},
    feed_boundary_positions : [
	{"x_scaling":-0.3724578468154588,"y_scaling":0.07202967854713241,"w_scaling":0.0266851683834125,"h_scaling":0.1019534128728952,"a":0},
	{"x_scaling":-0.2870386228201554,"y_scaling":-0.0007131541443524016,"w_scaling":0.026618455462453967,"h_scaling":0.2085375171905646,"a":1.5707963267948968},
	{"x_scaling":-0.2870386228201554,"y_scaling":0.13621453092197194,"w_scaling":0.026618455462453967,"h_scaling":0.2085375171905646,"a":1.5707963267948968}],
    tops_boundary_position : {"x_scaling":0.4253522612300667,"y_scaling":-0.358722002831697,"w_scaling":0.02752785791130974,"h_scaling":0.5,"a":1.5707963267948968},
    general_boundary_positions : [],

    // column limits
    Fmax : 200.0
};
