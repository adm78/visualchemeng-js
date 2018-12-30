settings = {

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
			acc : [0, -0.02]
		    }		    
		},
		bottoms : {
		    options : {
			v : { x : 2.0, y : 0.0 },
			acc : [0, 0.02]
		    }
		}
	    },
	
	    particles : [
		{type : 'single-body-manual', colour : '#BC0CDF', radius : 1.5},
		{type : 'single-body-manual', colour : '#BC0CDF', radius : 1.5},
		{type : 'single-body-manual', colour : '#DFBC0C', radius : 1.5},
		{type : 'single-body-manual', colour : '#0CDFBC', radius : 1.5},
		{type : 'single-body-manual', colour : '#2e8ade', radius : 1.5},
		{type : 'single-body-manual', colour : '#de912e', radius : 1.5},
		{type : 'single-body-manual', colour : '#2ede71', radius : 1.5}],

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
			acc : [0, -0.02]
		    }		    
		},
		bottoms : {
		    options : {
			v : { x : 2.0, y : 0.0 },
			acc : [0, 0.02]
		    }
		}
	    },
			
	    particle_options : [
		{type : 'single-body-manual', colour : '#2e8ade', radius : 1.5},
 		{type : 'single-body-manual', colour : '#de912e', radius : 1.5},
		{type : 'single-body-manual', colour : '#2ede71', radius : 1.5}]
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
			acc : [0, -0.02]
		    }		    
		},
		bottoms : {
		    options : {
			v : { x : 2.0, y : 0.0 },
			acc : [0, 0.02]
		    }
		}
	    },
	    
	    particles : [
		{type : 'single-body-manual', colour : '#BC0CDF', radius : 1.5},
		{type : 'single-body-manual', colour : '#DFBC0C', radius : 1.5},
		{type : 'single-body-manual', colour : '#0CDFBC', radius : 1.5},
		{type : 'single-body-manual', colour : '#2e8ade', radius : 1.5},
		{type : 'single-body-manual', colour : '#de912e', radius : 1.5},
		{type : 'single-body-manual', colour : '#2ede71', radius : 1.5}]
	}
    ]
};
