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
function AnalyticalReactor() { 

    // Assumptions:
    // - constant volume
    // - constant T

    // describe the reaction A + B => C
    var components = ['A','B','C'];
    var stoich = [1,1,-1]
    var A = 1.0;
    var Ea = 10000.0;
    var simple_reaction = new Reaction(A,Ea,components,stoich,debug)
    console.log("simple reaction = ", simple_reaction);
    var reactions = [simple_reaction];
    var V = 1.0;
    var c0 = [1.0, 2.0, 0.0];
    var T = 298;
   

    // call the parent constructor
    Reactor.call(this,V,reactions,components,c0,T,debug);

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

	this.conc_prev_step = this.conc
	this.conc = [Na/this.V, Nb/this.V, Nc/this.V];
	this.t = this.t + dt;	
    };

    
};

