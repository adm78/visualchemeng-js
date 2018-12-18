// VCE Project - Separator class
//
// A simple class to store input/output information and apply
// various transformations to simulate a separation unit operation.
//
// Requires:
// - vce_utils.js
// - vce_math.js
//
// Andrew D. McGuire 2018
// a.mcguire227@gmail.com
//----------------------------------------------------------

function Separator(x=null,y=null,z=null,L=null,V=null,F=null,T=null,
		   P=null,A=null,components=null,debug=false) {

    /* Initialise the separator. 

    */
 

    // Separator attributes
    this.x = x;
    this.y = y;
    this.z = z;
    this.L = L;
    this.V = V;
    this.F = F;
    this.T = T;
    this.P = P;
    this.A = A;
    this.K = getK(T,P,A,debug);
    this.components = components

    // Separator methods   
    this.solve_PTZF = function(debug=false) {

	// Solve for/assing all ckomputable attributes given
	// pressure, temp, feed comp and feed flowrate
	// using the Rachford-Rice method.

	if (debug) { console.log("vce_seperator.js: running solve_PTZF on sep =", this) };

	var beta_solution = vce_math.solver.newtonsMethod(RachfordRiceBeta,0.5,[this.z,this.K]);
	var beta = beta_solution[1];
	if (debug) {
	    console.log("vce_seperator.js: beta_solution = ", beta_solution);
	};
	
	if (beta > 1) {
	    this.V = this.F;
	    this.L = this.F - this.V;
	    this.x = [null,null,null];
	    this.y = this.z;
	}
	else if (beta < 0) {
	    this.V = 0.0;
	    this.L = this.F;
	    this.x = this.z;
	    this.y = [null,null,null];	    
	}
	else {
	    this.V = beta*this.F;
	    this.L = this.F - this.V;
	    this.x = getX(this.z,this.K,beta);
	    this.y = getY(this.x,this.K);
	}
	if (debug) { console.log("vce_seperator.js: post solve_PTZF object = ", this) };

    };

    this.updateP = function(P,debug=false) {
	this.P = P;
	this.K = getK(this.T,this.P,this.A,debug);
    };


    this.updateT = function(T,debug=false) {
	this.T = T;
	this.K = getK(this.T,this.P,this.A,debug)
    };

;
    
} // end of Separator class


function RachfordRiceBeta(beta, args) {
    
    // Wrapper function for RachfordRiceSum
    // that ensure it has a fixed number of args
    // args = [z,k]
    
    return RachfordRiceSum(beta, args[0], args[1]);
}

function RachfordRiceElem(zi,Ki,beta) {
    
    /* Compute a single term of the rachford Rice sum
       
       args:
       beta - vapour liquid split (float)
       zi   - feed composition point
       Ki   - component equilibrium constant
    */
    var result = zi*(Ki-1)/(1+beta*(Ki-1));
    return result;
};

function RachfordRiceSum(beta,z,K) {
    
    /* Compute Rachford Rice sum
       http://folk.ntnu.no/skoge/bok/mer/flash_english_edition_2009
       
       args:
       beta - vapour liquid split (float)
       z    - feed composition array
       K    - component equilibrium constant array
    */
    
    var result = 0.0;
    var arrayLength = z.length;
    for (var i = 0; i < arrayLength; i++) {
	result = result + RachfordRiceElem(z[i],K[i],beta);
    };
    return result;
};

function P_Antoine(T,coeffs) {

    // Return the pressue in bar based on Antoine coefficients where
    // T is in [K]
    // http://ddbonline.ddbst.com/AntoineCalculation/
    // AntoineCalculationCGI.exe?component=Ethanol
    
    var A = coeffs[0];
    var B = coeffs[1];
    var C = coeffs[2];
    var exponent = A - (B/(C+T));
    return Math.pow(10,exponent);   
};

function P_Antoine_Alt(T,coeffs) {

    // Return the pressue in bar based on
    // alternative vap pressure equation
    
    var A = coeffs[0];
    var B = coeffs[1];
    var C = coeffs[2];
    var D = coeffs[3];
    var E = coeffs[4];
    var exponent = A + (B/T) + C*Math.log(T) + D*Math.pow(T,E);
    return Math.exp(exponent)/101325.0;   
};


function getK(T,P,A,debug=false) {
    K = [];
    for (var i = 0; i < A.values.length; i++) {
	if (A.eqns[i] === 1) {
	    K[i] = P_Antoine(T,A.values[i])/P;
	}
	else if (A.eqns[i] === 2) {
	    K[i] = P_Antoine_Alt(T,A.values[i])/P;
	}
	else if (A.eqns[i] === 3) {
	    K[i] = P_Antoine(T,A.values[i])/(760.0*P);
	}
	else {
	    console.log("Error: vce_seperator.getK: unknown saturation pressure equation requested");
	};
    };
    if (debug) {console.log("K = ", K)};
    return K;
};

function getY(x,K) {
    
    // Generate the vapour composition array
    
    var y = [];
    var arrayLength = x.length;
    for (var i = 0; i < arrayLength; i++) {
	y[i] = K[i]*x[i];
    };
    return y;
};


function getX(z,K,beta) {

    // Generate the liquid composition array
    var x = [];
    var arrayLength = z.length;
    for (var i = 0; i < arrayLength; i++) {
	x[i] = z[i]/(1+beta*(K[i]-1));
    };
    return x;
};

// testInput = new Input(0.5, 390.0, [0.5,0.3,0.2], [1.685,0.742,0.532],20);
// var expectedOutput = new Output([0.33940869696634357, 0.3650560590371706, 0.2955352439964858],
// 				[0.5719036543882889, 0.27087159580558057, 0.15722474980613044],
// 				    13.814605255477089, 6.185394744522911);
