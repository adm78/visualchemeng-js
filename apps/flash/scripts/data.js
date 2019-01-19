// VCE Project - data.js
//
// This file stores flash iniial conditions and parameter ranges
// for various chemical systems. Each system is defined by its
// sys id (int).
//
// Requires:
// no requirements
//
// Andrew D. McGuire 2019
// a.mcguire227@gmail.com
//
//---------------------------------------------------------
var data = {

    sys : [

	// sys 0 - methanol, water, glycerol, methyl-ester (biodiesel), triglyceride
	{
	    initial_conditions : {
		x : null,
		y : null,
		z : [0.53,0.039,0.0980,0.328,0.003012],
		P : 0.2,
		T : 333.0,
		A : {
		    values : [[82.718,-6904.5,-8.8622,0.0000074664,2.0], 
			      [73.649,-7258.2,-7.3037,0.0000041653,2.0],
			      [99.989,-13808,-10.088,0.0,6.0],
			      [9.9155,2583.52,-96.15],
			      [66.438,-5061.7,-8.4912,0.0082326,1.0],
			     ],
		    eqns : [2, 2, 2, 3, 2]
		},
		F : 20.0,
		components : ['MeOH','H2O','GLYCEROL','BIODIESEL (METHYL-ESTER)','TRIGLYCERIDE']
	    },
	    
	    range :  {
		P: { min: 0.05, max: 0.5},
		T: { min:300.0, max:360.0},
		F: { min: 0.0,  max: 40.0},
		V: { min: 0.0,  max: 40.0},
		L: { min: 0.0,  max: 40.0}
	    }
	},


	// sys 1 - pentane, hexane, cyclohexane
	{
	    initial_conditions : {
		x : null,
		y : null,
		z : [0.5,0.3,0.2],
		P : 5,
		T : 390.0,
		A : {
		    values : [ [3.97786,1064.840,-41.136],
			       [4.00139,1170.875,-48.833],
			       [3.93002,1182.774,-52.532]],
		    eqns: [1, 1, 1]
		},
		F : 20.0,
		components : ['PENTANE','HEXANE','CYCLOHEXANE']
	    },

	    range : {
		P: { min: 4.6, max: 5.8},
		T: { min:360,  max:420},
		F: { min: 0.0, max: 40.0},
		V: { min: 0.0, max: 40.0},
		L: { min: 0.0, max: 40.0}
	    }
	},

	
	//sys 2 - methanol, ethanol, water
	{
	    initial_conditions : {
		x : null,
		y : null,
		z : [0.333,0.333,0.333],
		P : 0.4,
		T : 330.0,
		A : {
		    values : [[5.20409,1581.341,-33.50], 
			      [5.24677,1598.673,-46.424],
			      [5.0768,1659.793,-45.854]],
		    eqns : [1, 1, 1]
		},
		F : 20.0,
		components : ['MeOH','EtOH','H2O']
	    },

	    range : {
		P: { min: 0.2, max: 1.2},
		T: { min:320.0, max:360.0},
		F: { min: 0.0,  max: 40.0},
		V: { min: 0.0,  max: 40.0},
		L: { min: 0.0,  max: 40.0}
	    }

	}

    ]
};

