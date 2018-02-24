// VCE Project - Reaction class
//
// A simple class to store information and compute 
// reaction information.
//
// Requires:
// 
//
// Andrew D. McGuire 2018
// a.mcguire227@gmail.com
//----------------------------------------------------------

function Reaction(A=[],Ea=[],comp=[],debug=false) {

    /* Initialise the reactor.  */
 
    // Reactor attributes
    this.A = A;                   // Arrhenius prefactors (array)
    this.Ea = input;              // Activation Energies (array)
    this.comp = comp;             // Component names (array)
    this.stoich = stoich;         // Stochiometric values (array)

    // Reactor methods
    this.stats = function() {
	console.log(this);
    };

    this.Arrhenius = function(T) {
	// Compute rate constant k using Arrhenius Eqn.
	
    }
};

function unit_testReactor() {

    /* Reactor unit test */
    testReac = new Reactor();
    testReac.stats();
    test_status = 'Failed';
    console.log("vce_reactor.unti_testReactor:", test_status);
};
	
