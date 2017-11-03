// VCE Project - kmc.js Kinetic Monte Carlo (KMC)
//
// This script performs a simple, kinetic Monte Carlo simulation of
// the reaction: A <==> B <==> C
//
// Requires:
// - p5.js or p5.min.js
// - grafica-0.1.0.min.js or grafica.min.js or grafica.js
//
// Andrew D. McGuire, Gustavo Leon 2017
// (a.mcguire227@gmail.com)
//----------------------------------------------------------



// --------------------------------------------------
//             visualisation functionality
// ------------------------------------------------
//
// Set-up parameters


// try some plotting
console.log("Hello world. I'm going to be the VCE Kinetic Monte Carlo Module.")
console.log("But, for now, let's see if we can show a some graphs!")

TESTER = document.getElementById('tester');
Plotly.plot( TESTER, [{
    x: [1, 2, 3, 4, 5],
    y: [1, 2, 4, 8, 16] }], {
	margin: { t: 0 } } );


Plotly.d3.csv("https://raw.githubusercontent.com/plotly/datasets/master/finance-charts-apple.csv", function(err, rows){

    function unpack(rows, key) {
  return rows.map(function(row) { return row[key]; });
}


var trace1 = {
  type: "scatter",
  mode: "lines",
  name: 'AAPL High',
  x: unpack(rows, 'Date'),
  y: unpack(rows, 'AAPL.High'),
  line: {color: '#17BECF'}
}

var trace2 = {
  type: "scatter",
  mode: "lines",
  name: 'AAPL Low',
  x: unpack(rows, 'Date'),
  y: unpack(rows, 'AAPL.Low'),
  line: {color: '#7F7F7F'}
}

var data = [trace1,trace2];

var layout = {
  title: 'Basic Time Series',
};

Plotly.newPlot('myDiv', data, layout);
})

// --------------------------------------------------
//             kmc functionality
//---------------------------------------------------
// initial conditions
var NA = 10000;
var NB = 0;
var NC = 0;
var Ntot_init = NA + NB + NC;
var time = 0.0
var tmax = 1000.0;
var steps = 0;
var smax = 100000;

// composition vectors
var NAvec = [];
var NBvec = [];
var NCvec = [];
var NA_ss = []
var NB_ss = [];
var NC_ss = [];

var time_vec = [time];

// rate constants
var k1 = 10.0; // A --> B, r1 = k1*NA
var kb1 = 5.0; // B --> A, rb1 = kb1*NB
var k2 = 10.0; // B --> C, r2 = k2*NB
var kb2 = 5.0; // C --> B, rb2 = kb2*NC

while (time < tmax && steps < smax) {

    var rates = getRates();
    var cum_rates = getCumulativeRates(rates);
    var total_rate = cum_rates[cum_rates.length-1];
    var q = Math.random()*total_rate;
    var dt = - Math.log(q)/total_rate
    doJump(q,cum_rates);
    time = time + dt;
    steps += 1;
    
}
console.log("Time evolution completed!")

function getRates() {
    // compute the rates
    var r1 = k1*NA;
    var rb1 = kb1*NB;
    var r2 = k2*NB;
    var rb2 = kb2*NC
    return [r1, rb1, r2, rb2];
}


function getCumulativeRates(rl) {
    // return the cumulative rates list
    for (i = 1; i < rl.length; i++) {
	rl[i] += rl[i-1];
    }
    return rl
}

function doJump(q,cr) {
    // perform one of the jump processes
    if (q <= cr[0]) {
	NA -= 1;
	NB += 1;
    }
    else if (q < cr[1]) {
	NB -= 1;
	NA += 1;
    }
    else if (q < cr[2]) {
	NB -= 1;
	NC += 1;
    }
    else if (q < cr[3]) {
	NC -= 1;
	NB += 1;
    }
    
}
