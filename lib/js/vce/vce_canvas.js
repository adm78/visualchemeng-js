// VCE Project - vce_canvas.js
//
// An OO-friendly wrapper around the p5 canvas.
//
// Requires:
// - p5.js or minified equivalent
// - p5.dom.js or minified equivalent
// - vce_utils.js
//
// Andrew D. McGuire 2019
// amcguire227@gmail.com
//----------------------------------------------------------
function VceCanvas(id='#sim_container', xmax=null, ymax=null, debug=false) {
    
    // Class public attributes
    this.debug = debug;
    this.width = null;
    this.height = null;
    this.id = null;
    
    // Class private attributes
    var dimensions = utils.getSimBoxDimensions();
    this._orig_xmax = xmax == null ? dimensions.xmax : xmax;
    this._orig_ymax = ymax == null ? dimensions.ymax : ymax;
    this._div_id = id;
    this._canvas = createCanvas(this._orig_xmax, this._orig_ymax);
    this._canvas.parent(this._div_id);
    

    // Class methods
    this.reset = function() {
	// reset the canvas to its original size
	if (this.debug) {
	    console.log("resetting canvas...");
	};
	this._canvas = createCanvas(this._orig_xmax, this._orig_ymax);
	this._canvas.parent(this._div_id);
    };

    this.stretch = function() {
	// stretch the canvas to fit the screen
	if (this.debug) {
	    console.log("stretching canvas...");
	};
	var dimensions = utils.getSimBoxDimensions(this._div_id);
	this._canvas = createCanvas(dimensions.xmax, dimensions.ymax);
	this._canvas.parent(this._div_id);
    };


    this.hide = function() {
	select('#' + this.id).hide();
    };

    this.show = function() {
	select('#' + this.id).show();
    };
};

// Provide direct access to p5 canvas attributes.  Note these allow
// call such a my_vce_canvas.width without the need for parenthesis.
// Imitates python @property functionality, based on
// https://coderwall.com/p/5noeyg/python-style-property-methods-in-javascript
VceCanvas.prototype = {
    
    get width() { return this._canvas.width; },
    get height() { return this._canvas.height; },
    get id() { return this._canvas.canvas.id; }
    
};

