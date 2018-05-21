// VCE Project - Reaction class
//
// A simple class to store information and compute 
// reaction information.
//
// Requires:
// vce_constants.js
//
// Andrew D. McGuire 2018
// a.mcguire227@gmail.com
//----------------------------------------------------------
let constants = new Constants();

function Reaction(A=0.0,Ea=0.0,components=[],stoich=[],debug=false) {

    /* Initialise the reaction   */
 
    // Reactor attributes
    this.A = A;                   // Arrhenius prefactor
    this.Ea = Ea;              // Activation Energy/J
    this.components = components; // Component names (string array)
    this.stoich = stoich;         // Stochiometric values (float array)

    // Reactor methods
    this.stats = function() {
	console.log(this);
    };

    this.k = function(T) {
	// Compute rate constant k using Arrhenius Eqn.
	return this.A*Math.exp(-this.Ea/(constants.R*T))
    };

    this.Jacobian = function(reac) {

	// returns the Jacobian (dN/dt) inputs: reac - a Reactor
	// object outputs: Jacobian - an array of float with length =
	// reac.components.length
	//
	// Note: active components in reac are matched by name to
	// this.components. If a component is present in
	// this.components but not in reac.components, then it's
	// concentration is assumed to be 0.  If a product is formed
	// that is not in reac.components, then a warning is raised,
	// but we proceed with computing the array elements for those
	// parameters that are in both arrays.

	
    };
};

	
