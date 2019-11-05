// VCE Project - Molecular Dynamics Frontend
//
// This script serves as frontend for the EDMD application.
//
// Requires:
// - p5.js or p5.min.js
// - TBC
//
// TODO: Fix paricle initialisation (too few particle being created, single row)
// TODO: Fix restart functionality
//
// Andre D. McGuire 2019
// a.mcguire227@gmail.com
//----------------------------------------------------------
var canvas;
var simulation;
var graphics;
var paused_log = true;

function setup() {

    canvas = new vceCanvas(id="#sim_container");
    simulation = new EDMDSimulation(canvas=canvas);
    graphics = new EDMDGraphics(simulation, canvas);
    
}

function draw() {
    // Step through time unless sim is paused,
    // reporting status in progress box.
    if (!(paused_log)) {
	graphics.update();
    }
    graphics.show();
}



//--------------------------------------------------------------------
//                  Visualisation functionality
//--------------------------------------------------------------------

function mouse_in_sim_box() {
    if (0 < mouseX && mouseX < canvas.xmax && 0 < mouseY && mouseY < canvas.ymax) {
	return true;
    };
    return false;
}

function mousePressed() {

    // Act on left mouse press
    if (mouse_in_sim_box()) {
	simulation.add_random_particle(mouseX, mouseY);
	return false;
    };
}

function touchStarted() {
    mousePressed();
    // stop the reclicking without diabling jquery button clicks
    if (mouse_in_sim_box()) {
	return false;
    };
}


//--------------------------------------------------------------------
//                  UI event listners
//--------------------------------------------------------------------
// run button
$('#run').click(async function(){

    // run/pause button functionality
    console.log("You just clicked stream/pause!");
    paused_log = !(paused_log);
    if (paused_log) {
	$("#run").text('Run');
    }
    else {
	$("#run").text('Pause');
    }
});

// restart button
$('#restart').click(async function(){

    // restart button functionality
    console.log("You just clicked restart!");
    simulation = new EDMDSimulation(canvas);
    if (paused_log) {
	$("#run").text('Run');
    }
    else {
	$("#run").text('Pause');
    }
})

// full screen button
const target = $('#target')[0]; // Get DOM element from jQuery collection
$('#fullscreen').on('click', () => {
    console.log("fullscreen requested");
    if (screenfull.enabled) {
	screenfull.request(target);
    }
});
