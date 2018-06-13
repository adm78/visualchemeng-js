// VCE Project - settings.js (simple reactor)
//
// A settings object to specify things that are unique to the current
// system being modelled. You must ensure that there are a sufficient
// number of elements for each property (e.g. there are at least as
// many elements in component_colours as the number of componentns in
// the reactive system etc.).
//
// The properties defined in this file are:
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
    sliders : {
	T : {
	    min : 250.0,
	    max : 350.0,
	    start : 298.0,
	    step : 1.0
	}
    }
};
