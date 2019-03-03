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

    this.__init__ = function(x, y, options) {
	// Valve constructor
	options = utils.merge_options(this.default_options, options)
	this.x = x;
	this.y = y;
	this.images = {
	    body : loadImage(options.body_img_URL, pic => print(pic), utils.loadImgErrFix),
	    handle : loadImage(options.handle_img_URL, pic => print(pic), utils.loadImgErrFix),
	    highlight : loadImage(options.highlight_img_URL, pic => print(pic), utils.loadImgErrFix),
	};
	this.scaling = options.scaling;
	this.position = options.position;
	this.name = options.name;
	this.show_name_log = options.show_name_log;
	this.active = false;
	this.handle_rest_angle = options.handle_rest_angle;
	this.handle_range = options.handle_range;
    };

    this.default_options = {
	// Default options for valve initialisation
	scaling : 0.15,
	position : 0.5,
	name : '',
	show_name_log : true,
        handle_rest_angle : -PI/4,
	handle_range : PI/2,
	body_img_URL : 'http://visualchemeng.com/wp-content/uploads/2018/09/valve4.svg',
	handle_img_URL : 'http://visualchemeng.com/wp-content/uploads/2018/09/valve_handle.svg',
	highlight_img_URL : 'http://visualchemeng.com/wp-content/uploads/2018/09/valve_handle_highlight.svg'
    };
    
    
    // Valve public methods
    this.set_position = function(new_pos) {
	if (new_pos > 1.0) {
	    new_pos = 1.0;
	}
	else if (new_pos < 0.0) {
	    new_pos = 0.0
	};
	this.position = new_pos;
    };


    this.is_on_handle = function(x, y) {
	var psuedo_body = {
	    position : this._handle_loc(),
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


    this.drag_handle = function(mouseX, mouseY) {
	// Drag the handle so that handle lines up with the angle
	// between the valve pin and mouse.
	var h_pos = this._handle_loc();
	var dy = mouseY - h_pos.y;
	var dx = mouseX - h_pos.x;
	if (dx >= 0.0) {
	    var theta = -Math.atan(-dy/dx) + PI*0.5;
	}
	if (dx < 0.0) {
	    var theta = -Math.atan(-dy/dx) + 1.5*PI;
	}
	this._set_position_from_angle(theta);
	
    };
    
    
    this.show = function() {
	this._show_body();
	this._show_handle();
	this._show_position();
	if (this.show_name_log) { this._show_name() };
	if (this.active) { this._highlight() };
    };


    this.translate = function(dx,dy) {
	// Translate the the valve to a new location along some
	// vector.
	this.x += dx;
	this.y += dy;
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
	var pos = this._handle_loc(); 
	translate(pos.x, pos.y);
	rotate(this._handle_angle());
	imageMode(CENTER);
	image(this.images.handle, 0, 0,
	      this.images.handle.width*this.scaling,
	      this.images.handle.height*this.scaling);
	pop();

    };
    

    this._set_position_from_angle = function(angle) {
	if (angle > PI) {
	    var normed_angle = angle - 2*PI;
	}
	else {
	    var normed_angle = angle;
	};
	var new_pos = (normed_angle - this.handle_rest_angle)/this.handle_range;
	this.set_position(new_pos);
    };


    this._handle_angle = function() {
	return this.handle_rest_angle + this.position*this.handle_range;
    };
    

    this._handle_loc = function() {
	return createVector(this.x - 0.007*this.images.body.width*this.scaling,
			    this.y + 0.15*this.images.body.height*this.scaling)
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
	var pos = this._handle_loc(); 
	translate(pos.x, pos.y);
	rotate(this._handle_angle());
	image(this.images.highlight, 0, 0,
	      this.images.highlight.width*this.scaling,
	      this.images.highlight.height*this.scaling);
	pop();
    };

    // Auto-initialisation
    this.__init__(x, y, options);
};
