// VCE Project - Molecular Dynamics Frontend
//
// This script serves as frontend for the EDMD application.
//
// Requires:
// - p5.js or p5.min.js
// - TBC
//
// TODO: Resize canvas on fullscreen (may need to fix max particle numbed for performance reasons)
// TODo: Resize plots on fullscreen
// TODO: Add collision kernel,
// pressure + any other userful stats we can think off
// TODO: create a settings.js and more all special vars in there
// 
//
// Andrew D. McGuire 2019
// a.mcguire227@gmail.com
//----------------------------------------------------------
var canvas;
var simulation;
var graphics;
var paused_log = true;
var draw_count; 
var ke_plot;
var coll_rate_plot;
var kernel_plot;

function setup() {

    canvas = new vceCanvas(id=settings.frontend.sim_container_id);
    draw_count = new utils.Counter();
    simulation = new EDMDSimulation(canvas, settings.backend);
    graphics = new EDMDGraphics(simulation, canvas);
    ke_plot = new KineticEnergyPlot(settings.frontend.ke_plot_container);
    coll_rate_plot = new CollisionRatePlot(settings.frontend.coll_rate_plot_container);
    kernel_plot = new CollisionKernelPlot(settings.frontend.kernel_plot_container);
}

function draw() {
    // Step through time unless sim is paused, reporting status in
    // progress box.
    if (!(paused_log)) {
	graphics.update();
	if (draw_count.value % settings.frontend.plot_update_interval == 0) {
	    ke_plot.update(simulation);
	    coll_rate_plot.update(simulation);
	}
	if (draw_count.value % settings.frontend.kernel_update_interval == 0) {
	    kernel_plot.update(simulation);
	};
    };
    graphics.show();
    draw_count.increment();
}


//--------------------------------------------------------------------
//                  Visualisation functionality
//--------------------------------------------------------------------
function mouse_in_sim_box() {
    if (0 < mouseX && mouseX < canvas.width && 0 < mouseY && mouseY < canvas.height) {
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
//                  Plotting functionality
//--------------------------------------------------------------------


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
    setup();
    paused_log = true;
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
	screenfull.toggle(target);
    }
});
