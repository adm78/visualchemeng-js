// VCE Project - boundary_builder.js
//
// This tool can be used to place vce_boundary.Boundary objects and
// particle feeds using the mouse and keys (as opposed to adjusting
// the coordinates through trial and error). Images can be imported
// and displayed on the canvas to aid placement of the boundaries.
//
// Note: This is a work in progress.
//
// Requires:
// - p5.js or p5.min.js
// - matter.js
// - vce_utils.js
// - vce_math.js
// - vce_particle.js
// - vce_ensemble.js
// - vce_boundary.js
// - setting.js (temporarily for boundary positional info)
//
// Andrew D. McGuire 2018
// a.mcguire227@gmail.com
//
// To do:
// - testing
// - allow user to place particle feed(s)
//
// --------------------------------------------------
//               set-up variables
// --------------------------------------------------
var debug = false;
var particles_log = false;
var ensemble;
var boundaries = [];
var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Vector = Matter.Vector;
var sid;
var show_boundaries = true;
var my_image;
var y_max;
var source_blocks = [];

// --------------------------------------------------
//             Visualisation functionality
// --------------------------------------------------
function preload() {
    // load the default image
    var my_image_url = "../../../../lib/images/reactor_ni.svg";
    my_image = loadImage(my_image_url, pic => print(pic), utils.loadImgErrFix);
    $('#filename_input').val(my_image_url);
};

function setup(new_canvas) {

    /* This function is called upon entry to create the
       simulation canvas which we draw onto  */

    // set-up the canvas
    var dimensions = utils.getSimBoxDimensions();
    xmax = dimensions.xmax;
    ymax = dimensions.ymax;
    var canvas= createCanvas(xmax, ymax);
    canvas.parent("sim_container");
    sid = utils.getImgScaledDimensions(my_image, 0.6, ymax);
    console.log("ymax = ", ymax);
    console.log("sid = ", sid);
    
    // set-up the physics engine
    engine = Engine.create();
    world = engine.world;

    // initialise the ensemble
    ensemble = new Ensemble([],world);

    // intialise the boundaries
    boundaries = makeBoundaries(settings.boundary_positions, xmax, ymax,
				sid.width, sid.height, world);
    for (var i = 0; i < boundaries.length; i++) {
	boundaries[i].name = "B" + i;
    };
    
};

function draw() {

    /* Draws background and img to the canvas.
       This function is continuously called for the
       lifetime of the scripts executions after setup()
       has completed. Effectively advances time. */

    sid = utils.getImgScaledDimensions(my_image, 0.6, ymax);
    background(51);
    imageMode(CENTER);
    image(my_image, xmax/2 , ymax/2, sid.width, sid.height);
    if (particles_log) {
	ensemble.updateSources();
    };
    Engine.update(engine);
    ensemble.removeOutliers(xmax,ymax);
    ensemble.show();
    if (show_boundaries) {
	    for (var i = 0; i < boundaries.length; i++) {
		boundaries[i].show();
	    };
    };
    for (var i = 0; i < source_blocks.length; i++) {
	source_blocks[i].show();
    };
};


function deactivateAll() {
    deactiveAllBoundaries();
    deactivateAllSourceBlocks();
};


function deactiveAllBoundaries() {
    for (var i = 0; i < boundaries.length; i++) {
	boundaries[i].active = false;
    };
};


function deactivateAllSourceBlocks() {
    for (var i = 0; i < source_blocks.length; i++) {
	source_blocks[i].active = false;
    };
};


function mouseClicked() {
    if (utils.is_on_canvas(mouseX, mouseY, canvas)) {
	deactivateAll();
	for (var i = 0; i < source_blocks.length; i++) {
	    source_blocks[i].mousePressed(mouseX, mouseY);
	    if (source_blocks[i].active) {
		return; // only allow a single active feed block
	    };
	};
	
	for (var i = 0; i < boundaries.length; i++) {
	    boundaries[i].mousePressed(mouseX, mouseY);
	    if (boundaries[i].active) {
		return; // only allow a single active boundary
	    };
	};
    };
};

function mouseDragged() {
    if (utils.is_on_canvas(mouseX, mouseY, canvas)) {
	for (var i = 0; i < source_blocks.length; i++) {
	    source_blocks[i].mouseDragged(mouseX, mouseY);
	    ensemble.sources[i].x = source_blocks[i].body.position.x;
	    ensemble.sources[i].y = source_blocks[i].body.position.y;
	};

	
	for (var i = 0; i < boundaries.length; i++) {
	    boundaries[i].mouseDragged(mouseX, mouseY);
	};
    };
};


function keyPressed() {
    if (keyCode == 46) {
	// special treatment for delete key
	$('#rm_boundary').click();
	$('#rm_feed').click();
    }
    else {
	for (var i = 0; i < boundaries.length; i++) {
	    boundaries[i].keyPressed();
	};
    };
};


// feed on button
$('#feed_on').click(async function(){

    // feed on/off button functionality
    console.log("You just clicked the particle switch!");
    particles_log = !(particles_log);
    if (particles_log) {
	$("#feed_on").text('Particles Source Off');
    }
    else {
	$("#feed_on").text('Particles Source On');
    }
});


