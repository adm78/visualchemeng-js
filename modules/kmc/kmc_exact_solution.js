// VCE Project - kmc_solution.js Kinetic Monte Carlo (KMC)
//
// This file contains the exact solution class used within the
// kmc modules. 
//
// Requires:
//
// Andrew D. McGuire, Gustavo Leon 2017
// (a.mcguire227@gmail.com)
//----------------------------------------------------------

function exact_Solution(na,nb,nc,t) {

    // intialise the solution object
    this.NA = na;
    this.NB = nb;
    this.NC = nc;
    this.Ntot = na+nb+nc;
    this.time = t;

    function exact_update(na,nb,nc,t) {
	
	// updates the concentration histoies
	// using the new data point.
	this.NA = na;
	this.NB = nb;
	this.NC = nc;
	this.Ntot = na+nb+nc;
	this.time = time;

    };
}

