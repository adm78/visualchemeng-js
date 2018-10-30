// VCE Project - heat_exchanger_graphics.js
//
// Shell & Tube Heat Exchanger Graphics Engine.
//
//
// Requires:
// - p5.js or p5.min.js
// - vce_utils.js
//
// Andrew D. McGuire 2018
// a.mcguire227@gmail.com
//
// To do:
// - everything
// --------------------------------------------------
function HeatExchangerGraphics(canvas, exchanger, images, debug) {

    this.canvas = canvas;
    this.xmax = canvas.width;
    this.ymax = canvas.height;
    this.images = images;
    this.canvas_sf = 0.85;
    this.sid = null;
    this.exchanger = exchanger;
    this.debug = debug;
    this.show_boundaries_log = false;

    
    // Methods
    this.show = function() {
	this._show_background();
    };

    this._show_background = function() {
	push();
	background(51);
	textAlign(CENTER);
	fill(255);
	noStroke();
	textSize(24);
	text('[insert heat exchanger graphics here]', this.xmax/2, this.ymax/2);
	pop();
    };

    this.update = function() {};

}
