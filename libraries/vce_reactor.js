// VCE Project - Reactor class
//
// A simple class to store input/output information and apply
// various transformations to simulate a reactor unit operation.
//
// Requires:
// 
//
// Andrew D. McGuire 2018
// a.mcguire227@gmail.com
//----------------------------------------------------------

function Reactor(input=null,tau=null,volume=null,debug=false,
		 reactions=[],components=[]) {

    /* Initialise the reactor.  */
 
    // Reactor attributes
    this.tau = tau;               // residence time [s]
    this.input = input;           // input vce_stream object
    this.volume = volume;         // reactor volume [m3]
    this.reactions = reactions;   // an array of vce_reaction objects
    this.components = components; // an array of vce_component objects

    // Reactor methods
    this.stats = function() {
	console.log(this);
    };
};

function unit_testReactor() {

    /* Reactor unit test */
    testReac = new Reactor();
    testReac.stats();
    test_status = 'Failed';
    console.log("vce_reactor.unti_testReactor:", test_status);
};
	
