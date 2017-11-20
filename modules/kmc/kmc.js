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
var Ntot = NA+NB+NC;

// limits
var tmax = 100.0;
var smax = 1000;

// storage/solution intialisation
var kmc_Solution = new Solution(NA,NB,NC,time);
var exact_Solution = new Solution(NA,NB,NC,time);
var kmc_Storage = new Storage(kmc_Solution);
var exact_Storage = new Storage(exact_Solution);
var ss_Solution = new Solution(NA,NB,NC,time)

//console.log(exact_Storage)
//console.log(kmc_Storage)

// rate constants
// A --> B, r1 = k1*NA
// B --> A, rb1 = kb1*NB
// B --> C, r2 = k2*NB
// C --> B, rb2 = kb2*NC
var rate_consts = {k1:10.0,kb1:5.0,k2:10.0,kb2:5.0};



function simulate(solution,rate_consts,tmax,smax,storage) {

    // Simulate using kmc to tmax with intial conditions
    // given by Solution object 'solution', not exceeding smax steps.
    // 'storage' is a validate Storage object to be populated
    // with data.
    //
    // Returns the solution object in its final state and the
    // updated storage object.
    
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
    for (i = 1; i < rl.length; i++) {rl[i] += rl[i-1]};
    return rl
}

function exactSolution(exact_Solution,rc,exact_Storage,max_time,smax,min_time) {

    // Return the exact solution at time t as defined by Vriens1954:
    // DOI: 10.1021/ie50532a024
	
    var alpha = rc.k2/rc.k1;
    var K1 = rc.k1/rc.kb1;
    var K2 = rc.k2/rc.kb2;
    
    var E1 = 1.0 + 1.0/K1 + alpha + alpha/K2;
    var E2 = alpha*(1.0+1.0/(K1*K2)+1.0/K2);
    var D1 = (-E1+Math.sqrt(Math.pow(E1,2)-4*E2))/2.0;
    var D2 = (-E1-Math.sqrt(Math.pow(E1,2)-4*E2))/2.0;
    
    var C1 = (-1-D2 + alpha/(K1*K2*D1))/(D1-D2);
    var C2 = (1+D1-alpha/(K1*K2*D2))/(D1-D2);
    var C3 = (alpha/D1)/(D1-D2);
    var C4 = (-alpha/D2)/(D1-D2);
    
    //console.log(Storage.time[999])
    var steps = 1;
    var time_step = (max_time-min_time)/smax;
    var iter_time = min_time;
    
    //console.log(max_time)
    while (steps < smax+1) {
	exact_Solution.time = iter_time;
	var Theta = rc.k1*iter_time;
	exact_Solution.NA = Ntot*(C1*Math.exp(D1*Theta)+C2*Math.exp(D2*Theta)+alpha/(K1*K2*E2));
	exact_Solution.NC = Ntot*(C3*Math.exp(D1*Theta)+C4*Math.exp(D2*Theta)+alpha/(E2));
	exact_Solution.NB = Ntot-exact_Solution.NA-exact_Solution.NC;
	exact_Storage.update(exact_Solution); 
	steps +=1;
	iter_time += time_step;
	}
	//console.log(rc.k1)
	//console.log(exact_Solution)
	//console.log(Theta);
	//console.log(exact_Storage);
	
    return {Solution: exact_Solution,
	    Storage: exact_Storage};
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


// --------------------------------------------------
//             visualisation functionality
// --------------------------------------------------
var paused_log = false;
var first_run = true;

function unpack_data(storage, storage2) {
    // unpacks storage data to extend plotly graph
    return{
	x: [storage.time, storage.time, storage.time,
	    storage2.time, storage2.time, storage2.time],
	y: [storage.NA, storage.NB, storage.NC,
	    storage2.NA, storage2.NB, storage2.NC]
    };
}

function get_traces(storage, storage2) {
    // generates an array of plotly trace objects
    // from a kmc storage object
    var trace1 = {
	type: "scatter",
	mode: "lines",
	name: 'NA kmc',
	x: storage.time,
	y: storage.NA,
	line: {color: '#FF0000'},
	maxdisplayed: 100
    }
    
    var trace2 = {
	type: "scatter",
	mode: "lines",
	name: 'NB kmc',
	x: storage.time,
	y: storage.NB,
	line: {color: '#0000FF'},
    }
    
    var trace3 = {
	type: "scatter",
	mode: "lines",
	name: 'NC kmc',
	x: storage.time,
	y: storage.NC,
	line: {color: '#00FF00'},
    }
	
	var trace4 = {
	type: "scatter",
	mode: "circle",
	name: 'NA exact',
	x: storage2.time,
	y: storage2.NA,
	line: {color: '#18BECF'},
	maxdisplayed: 100
    }
    
    var trace5 = {
	type: "scatter",
	mode: "circle",
	name: 'NB exact',
	x: storage2.time,
	y: storage2.NB,
	line: {color: '#8F7F7F'},
    }
    
    var trace6 = {
	type: "scatter",
	mode: "circle",
	name: 'NC exact',
	x: storage2.time,
	y: storage2.NC,
	line: {color: '#EE8A00'},
    }

    return [trace1,trace2,trace3,trace4,trace5,trace6]
}

var layout = {
    title: 'KMC test',
    xaxis: {
	title: 'time',
	titlefont: {
	    family: 'Courier New, monospace',
	    size: 18,
	    color: '#7f7f7f'
	}
    },
    yaxis: {
	title: 'concentration',
	range: [Math.min.apply(Math, [NA,NB,NC]),
		Math.max.apply(Math, [NA,NB,NC])*1.1],
	titlefont: {
	    family: 'Courier New, monospace',
	    size: 18,
	    color: '#7f7f7f'
	}
    }
};

// define the run button  functionality
$('#run').click(async function(){    
    console.log("You just clicked run/pause!");
    var cnt = 0;
    var max = 10000;
    var exact_start_time;
    if (first_run) {
	first_run = false;
    }
    else {
	paused_log = !(paused_log);
    }
    if (paused_log) {
	$("#run").text('Run');	
    }
    else {
	$("#run").text('Pause');
    }
	
    while (!(paused_log)) {
	//console.log("New cycle!");
	cnt = cnt + 1;
	tmax = 0.01;
	smax = 1000;
	exact_start_time = kmc_Storage.time[0]
	kmc_Storage.clear();
	exact_Storage.clear();
	result = simulate(kmc_Solution,rate_consts,cnt*tmax,smax,kmc_Storage)
	kmc_Solution = result.solution;
	kmc_Storage = result.storage;
	//console.log(kmc_Storage);
	exact_result = exactSolution(exact_Solution,rate_consts,exact_Storage,
				     kmc_Storage.time[kmc_Storage.time.length-1],
				     smax*0.95,exact_start_time)
	
	//console.log(exact_Storage);
	exact_Solution = exact_result.Solution;
	exact_Storage = exact_result.Storage;
	var new_data = unpack_data(kmc_Storage, exact_Storage);
	//console.log(new_data);
	//console.log("Next evolution completed!");
	Plotly.extendTraces('myDiv', new_data, [0, 1, 2, 3 ,4, 5], max);
	//Plotly.redraw('myDiv');
	await sleep(1);
    }
});

// define the restart button functionality
$('#restart').click(function(){    
    console.log("You just clicked restart!");
    kmc_Solution = new Solution(NA,NB,NC,time);
    kmc_Storage = new Storage(kmc_Solution);
    exact_Solution = new Solution(NA,NB,NC,time);
    exact_Storage = new Storage(exact_Solution);
    var initial_data = get_traces(kmc_Storage, exact_Storage);
    Plotly.newPlot('myDiv', initial_data, layout);
    console.log("Restart completed!")
    paused_log = true;
    $("#run").text('Run');	
});

// intialise the plot
Plotly.newPlot('myDiv', get_traces(kmc_Storage, exact_Storage), layout);

    
