// VCE Project - flash_data.js
//
// This file stores flash intial conditions and parameter ranges
// for various chemical systems. Each system is defined by its
// sys id (int).
//
// Requires:
// no requirements
//
// Andrew D. McGuire 2017
// a.mcguire227@gmail.com
//----------------------------------------------------------
// Chemical system index
//
// sys:
// 1 - pentane, hexane, cyclohexane
// 2 - methanol, ethanol, water
// 3 - methanol, water, glycerol, methyl-ester (biodiesel), triglyceride
//---------------------------------------------------------

function getInitialConditions(sys=1,debug=false) {

    // return the intial conditions and property data
    // object
    //
    // args:
    // sys - chemical system id
    
    var ic;
    if (sys === 1) {
	 ic = {
	    x : null,
	    y : null,
	    z : [0.5,0.3,0.2],
	    P : 5,
	    T : 390.0,
	    A : [ [3.97786,1064.840,-41.136],
		  [4.00139,1170.875,-48.833],
		  [3.93002,1182.774,-52.532]],
	    F : 20.0
	 };
    }
    else if (sys === 2) {
	// methanol, ethanol, water
	// data: http://webbook.nist.gov/cgi/cbook.cgi?ID=C67561&Mask=4&Type=ANTOINE&Plot=on
	//
	 ic = {
	    x : null,
	    y : null,
	    z : [0.333,0.333,0.333],
	    P : 0.4,
	    T : 330.0,
	    A : [ [5.20409,1581.341,-33.50], 
		  [5.24677,1598.673,-46.424],
		  [5.0768,1659.793,-45.854]],
	    F : 20.0
	 };	
    };
    else if (sys === 3) {
	// methanol, ethanol, water
	// data: http://webbook.nist.gov/cgi/cbook.cgi?ID=C67561&Mask=4&Type=ANTOINE&Plot=on
	//
	ic = {
	    x : null,
	    y : null,
	    z : [0.53,0.039,0.0980,0.328,0.003012],
	    P : 0.2,
	    T : 363.0,
	    A : [ [5.20409,1581.341,-33.50], 
		  [5.24677,1598.673,-46.424],
		  [5.0768,1659.793,-45.854]],
	    F : 20.0
	 };	
    };
    if (debug) {console.log("flash_data.js: getInitialConditions: sys = ", sys, "ic = ", ic)};
    return ic;	
}

function getRanges(sys=1) {

    // return an object containing
    // the limits of each slider prop
    //
    // args:
    // sys - chemical system id
    
    var range;
    if (sys === 1) {
	range = {
	    P: {
		min: 4.6,
		max: 5.8
	    },
	    T: {
		min:360,
		max:420
	    },
	    F: {
		min: 1.0,
		max: 40.0
	    },
	    V: {
		min: 0.0,
		max: 40.0
	    },
	    L: {
		min: 0.0,
		max: 40.0
	    }
	};
    }
    else if (sys === 2) {
	range = {
	    P: {
		min: 0.2,
		max: 1.2
	    },
	    T: {
		min:320.0,
		max:360.0
	    },
	    F: {
		min: 1.0,
		max: 40.0
	    },
	    V: {
		min: 0.0,
		max: 40.0
	    },
	    L: {
		min: 0.0,
		max: 40.0
	    }
	};
    };
    return range;
};

function getColours(sys) {

    if (sys === 1) {
	return ['#2e8ade','#de912e','#2ede71'];
    }
    else if (sys === 2) {
	// return ['#DF310C', '#ffffff', '#2e8ade'];
	//return ['#858585', '#ffffff', '#2e8ade'];
	return ['#BC0CDF','#DFBC0C','#0CDFBC'];
    };

};
