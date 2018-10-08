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

    // particle feed options
    feed_options : {
	feed : {
	    init_force : { x : 0.0003, y : 0.0},
	    buoyancy : 0.0,
	},
	tops : {
	    init_force : { x : 0.0002, y : 0.0},
	    buoyancy : 0.0,//1.05,
	    //perturbation : { x : 2, y : 2 },
	},
	bottoms : {
	    init_force : { x : 0.0003, y : 0.0},
	    buoyancy : 0.0,
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

    reflux_valve_position : {"x_scaling":0.28811019594601234,"y_scaling":-0.6910569105691057,"w_scaling":0.07689402115260091,"h_scaling":0.09685574222925042,"a":0},

    // boundaries
    levee_position : {"x_scaling":0.8731233248606424,"y_scaling":1.3642847390066726,"w_scaling":0.05,"h_scaling":0.3675459453124999,"a":0},
    feed_positions : [{"x_scaling":-1.1275273547635363,"y_scaling":0.21894175015711917,"w_scaling":0.12612276107909576,"h_scaling":0.13696974850908034,"a":0},
    {"x_scaling":-0.942281921465001,"y_scaling":0.2874055273980731,"w_scaling":0.11411106954775331,"h_scaling":0.28016061924194147,"a":1.5707963267948968},
    {"x_scaling":-0.942281921465001,"y_scaling":0.11196689826074094,"w_scaling":0.11411106954775331,"h_scaling":0.28016061924194147,"a":1.5707963267948968}],
    tops_boundaries : [{"x_scaling":0.9289445012825301,"y_scaling":-0.4072171865388987,"w_scaling":0.05142205097126506,"h_scaling":0.17678850292558604,"a":0},{"x_scaling":2.332361563661119,"y_scaling":-0.2645842030255469,"w_scaling":0.05142205097126506,"h_scaling":0.8124111951052492,"a":-1.5707963267948968}],
    boundary_positions : [],

    // column limits
    Fmax : 200.0
};
