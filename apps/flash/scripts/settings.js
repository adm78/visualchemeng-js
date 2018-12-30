settings : {

    sys : [
	{// system index 0
	    particle_sources : {
		feed : {
		    options : {
			// energy : 1.0,
			v : { x : 2.0, y : 0.0 },
		    }
		},
		tops : {
		    options : {
			v : { x : 2.0, y : 0.0 },
			acc : createVector(0, -0.02)
		    }		    
		},
		bottoms : {
		    options : {
			v : { x : 2.0, y : 0.0 },
			acc : createVector(0, 0.02)
		    }
		}
	    },
	
	    particles : [
		{colour : '#BC0CDF', radius : 1.5},
		{colour : '#BC0CDF', radius : 1.5},
		{colour : '#DFBC0C', radius : 1.5},
		{colour : '#0CDFBC', radius : 1.5},
		{colour : '#2e8ade', radius : 1.5},
		{colour : '#de912e', radius : 1.5},
		{colour : '#2ede71', radius : 1.5}],

	},

	{// system index 1
	    particles : {
		feed : {
		    options : {
			// energy : 1.0,
			v : { x : 2.0, y : 0.0 },
		    }
		},
		tops : {
		    options : {
			v : { x : 2.0, y : 0.0 },
			acc : createVector(0, -0.02)
		    }		    
		},
		bottoms : {
		    options : {
			v : { x : 2.0, y : 0.0 },
			acc : createVector(0, 0.02)
		    }
		}
	    },
			
	    particle_options : [
		{colour : '#2e8ade', radius : 1.5},
 		{colour : '#de912e', radius : 1.5},
		{colour : '#2ede71', radius : 1.5}]
	},

	{// system index 2
	    particle_sources : {
		feed : {
		    options : {
			// energy : 1.0,
			v : { x : 2.0, y : 0.0 },
		    }
		},
		tops : {
		    options : {
			v : { x : 2.0, y : 0.0 },
			acc : createVector(0, -0.02)
		    }		    
		},
		bottoms : {
		    options : {
			v : { x : 2.0, y : 0.0 },
			acc : createVector(0, 0.02)
		    }
		}
	    },
	    
	    particles : [
		{colour : '#BC0CDF', radius : 1.5},
		{colour : '#DFBC0C', radius : 1.5},
		{colour : '#0CDFBC', radius : 1.5},
		{colour : '#2e8ade', radius : 1.5},
		{colour : '#de912e', radius : 1.5},
		{colour : '#2ede71', radius : 1.5}]
	}
    ]
};
