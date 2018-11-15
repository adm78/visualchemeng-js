// VCE Project - vce_math.js
//
// Library of custom mathematical routines. 
//
// Requires:
// - No requirements
//
// Andrew D. McGuire 2018
// amcguire227@gmail.com
//----------------------------------------------------------
var vce_math = {

    // Core functions
    add : function(a,b) {
	// A helper function for adding
	return a + b;
    },


    sum : function(mylist) {
	// sum an array of numbers
	return mylist.reduce(this.add,0);
    },


    derivative : function(f,x,args) {
	// Numerical derivative approximation of a function f
	// evaluated at x
	var h = 0.001;
	return (f(x + h,args) - f(x - h,args)) / (2 * h); 
    },
    
    
    // Utilities
    getRandomSigned : function() {
	// generate a random number between 1 and -1
	return Math.random()*2.0-1.0
    },

    
    getRandomSingnedInt : function() {
	// randomly return either -1 or 1
	var dir = [-1,1];
	return dir[Math.floor(Math.random() * dir.length)]
    },
    
};


// Numerical solvers (only root finders for now)
vce_math.solver =  {
    
    newtonsMethod : function(f,x0,args) {
	// A basic implmentation of Newton's root finder method
	// based on https://en.wikipedia.org/wiki/Newton%27s_method
	//
	// args:
	// f - function in x, args to be evaluated (2 inputs)
	// x0 - intial guess
	//
	// returns an array of the form [bool passed_log, double xsoln]

	var epsilon = 10e-14;
	var tolerance = 1e-7;
	var maxIterations = 20;
	var solution_found_log = false;
	var x1 = x0

	for (i = 0; i < maxIterations; i++) {

	    var x0 = x1
	    var y = f(x0,args);
	    var yprime = vce_math.derivative(f,x0,args)

	    // Don't want to divide by too small of a number denominator
	    // is too small
	    if (Math.abs(yprime) < epsilon) {
		break; //Leave the loop
	    }

	    var x1 = x0 - y/yprime //Do Newton's computation

	    //console.log("x=",x0,"y=",f(x0));

	    if (Math.abs(x1 - x0) <= tolerance * Math.abs(x1)) {
		//If the result is within the desired tolerance
		solution_found_log = true;
		break; //Done, so leave the loop
	    }
	}

	var result = [solution_found_log,x1]
	return result	

    }

};
