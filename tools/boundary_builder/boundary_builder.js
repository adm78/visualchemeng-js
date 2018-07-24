// VCE Project - boundary_builder.js
//
// This tool can be used to place vce_boundary.Boundary objects using
// the mouse and keys (as opposed to adjusting the coordinates through
// trial and error). Images can be imported and displayed on the
// canvas to aid placement of the boundaries.
//
// Note: This is a work in progress.
//
// Requires:
// - p5.js or p5.min.js
// - matter.js
// - vce_utils.js
// - vce_particle.js
// - vce_ensemble.js
// - vce_boundary.js
//
// Andrew D. McGuire 2018
// a.mcguire227@gmail.com
//
// To do:
// - download jquery and jquery-ui and add to lib/third-party for
//   offline development
// --------------------------------------------------
//               set-up variables
// --------------------------------------------------
var debug = false;
var paused_log = false;
var ensemble;
var boundaries = [];
var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Vector = Matter.Vector;
var sid;
var show_boundaries = true;

// --------------------------------------------------
//             Visualisation functionality
// --------------------------------------------------
function preload() {
    var tank_URL = "../../resources/reactor_ni.svg";
    tank = loadImage(tank_URL, pic => print(pic), loadImgErrFix);
};

function setup() {

    /* This function is called upon entry to create the
       simulation canvas which we draw onto  */

    // set-up the canvas
    var dimensions = getSimBoxDimensions();
    xmax = dimensions.xmax;
    ymax = dimensions.ymax;
    var canvas= createCanvas(xmax, ymax);
    canvas.parent("sim_container");
    sid = getImgScaledDimensions(tank, 0.6, ymax);
    
    // set-up the physics engine
    engine = Engine.create();
    world = engine.world;

    // initialise the ensemble
    ensemble = new Ensemble([],world);
    
    boundaries.push(new Boundary((xmax-sid.width)/2,
				 (ymax)/2,
				 20, sid.height*0.7, 0.0, world));
    boundaries.push(new Boundary((xmax+sid.width)/2,
				 (ymax)/2,
				 20, sid.height*0.7, 0.0, world));
    boundaries.push(new Boundary((xmax)/2,
				 (ymax+1.0*sid.height)/2,
				 sid.width, 20, 0.0, world));
    boundaries.push(new Boundary((xmax-sid.width*0.7)/2,
				 (ymax+0.9*sid.height)/2,
				 0.5*sid.width, 20, 0.7, world));
    boundaries.push(new Boundary((xmax+sid.width*0.7)/2,
				 (ymax+0.9*sid.height)/2,
				 0.5*sid.width, 20, 2*PI-0.7, world));

    
};

function draw() {

    /* Draws background and img to the canvas.
       This function is continuously called for the
       lifetime of the scripts executions after setup()
       has completed. Effectively advances time. */
    
    background(51);
    imageMode(CENTER);
    image(tank, xmax/2 , ymax/2, sid.width, sid.height);
    if (!paused_log) {
	if (Math.random() < 0.1) {
	    ensemble.addParticle(new PhysEngineParticle(world, xmax/2, 0.1*ymax, {radius: random(5, 10)}));
	};
	Engine.update(engine);
	ensemble.removeOutliers(xmax,ymax);
    };
    ensemble.show();
    if (show_boundaries) {
	    for (var i = 0; i < boundaries.length; i++) {
		boundaries[i].show();
	    };
    };
};

function deactiveAllBoundaries() {
    for (var i = 0; i < boundaries.length; i++) {
	boundaries[i].active = false;
    };
};


function mouseClicked() {
    if (is_on_canvas(mouseX, mouseY, canvas)) {
	for (var i = 0; i < boundaries.length; i++) {
	    boundaries[i].mousePressed(mouseX, mouseY);
	};
    };
};

function mouseDragged() {
    if (is_on_canvas(mouseX, mouseY, canvas)) {
	for (var i = 0; i < boundaries.length; i++) {
	    boundaries[i].mouseDragged(mouseX, mouseY);
	};
    };
};


function keyPressed() {
    for (var i = 0; i < boundaries.length; i++) {
	boundaries[i].keyPressed();
    };
};


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


// show boundaries button
$('#restart').click(async function(){

    // boundary show hide
    console.log("You just clicked show boundaries!");
    show_boundaries = !(show_boundaries);
    if (!show_boundaries) {
	$("#restart").text('Show Bounds');
    }
    else {
	$("#restart").text('Hide Bounds');
    }
});


// add boundary button
$('#add_boundary').click(async function(){

    console.log("You just added a new boundary!");
    deactiveAllBoundaries();
    var dimensions = getSimBoxDimensions();
    var newBoundary = new Boundary(Math.random()*dimensions.xmax,
				   Math.random()*dimensions.ymax,
				   20, 0.3*dimensions.ymax, 0.0, world);
    newBoundary.active = true;
    boundaries.push(newBoundary);
    for (var i = 0; i < boundaries.length; i++) {
	console.log(boundaries[i]);
    };
});


// remove active boundary/boundaries
$('#rm_boundary').click(async function(){

    console.log("Deleting active boundaries!");
    var updated_boundaries = [];
    for (var i = 0; i < boundaries.length; i++) {
	var boundary = boundaries[i];
	if (boundary.active) {
	    boundary.removeFromWorld();
	}
	else {
	    updated_boundaries.push(boundary);
	};
    };
    boundaries = updated_boundaries;
	
});


// output boundary coordinates and scaling factors
$('#output_coords').click(async function(){
    console.log("Boundary coordinates requested");
    var dimensions = getSimBoxDimensions();
    var all_coordinates = [];
    var all_scaling = [];
    for (var i = 0; i < boundaries.length; i++) {
	all_coordinates.push(boundaries[i].get_coordinates());
	all_scaling.push(boundaries[i].get_positional_scale_factors(dimensions.xmax, dimensions.ymax,
								    sid.width, sid.height));
    };
    console.log(all_coordinates);
    console.log(all_scaling);
    $('#coords').text(JSON.stringify(all_coordinates));
    $('#scaling').text(JSON.stringify(all_scaling));
});
