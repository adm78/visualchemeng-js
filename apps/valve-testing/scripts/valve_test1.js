// VCE Project - valve_test1.js
//
// A test of the vce_valve.Valve class that can be used for
// development.
//
// Requires:
// - p5.js or p5.min.js
// - vce_valve.js
//
// Andrew D. McGuire 2018
// a.mcguire227@gmail.com
//
// --------------------------------------------------
//               set-up variables
// --------------------------------------------------
var debug = false;
var paused_log = false;
var valve;
var xmax, ymax;
var valve_img;


// --------------------------------------------------
//             Visualisation functionality
// --------------------------------------------------
function preload() {
    var valve_img_URL = "../../../../lib/images/valve4.svg";
    var handle_img_URL = "../../../../lib/images/valve_handle.svg";
    var highlight_img_URL = "../../../../lib/images/valve_handle_highlight.svg";
    valve_img = loadImage(valve_img_URL, pic => print(pic), utils.loadImgErrFix);
    handle_img = loadImage(handle_img_URL, pic => print(pic), utils.loadImgErrFix);
    highlight_img = loadImage(highlight_img_URL, pic => print(pic), utils.loadImgErrFix);
};

function setup() {

    /* This function is called upon entry to create the
       simulation canvas which we draw onto  */

    // set-up the canvas
    //var dimensions = getSimBoxDimensions();
    xmax = 400;//dimensions.xmax;
    ymax = 400;//dimensions.ymax;
    var canvas= createCanvas(xmax, ymax);
    canvas.parent("sim_container");
    var options = {
	name : 'Reflux',
	scaling : 0.6
    };
    valve = new Valve(0.5*xmax, 0.5*ymax, options);
    valve.images.body = valve_img;
    valve.images.handle = handle_img;
    valve.images.highlight = highlight_img;
    valve.set_position(0.2);
    
};

function draw() {

    /* Draws background and img to the canvas.
       This function is continuously called for the
       lifetime of the scripts executions after setup()
       has completed. Effectively advances time. */
    
    background(51);
    valve.show();

};


function mouseDragged() {
  if (isDragging) {
      valve.drag_handle(mouseX, mouseY); 
  };
}



function mouseClicked() {
    if (valve.is_on_handle(mouseX, mouseY)) { valve.click(); }
    else {valve.unclick();};
};


function mousePressed() {
    var m = createVector(mouseX, mouseY);
    if (valve.is_on_handle(mouseX, mouseY)) {
	isDragging = true;
	valve.click();
    };
}


function mouseReleased() {
    isDragging = false;
    valve.unclick();
}

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
    console.log("You just clicked restart!");
});


