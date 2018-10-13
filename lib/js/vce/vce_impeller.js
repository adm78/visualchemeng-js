// VCE Project - Impeller class
//
// A simple class to represent a simulate a moving impeller.
// The API is likely to change in the future...
//
// Requires:
// vce_utils.js
//
// Andrew D. McGuire 2018
// a.mcguire227@gmail.com
//----------------------------------------------------------

function Impeller(img_array,height,ymax,loc,speed=1.0,stage=0) {
      
    // Impeller attributes
    this.images = img_array; // An array of image objects (it is
			     // assumed each is to be displayed with
			     // the same height but width can vary)
    this.stage = stage;      // Intial impeller image
    this.height = height;    // Impeller height (total)
    this.x = loc[0];         // Canvas x loaction (image centre)
    this.y = loc[1];         // Canvas y location (image centre)
    this.ymax = ymax;        // The canvas height
    this.speed = speed;      // Speed as updates per frame (max = 1, min = 0)
    
    // Private attributes
    this._calls = 0; // number of rotate calls since last stage update
    this._ispeed = Math.round(1.0/speed); // frames per update
    this._widths = _init_image_widths(this);

    // Impeller methods
    this.rotate = function() {
	// Simulate impeller rotation by updating the stage based on
	// the impeller speed.
	
	this._calls = this._calls + 1;
	if (this._calls % this._ispeed == 0.0) {
	    if (this.stage < this.images.length - 1) {
		this.stage = this.stage + 1;
	    }
	    else {
		this.stage = 0;
	    };
	    this._calls = 0;
	};	
    };
    
    
    this.updateSpeed = function(new_speed) {
	// Change the impeller speed.
	this.speed = Math.min.apply(Math, [new_speed, 1.0]);
	this._ispeed = Math.round(1.0/this.speed);
    };

    this.show = function() {
	// Render the impeller to the canvas.
	imageMode(CENTER);
	image(this.images[this.stage], this.x, this.y, this._widths[this.stage], this.height);
    };

    
    function _init_image_widths(obj) {
	// precompute the width of each image to be drawn
	widths = [];
	for (var i=0; i < obj.images.length; i++) {
	    var isf = obj.height/obj.images[i].height;
	    widths.push(utils.getImgScaledDimensions(obj.images[i], isf, obj.ymax).width);
	};
	return widths
    };
};
