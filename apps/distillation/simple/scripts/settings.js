var settings = {

    // identifier
    id : 'distillation-test',


    // componentns
    components : [
	{
	    name : 'a',
	    colour : '#cc6600',
	    h : 100.0,
	    h_unit : 'J/mol'
	},
	{
	    name : 'b',
	    colour : '#006699',
	    h : 200.0,
	    h_unit : 'J/mol'
	},
    ],

    // particle feed
    particle_feeds : {
	feed : {
	    options : {
		init_force : { x : 0.0003, y : 0.0},
		buoyancy : 0.0
	    },
	},
	tops : {
	    position : {"x_scaling":0.3429281541452073,"y_scaling":-0.5655398223968362,"w_scaling":0.0266851683834125,"h_scaling":0.04278990158322636,"a":0},
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

    reflux_valve_position : {"x_scaling":0.08400113140944375,"y_scaling":-0.68820424502254,"w_scaling":0.0266851683834125,"h_scaling":0.04278990158322636,"a":0},
    column_interior_position : {"x_scaling":-0.09217601808086937,"y_scaling":-0.022108137582069694,"w_scaling":0.06709535245336722,"h_scaling":0.6667017690098147,"a":0},

    // boundaries
    levee_boundary_position : {"x_scaling":0.2735250346490234,"y_scaling":1.4983598074955873,"w_scaling":0.0266851683834125,"h_scaling":0.5,"a":0},
    feed_boundary_positions : [
	{"x_scaling":-0.3724578468154588,"y_scaling":0.07202967854713241,"w_scaling":0.0266851683834125,"h_scaling":0.1019534128728952,"a":0},
	{"x_scaling":-0.2870386228201554,"y_scaling":-0.0007131541443524016,"w_scaling":0.026618455462453967,"h_scaling":0.2085375171905646,"a":1.5707963267948968},
	{"x_scaling":-0.2870386228201554,"y_scaling":0.13621453092197194,"w_scaling":0.026618455462453967,"h_scaling":0.2085375171905646,"a":1.5707963267948968}],
    tops_boundary_position : {"x_scaling":0.42834737814051066,"y_scaling":-0.40008557980316645,"w_scaling":0.0266851683834125,"h_scaling":0.525,"a":1.5707963267948968},
    general_boundary_positions : [],

    // column limits
    Fmax : 200.0
};
