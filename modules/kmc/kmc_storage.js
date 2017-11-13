// VCE Project - Kinetic Monte Carlo (KMC) - kmc_storage.js
//
// This file contains the data storage class used within the
// kmc modules. 
//
// Requires:
// - kmc_solution.js
//
// Andrew D. McGuire, Gustavo Leon 2017
// (a.mcguire227@gmail.com)
//----------------------------------------------------------

function Storage(solution) {

    // concentration histories
    this.NA  = [solution.NA];
    this.NB = [solution.NA];
    this.NC = [solution.NA];
    this.Ntot = [solution.NA+solution.NB+solution.NC];
    this.time = [solution.time];

    this.update = function(solution) {

	// updates the concentration histoies
	// using the new data point.
	this.NA.push(solution.NA);
	this.NB.push(solution.NB);
	this.NC.push(solution.NC);
	this.Ntot.push(solution.NA+solution.NB+solution.NC);
	this.time.push(solution.time);

    }

    this.clear = function() {

	// purge the container
	this.NA = []; 
	this.NB = [];
	this.NC = [];
	this.Ntot = [];
	this.time = [];	
    }

}

