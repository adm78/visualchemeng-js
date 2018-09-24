// VCE Project - Value class
//
// A graphical, interactive valve class.
//
// Requires:
// - vce_utils.js
// - p5.js or p5.min.js
//
// Andrew D. McGuire 2018
// a.mcguire227@gmail.com
//----------------------------------------------------------

function Valve(x, y, options) {

    // Valve attributes (image urls need to hard coded after
    // development)
    this.x = x;
    this.y = y;
    this.images = {};

    this.default_options = {
	scaling : 0.15,
	position : 0.5,
	name : ''}
    options = utils.merge_options(this.default_options, options)
    this.scaling = options.scaling;
    this.position = options.position;
    this.name = options.name;
    this.active = false;

    
    // Valve public methods
    this.set_position = function(new_pos) {
	if (new_pos => 0.0 && new_pos <= 1.0) {
	    this.position = new_pos;
	}
	else {
	    throw new RangeError("Valve position must be a number between 0 and 1. Requested: ", new_pos);
	};
    };


    this.is_on_handle = function(x, y) {
	var psuedo_body = {
	    position : this._handle_pos(),
	    angle : this._handle_angle()
	};
	var rotated_point = utils.rotate_point_with_body(psuedo_body, { x : x, y : y});
	var w = this.images.handle.width*this.scaling;
	var h = this.images.handle.height*this.scaling;
	if (rotated_point.x > psuedo_body.position.x - 0.5*w && rotated_point.x < psuedo_body.position.x + 0.5*w) {
	    if (rotated_point.y > psuedo_body.position.y - 0.5*h && rotated_point.y < psuedo_body.position.y + 0.5*h) {
 		return true;
	    };
	};
	return false
    };


    this.click = function() {
	this.active = true;
    };

    
    this.unclick = function() {
	this.active = false;
    };


    this.drag = function() {
	// see https://codepen.io/DonKarlssonSan/pen/wgWyWx
    };
    
    
    this.show = function() {
	this._show_body();
	this._show_handle();
	this._show_position();
	this._show_name();
	if (this.active) { this._highlight() };
    };


    // Valve private methods
    this._show_body = function() {
	push();
	imageMode(CENTER);
	image(this.images.body, this.x , this.y,
	      this.images.body.width*this.scaling,
	      this.images.body.height*this.scaling);
	pop();
    };


    this._show_handle = function() {
	push();
	var pos = this._handle_pos(); 
	translate(pos.x, pos.y);
	rotate(this._handle_angle());
	imageMode(CENTER);
	image(this.images.handle, 0, 0,
	      this.images.handle.width*this.scaling,
	      this.images.handle.height*this.scaling);
	pop();

    };


    this._handle_angle = function() {
	var start = -PI/4; // handle closed angle
	var range = -2*start;
	return start + this.position*range
    };
    

    this._handle_pos = function() {
	return {
	    x : this.x - 0.007*this.images.body.width*this.scaling,
	    y : this.y + 0.15*this.images.body.height*this.scaling
	};
    };


    this._show_position = function() {
	push()
	textAlign(CENTER, CENTER);
	textSize(20);
	fill(255);
	noStroke();
	var percent_open = this.position*100.0;
	var x_pos = this.x;
	var y_pos = this.y + 0.9*this.images.body.height*this.scaling;
	text(percent_open.toFixed(0) + '%', x_pos, y_pos);
	pop();
    }


    this._show_name = function() {
	push()
	textAlign(CENTER, CENTER);
	textSize(20);
	fill(255);
	noStroke();
	var x_pos = this.x;
	var y_pos = this.y - 0.9*this.images.body.height*this.scaling;
	text(this.name, x_pos, y_pos);
	pop();
    };


    this._highlight = function() {
	push();
	imageMode(CENTER);
	var pos = this._handle_pos(); 
	translate(pos.x, pos.y);
	rotate(this._handle_angle());
	image(this.images.highlight, 0, 0,
	      this.images.highlight.width*this.scaling,
	      this.images.highlight.height*this.scaling);
	pop();
    };


};
