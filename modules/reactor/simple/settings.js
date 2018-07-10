// VCE Project - settings.js (simple reactor)
//
// A settings object to specify things that are unique to the current
// system being modelled. You must ensure that there are a sufficient
// number of elements for each property (e.g. there are at least as
// many elements in component_colours as the number of componentns in
// the reactive system etc.). For now the physical params are coupled
// with the graphical params, which isn't ideal. This may be changed
// at a later date.
//
// The properties defined in this file are:
// - particle physical properties
// - plot colouring options
// - particle styling options
// - slider settings
//
//
// Requires:
// - nothing!
//
//
// Andrew D. McGuire 2018
// a.mcguire227@gmail.com
//
// To do:
//
//
//----------------------------------------------------------
var settings = {

    // identifier
    id : 'simple_reac',

    // debug bool
    debug : false,
    
    // physical properties 
    components : [
	{
	    name : 'a',
	    h : 100.0,
	    h_unit : 'J/mol'
	},
	{
	    name : 'b',
	    h : 200.0,
	    h_unit : 'J/mol'
	},
	{
	    name : 'c',
	    h: 400.0,
	    h_unit : 'J/mol'
	}

    ],

    // reaction definition
    reaction : {
	Ea : 10000.0,
	A : 1.0,
	stoich: [1, 1, -1],
	rate_expression : 'r = k.Ca.Cb',
	rate_constant_expression: 'k = A.exp(-Ea/R.T)'
    },
    
    
    // graphical params 
    component_colours : ['#008CBA','#BC0CDF','#00FF00'],
    particle_options : [
	{
	    type: 'single-body',
	    shape : {type:'polygon', sides:6},
	    radius : 10,
	    colour : '#008CBA'
	},
	{
	    type: 'single-body',
	    shape : {type:'circle'},
	    radius : 5,
	    colour : '#BC0CDF'
	},
	{
	    type : 'two-body',
	    particles : [
		{
		    colour : '#00FF00',
		    radius : 5.0,
		    shape : { type : 'circle'}
		},
		{
		    colour : '#00FF00',
		    radius : 10.0,
		    shape : {
			type : 'polygon',
			sides : 6
		    }
		}   
	    ],
	    bond : {
		length : 20.0,
		width : 2.0,
		colour : '#BAACDF',
		angle : 0.0
	    }
	}
    ],
    
    // slider definitions
    sliders : {
	T : {
	    min : 250.0,
	    max : 350.0,
	    start : 298.0,
	    step : 1.0
	},
	Ca0 : {
	    min : 0.0,
	    max : 3.0,
	    start : 1.0,
	    step : 0.05
	},
	Cb0 : {
	    min : 0.0,
	    max : 3.0,
	    start : 2.0,
	    step : 0.05
	},
	Cc0 : {
	    min : 0.0,
	    max : 3.0,
	    start : 0.0,
	    step : 0.05
	}
    },
};
