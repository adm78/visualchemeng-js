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


