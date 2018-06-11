// VCE Project - settings.js
//
// A setting object to specific thing that are unique to the current system being modelled
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
    ]
};
