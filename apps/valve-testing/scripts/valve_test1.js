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
var online = false;
var valve;
var xmax, ymax;
console.log("Note: Online mode = ", online)

// --------------------------------------------------
//             Visualisation functionality
// --------------------------------------------------
function preload() {};

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
    if (!online) {
	options.body_img_URL = "../../../../lib/images/valve4.svg";
	options.handle_img_URL = "../../../../lib/images/valve_handle.svg";
	options.highlight_img_URL = "../../../../lib/images/valve_handle_highlight.svg";
    }
    valve = new Valve(0.5*xmax, 0.5*ymax, options);
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


