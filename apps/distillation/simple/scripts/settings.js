var settings = {

    // identifier
    id : 'distillation-test',


    // componentns
    components : [
	{
	    name : 'Acetone',
	    colour : '#cc6600',
	    h : 100.0,
	    h_unit : 'J/mol'
	},
	{
	    name : 'Ethanol',
	    colour : '#006699',
	    h : 200.0,
	    h_unit : 'J/mol'
	},
    ],
  

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
	    radius : 3,
	    colour : '#cc6600',
	    matter_options : {
		friction: 0,
		restitution: 0.5,
	    }
	},
	{
	    type: 'single-body',
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
    F_max : 200.0,
    R_max : 30.0,
    alpha_R_min : 1.1,  
};