// add a particle feed
$('#add_feed').click(async function(){
    console.log("New particle feed requested");
    var dimensions = utils.getSimBoxDimensions();
    var feed_block = new Boundary(Math.random()*dimensions.xmax, Math.random()*dimensions.ymax, 20.0, 20.0, 0.0, undefined);
    feed_block.colour.active = 'rgba(0, 255, 0, 0.5)';
    feed_block.colour.inactive = 'rgba(0, 0, 255, 0.5)';
    feed_block.name = 'F' + source_blocks.length;
    var particle_options = {type :'single-body', radius : 2.0}
    var feed = new ParticleSource(feed_block.body.position.x, feed_block.body.position.y, 0.1, particle_options);
    console.log(feed);
    source_blocks.push(feed_block);
    ensemble.sources.push(feed);
    console.log(ensemble);
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
    var dimensions = utils.getSimBoxDimensions();
    var newBoundary = new Boundary(Math.random()*dimensions.xmax,
				   Math.random()*dimensions.ymax,
				   20, 0.3*dimensions.ymax, 0.0, world);
    newBoundary.name = 'B' + boundaries.length;
    newBoundary.active = true;
    boundaries.push(newBoundary);
    for (var i = 0; i < boundaries.length; i++) {
	console.log(boundaries[i]);
    };
});


// copyboundary button
$('#cp_boundary').click(async function(){

    console.log("You just requested active bounds to be copied!");
    var dimensions = utils.getSimBoxDimensions();
    for (var i = 0; i < boundaries.length; i++) {
	if (boundaries[i].active) {
	    // generate some random numbers to displace the copy
	    var coordinates = boundaries[i].get_coordinates();
	    var x = 2.0*dimensions.x;
	    while (!utils.is_on_canvas(x, coordinates.y)) {
		var rnd_1 = vce_math.getRandomSigned();
		var rnd_2 = -1;
		if (rnd_1 > 0) {rnd_2 = 1};
		x = coordinates.x + 50*rnd_2 + 200*rnd_1;
	    };
	    y = 2.0*dimensions.y;
	    while (!utils.is_on_canvas(x, y)) {
		var rnd_1 = vce_math.getRandomSigned();
		var rnd_2 = -1;
		if (rnd_1 > 0) {rnd_2 = 1};
		y = coordinates.y + 50*rnd_2 + 200*rnd_1;
	    };
	    var newBoundary = new Boundary(x, y, coordinates.w, coordinates.h,
					   coordinates.angle, world);
	    newBoundary.name = "B" + boundaries.length;
	    boundaries.push(newBoundary);
	};
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


// remove all boundaries
$('#rm_all_boundary').click(async function(){
    console.log("Deleting all boundaries!");
    for (var i = 0; i < boundaries.length; i++) {
	boundaries[i].removeFromWorld();
    };
    boundaries = [];
});


// remove active boundary/boundaries
$('#rm_feed').click(async function(){

    console.log("Deleting active feeds!");
    var updated_source_blocks = [];
    var updated_sources = [];
    for (var i = 0; i < source_blocks.length; i++) {
	var source_block = source_blocks[i];
	var source = ensemble.sources[i];
	if (source_block.active) {
	    source_block.removeFromWorld();
	}
	else {
	    updated_source_blocks.push(source_block);
	    updated_sources.push(source);
	};
    };
    source_blocks = updated_source_blocks;
    ensemble.sources = updated_sources;
	
});


// remove all feeds
$('#rm_all_feed').click(async function(){
    console.log("Deleting all feeds!");
    for (var i = 0; i < source_blocks.length; i++) {
	source_blocks[i].removeFromWorld();
    };
    source_blocks = [];
    ensemble.sources = [];
});


// output boundary coordinates and scaling factors
$('#output_coords').click(async function(){
    console.log("Coordinates requested");
    var dimensions = utils.getSimBoxDimensions();
    var all_b_coordindates = [];
    var all_b_scaling = [];
    for (var i = 0; i < boundaries.length; i++) {
	all_b_coordindates.push(boundaries[i].get_coordinates());
	all_b_scaling.push(boundaries[i].get_positional_scale_factors(dimensions.xmax, dimensions.ymax,
								    sid.width, sid.height));
    };
    $('#b_coords').text(JSON.stringify(all_b_coordindates));
    $('#b_scaling').text(JSON.stringify(all_b_scaling));

    var all_f_coordindates = [];
    var all_f_scaling = [];
    for (var i = 0; i < source_blocks.length; i++) {
	all_f_coordindates.push(source_blocks[i].get_coordinates());
	all_f_scaling.push(source_blocks[i].get_positional_scale_factors(dimensions.xmax, dimensions.ymax,
								       sid.width, sid.height));
    };
    $('#f_coords').text(JSON.stringify(all_f_coordindates));
    $('#f_scaling').text(JSON.stringify(all_f_scaling));
    
});


// load image functionality
$('#load_image').click(async function(){
    console.log("You just requested for an image to be loaded!");
    var my_image_url = $('#filename_input').val();
    my_image = loadImage(my_image_url, pic => print(pic), utils.loadImgErrFix);
    $('#rm_all_boundary').click();
});


// prevent arrow key scrolling
window.addEventListener("keydown", function(e) {
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
	e.preventDefault();
    }
}, false);


// load settings.js file and associated boundaries
var load_boundaries_from_settings = function () {
    $('#rm_all_boundary').click();
    console.log("loaded settings = ", settings);
    var dimensions = utils.getSimBoxDimensions();
    for (var i = 0; i < settings.boundary_positions.length; i++) {
	var scaling = settings.boundary_positions[i];
	var abs_coords =  get_absolute_coordinates(dimensions.xmax, dimensions.ymax,
						   sid.width, sid.height, scaling)
	console.log("abs_coords = ", abs_coords);
	var newBoundary = new Boundary(abs_coords.x, abs_coords.y,
				       abs_coords.w, abs_coords.h,
				       abs_coords.a, world);
	newBoundary.name = "B" + boundaries.length;
	boundaries.push(newBoundary); 
    };
};
$('#load_script').click(async function(){
    console.log("You just requested for a scipt to be loaded!");
    var my_script_url = $('#script_input').val();
    utils.loadScript(my_script_url, load_boundaries_from_settings);
});
