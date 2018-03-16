// VCE Project - heatrod_data.js
//
// This file stores material properties for a range of materials which
// may be used in the system calculation, reference by the sys id (int).
//
// Requires:
// no requirements
//
// Andrew D. McGuire 2017
// a.mcguire227@gmail.com
// Fraser M Baigent 2018
// fraserbaigent@gmail.com
//----------------------------------------------------------
// Material index (c,k,rho)
//
// sys:
// 0 - Iron
// 1 - Steel
// 2 - Aluminium
// 3 - Copper
// 4 - Brass
// 5 - Polystyrene
// 6 - Rubber
// 7 - Ceramic
//
//---------------------------------------------------------

function getProperties(sys=0,debug=false) {

    // Return property data of object
    //
    // args:
    // sys - material ID
    
    var ic;
    if (sys === 0) {
	// Iron
	ic = {
	    k : 1.0,
	    c : 1.0,
	    rho:1.0};	
    };
    if (sys === 1) {
	// Steel
	ic = {
	    k : 1.0,
	    c : 1.0,
	    rho:1.0};	
    };
    else if (sys === 2) {
	// Aluminium
	ic = {
	    k : 1.0,
	    c : 1.0,
	    rho:1.0};	
    };
    else if (sys === 3) {
	// Copper
	ic = {
	    k : 1.0,
	    c : 1.0,
	    rho:1.0};	
    };
    else if (sys === 4) {
	// Brass
	ic = {
	    k : 1.0,
	    c : 1.0,
	    rho:1.0};	
    };
    else if (sys === 5) {
	// Polystyrene
	ic = {
	    k : 1.0,
	    c : 1.0,
	    rho:1.0};	
    };
    else if (sys === 6) {
	// Rubber
	ic = {
	    k : 1.0,
	    c : 1.0,
	    rho:1.0};	
    };
    else if (sys === 7) {
	// Ceramic
	ic = {
	    k : 1.0,
	    c : 1.0,
	    rho:1.0};	
    };
    if (debug) {console.log("flash_data.js: getInitialConditions: sys = ", sys, "ic = ", ic)};
    return ic;	
}

function getRanges(sys=0) {

    // return an object containing
    // the limits of each slider prop
    //
    // args:
    // sys - material ID
    // in general the ranges should be input to ensure the temperature doesn't go above the melting point or cause any expansion/effects that ruin the calculation
    
    var range;
    if (sys === 0) {
	range = {
	    TL: {
		min: -10.0,
		max: 100.0
	    },
	    TR: {
		min:-10,
		max:100.0
	    },
	    T0: {
		min: -10.0,
		max: 100.0
	    },
	    L: {
		min: 0.0,
		max: 2.0
	    },
	    tmax: {
		min: 0.0,
		max: 300.0
	    }
	};
    }
	else {
	range = {
	    TL: {
		min: -10.0,
		max: 100.0
	    },
	    TR: {
		min:-10,
		max:100.0
	    },
	    T0: {
		min: -10.0,
		max: 100.0
	    },
	    L: {
		min: 0.0,
		max: 2.0
	    },
	    tmax: {
		min: 0.0,
		max: 300.0
	    }
	};
	}
    return range;
};

function getColours(sys) {

    if (sys === 2) {
	return ['#2e8ade','#de912e','#2ede71'];
    }
    else if (sys === 3) {
	// return ['#DF310C', '#ffffff', '#2e8ade'];
	//return ['#858585', '#ffffff', '#2e8ade'];
	return ['#BC0CDF','#DFBC0C','#0CDFBC'];
    }
    else if (sys === 1) {
	return ['#BC0CDF','#DFBC0C','#0CDFBC','#2e8ade','#de912e','#2ede71'];
    };    

};
