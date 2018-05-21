// VCE Project - Reactor class
//
// A simple class to store input/output information and apply
// various transformations to simulate a reactor unit operation.
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
       components  - component names (array of n strings)
       c0          - initial concentrations (array of n floats)
       T           - reactor temperature/K (float)
       debug       - specifices run mode

     */
 
    // Reactor attributes                       
    this.V = V;        
    this.reactions = reactions;   
    this.components = components;
    this.c0 = c0;
    this.conc = c0;
    this.T = T;
    this.t = 0.0;                // current sim time/s

    // Reactor methods
    this.stats = function() {
	// show key reactor details
	console.log(this);
    };

    this.step = function(dt) {
	// step the reactor forward in time by dt

	// compute the concentration Jacobian

	// compute the new concentrations
	
    };

    this.Jacobian = function() {
	// compute the Jacobian based on all reaction contributions
	return null
    };

  
};


function unit_testReactor() {

    /* Reactor unit test */
    testReac = new Reactor();
    testReac.stats();
    test_status = 'Failed';
    console.log("vce_reactor.unit_testReactor:", test_status);
};
	
