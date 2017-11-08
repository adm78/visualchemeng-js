// VCE Project - kmc.js Kinetic Monte Carlo (KMC)
//
// This script performs a simple, kinetic Monte Carlo
// simulation of the reaction:
//
//                   A <==> B <==> C
//
// Requires:
// - plotly-latest.min.js
// - kmc_storage.js
// - kmc_solution.js
//
// Andrew D. McGuire, Gustavo Leon 2017
// (a.mcguire227@gmail.com)
//----------------------------------------------------------


// --------------------------------------------------
//             kmc functionality
//---------------------------------------------------
// initial conditions
var NA = 10000;
var NB = 0;
var NC = 0;
var time = 0.0;

// final conditions
var tmax = 1000.0;
var smax = 100000;

// storage/solution intialisation
var kmc_Solution = new Solution(NA,NB,NC,time);
var kmc_Storage = new Storage(kmc_Solution);
var ss_Solution = new Solution(NA,NB,NC,time)

// rate constants
// A --> B, r1 = k1*NA
// B --> A, rb1 = kb1*NB
// B --> C, r2 = k2*NB
// C --> B, rb2 = kb2*NC
var rate_consts = {k1:10.0,kb1:5.0,k2:10.0,kb2:5.0};


function jumpLoop(solution,rate_consts,tmax,smax,storage) {

    // Simulate using kmc to tmax with intial conditions
    // given by 'solution'. Not exceeding smax steps.
    // storage is a validate Storage object to collect data. 
    
    var steps = 0;
    while (solution.time < tmax && steps < smax) {
	
	var rates = getRates(solution,rate_consts);
	var cum_rates = getCumulativeRates(rates);
	var total_rate = cum_rates[cum_rates.length-1];
	var q = Math.random()*total_rate;
	var dt = - Math.log(Math.random())/total_rate;
	var solution = doJump(solution,q,cum_rates,dt); // update the solution
	storage.update(solution); 
	steps += 1;
	
    }
    return {solution: solution,
	    storage: storage};
}


function getRates(s,rc) {

    // Compute the rates given solution state s
    // and rate contants array rc.
    
    var r1 = rc.k1*s.NA;
    var rb1 = rc.kb1*s.NB;
    var r2 = rc.k2*s.NB;
    var rb2 = rc.kb2*s.NC;
    return [r1, rb1, r2, rb2];
}


function getCumulativeRates(rl) {

    // Return the cumulative rates list
    
    for (i = 1; i < rl.length; i++) {
	rl[i] += rl[i-1];
    }
    return rl
}

function doJump(s,q,cr,dt) {
    
    // Perform one of the jump processes on solution
    // s according random deviate q, cumualtive
    // rate array cr and time step dt.
    // Returns new solution.
    
    if (q <= cr[0]) {
	s.NA -= 1;
	s.NB += 1;
    }
    else if (q < cr[1]) {
	s.NB -= 1;
	s.NA += 1;
    }
    else if (q < cr[2]) {
	s.NB -= 1;
	s.NC += 1;
    }
    else if (q < cr[3]) {
	s.NC -= 1;
	s.NB += 1;
    }

    // update the time
    s.time = s.time + dt    
    
    return s
}

result = jumpLoop(kmc_Solution,rate_consts,tmax,smax,kmc_Storage)
kmc_Solution = result.solution;
kmc_Storage = result.storage;
console.log("Time evolution completed!")

// --------------------------------------------------
//             visualisation functionality
// --------------------------------------------------
var trace1 = {
  type: "scatter",
  mode: "lines",
  name: 'NA kmc',
  x: kmc_Storage.time,
  y: kmc_Storage.NA,
  line: {color: '#17BECF'}
}

var trace2 = {
  type: "scatter",
  mode: "lines",
  name: 'NB kmc',
  x: kmc_Storage.time,
  y: kmc_Storage.NB,
  line: {color: '#7F7F7F'}
}

var trace3 = {
  type: "scatter",
  mode: "lines",
  name: 'NC kmc',
  x: kmc_Storage.time,
  y: kmc_Storage.NC,
  line: {color: '#EE9A00'}
}


var data = [trace1,trace2,trace3];

var layout = {
  title: 'Concentration evolution',
};

Plotly.newPlot('myDiv', data, layout);
    
