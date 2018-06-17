// VCE Project - Analytical reactor class
//
// This class can be used to analytically simulate a simple batch
// reactor with the reaction:
//
// A + B --> C
//
// with rate k*CA*CB*V and k = A*exp(-RT/Ea). It inherets from the
// standard Reactor class.
//
// Requires:
// vce_reaction.js
//
// Andrew D. McGuire 2018
// a.mcguire227@gmail.com
//----------------------------------------------------------
function AnalyticalReactor(options) { 

    // Args:
    // 	- options (JSON object) : Descriptions of the reactor.
    // Required attributes are:
    //    - A (float) : Arrhenius prefactor [mol.m^3/s]
    //    - Ea (float) : Activation energy [J/mol]
    //    - components (str array) : List of component names.
    //    - T (float) : The reactor temperature [K].
    //    - c0 (float array) : List of intial concentrations.
    //    - debug (bool) : Set the run mode.
    //
    // Assumptions:
    // 	- constant volume
    // 	- constant T

    // describe the reaction A + B => C
    var stoich = [1,1,-1] // hard coded to match 'step' until it's generalised
    var simple_reaction = new Reaction(options.A,options.Ea,
				       options.components,
				       stoich,options.debug)
    var reactions = [simple_reaction];
    var V = 1.0;
   

    // call the parent constructor
    Reactor.call(this, V, reactions, options.components,
		 options.c0, options.T, options.debug);

    this.step = function(dt) {

	// step the reactor forward in time by dt/s

	var Na0 = this.c0[0]*this.V;
	var Nb0 = this.c0[1]*this.V;
	var Nc0 = this.c0[2]*this.V;
	var alpha = Nb0 - Na0;
	var num = Na0*alpha;
	var k = this.reactions[0].k(this.T)
	var exp = Math.exp(+k*alpha*this.t/this.V)
	var den = Nb0*exp-Na0;
	var Na = num/den;
	var Nb = Na + Nb0 - Na0;
	var Nc = Nc0 + Na0 - Na;
	
	if (debug) {
	    console.log("Na0, Nb0, Nc0 = ", this.c0[0],this.c0[1],this.c0[2]);
	    console.log("k = ", k);
	    console.log("exp = ", exp);
	    console.log("alpha = ", alpha);
	    console.log("den = ", den);
	    console.log("num = ", num);
	    console.log("t = ", this.t);
	    console.log("[Na, Nb, Nc] = ", [Na, Nb, Nc]);
	};

	// perform the property updates
	this.conc_prev = this.conc
	this.conc = [Na/this.V, Nb/this.V, Nc/this.V];
	this.t_prev = this.t;
	this.t = this.t + dt;	
    };

    this.Q = function() {
	// Computre the duty of this batch system.
	// Assumed that the olume has remained constant.
	var Q = 0.0;
	for (var i = 0; i < this.components.length; i++) {
	    var dc = this.conc[i] - this.conc_prev[i];
	    var dt = this.t - this.t_prev;
	    Q = Q + (dc/dt)*this.components[i].h*this.V;
	};
	return Q;
    };

    this.conversion = function() {
	// compute the conversion as a fraction
	var lci = this.get_limiting_component_index();
	if (this.c0[lci] == 0) {
	    var conv = 0.0;
	}
	else {
	    var conv = 1.0 - (this.conc[lci]/this.c0[lci]);
	};
	return conv;
    };

    
    this.get_limiting_component_index = function() {
	// Get the array index of the limiting reactant species.
	//
	// Note: this is probably not general enough to be expanded to
	// other systems... be careful if you copy it!
	var lci = null;
	var min_nq = null;
	for (var i = 0; i < this.components.length; i++) {
	    var stoich_i = this.reactions[0].stoich[i];
	    if (stoich_i > 0) {
		// we have a reactant
		var normalised_quant = this.c0[i]/stoich_i;
		if (min_nq == null || normalised_quant < min_nq) {
		    min_nq = normalised_quant;
		    lci = i;
		};
	    };
	}
	if (lci == null) {
	    throw new Error("Limiting reactive component could not be found!")
	}
	return lci;
    };
    
};

