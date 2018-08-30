// VCE Project - Reactor base class
//
// A sudo abstract reactor base class to store input/output
// information and apply various transformations to simulate a reactor
// unit operation.
//
// You should not use this class directly. Proper subclasses must be
// constructed for use. These subclasses are expected to override any
// of the methods denoted as an 'abstract method' below.
//
// Requires:
// vce_reaction.js
//
// Andrew D. McGuire 2018
// a.mcguire227@gmail.com
//----------------------------------------------------------

function Reactor(V=null,reactions=[],components=[],c0=[],
		 T=298,debug=false) {

    /* Initialise the reactor  
       
       V           - reactor volume/m3 (float)
       reactions   - reactions present (array of reaction objects)
       components  - component definitions (list of JSON objects)
       c0          - initial concentrations (array of n floats)
       T           - reactor temperature/K (float)
       debug       - specifices run mode

     */
 
    // Reactor attributes                       
    this.V = V;                   // reactor volume 
    this.reactions = reactions;   // list of vce_reaction.Reaction objects
    this.components = components; // list of component a list of JSON objects
    this.c0 = c0;        // initial concentrations
    this.conc_prev = c0; // concentrations at beginning of previous step
    this.conc = c0;      // current concentratons
    this.T = T;          // current temperature/K
    this.t_prev = null   // time before the previous step/s
    this.t = 0.0;        // current sim time/s

    // Reactor methods
    this.stats = function() {
	// show key reactor details
	console.log(this);
    };

    // abstract method
    this.step = function(dt) {
	// advance the reactor forward in time
	throw new Error('You have to implement the method this.step!');	
    };

    // abstract method
    this.Jacobian = function() {
	// compute the Jacobian based on all reaction contributions
	throw new Error('You have to implement the method this.Jacobian!');
    };


    // abstract method
    this.Q = function() {
	// compute the duty of the reactor unit
	throw new Error('You have to implement the method this.Q!');
    }

    // abstract method
    this.conversion = function() {
	// return the reactant conversion as a fraction
	throw new Error('You have to implement the method this.conversion!');
    }

  
};


function unit_testReactor() {

    /* Reactor unit test */
    testReac = new Reactor();
    testReac.stats();
    test_status = 'Failed';
    console.log("vce_reactor.unit_testReactor:", test_status);
};
	
