// VCE Project - rotating_impeller.js
//
// This script is used to test the animation of a rotating impeller
// within a vessel.
//
// Requires:
// - p5.js or p5.min.js
// - vce_utils.js
//
//
// Andrew D. McGuire 2018
// a.mcguire227@gmail.com
//----------------------------------------------------------
// --------------------------------------------------
//               set-up variables
// --------------------------------------------------
var debug = false;
var paused_log = false;
var xmax;
var ymax;
var img_shrink_factor = 0.9;
var sid;
var tank;
var imp_array;
var impeller;
var frame = 0;

// --------------------------------------------------
//             p5 visualisation functionality
// --------------------------------------------------
function preload() {
    var tank_URL = "../resources/reactor_ni.svg";
    var imp1_URL = "../resources/imp_0deg.svg";
    var imp2_URL = "../resources/imp_45deg.svg";
    var imp3_URL = "../resources/imp_90deg.svg";
    var imp4_URL = "../resources/imp_135deg.svg";
    tank = loadImage(tank_URL, pic => print(pic), loadImgErrFix);
    var imp1 = loadImage(imp1_URL, pic => print(pic), loadImgErrFix);
    var imp2 = loadImage(imp2_URL, pic => print(pic), loadImgErrFix);
    var imp3 = loadImage(imp3_URL, pic => print(pic), loadImgErrFix);
    var imp4 = loadImage(imp4_URL, pic => print(pic), loadImgErrFix);
    imp_array = [imp1, imp2, imp3, imp4];
};

function setup() {

    /* This function is called upon entry to create the
       simulation canvas which we draw onto  */

    var dimensions = getSimBoxDimensions();
    xmax = dimensions.xmax;
    ymax = dimensions.ymax;
    var canvas= createCanvas(xmax, ymax);
    canvas.parent("sim_container");
    sid = getImgScaledDimensions(tank, img_shrink_factor);
    var imp_height = sid.height*0.6297;
    impeller = new Impeller(imp_array, imp_height, [xmax/2.0,ymax/2.0])
}

function draw() {

    /* Draws background and img to the canvas.
       This function is continuously called for the
       lifetime of the scripts executions after setup()
       has completed. Effectively advances time. */

    frames = frames + 1;
    background(51);
    imageMode(CENTER);
    image(tank, xmax/2 , ymax/2, sid.width, sid.height);
    impeller.show();
    frame = frame + 1;
    if (!paused_log && (frame % 5 === 0)) {
	impeller.rotate();
    };
};


function Impeller(img_array,height,loc) {
    // A test impeller class
    this.images = img_array;
    this.stage = 1;
    this.height = height;
    this.x = loc[0];
    this.y = loc[1];
    
    
    this.rotate = function() {
	// rotate the impeller
	if (this.stage < this.images.length - 1) {
	    this.stage = this.stage + 1;
	}
	else {
	    this.stage = 0;
	};
	    
    };

    this.show = function() {
	var isf = this.height/this.images[this.stage].height;
	var width = getImgScaledDimensions(this.images[this.stage], isf).width;
	imageMode(CENTER);
	image(this.images[this.stage], this.x, this.y, width, this.height);
    };
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
