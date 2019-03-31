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
	
	// Valve class attributes
	options = utils.merge_options(this.default_options, options)
	this.x = x;
	this.y = y;
	this.images = {
	    body : loadImage(options.body_img_URL, pic => print(pic), utils.loadImgErrFix),
	    handle : loadImage(options.handle_img_URL, pic => print(pic), utils.loadImgErrFix),
	    highlight : loadImage(options.highlight_img_URL, pic => print(pic), utils.loadImgErrFix),
	};
	this.name = options.name;
	this.show_name_log = options.show_name_log;
	this.active = false;
	this._scaling = null;
	this._position = null;
	this._flow_capacity = null;
	this._handle_rest_angle = options.handle_rest_angle;
	this._handle_range = options.handle_range;
	this._body_angle = options.body_angle;
	this._supported_types = ['linear', 'equal_percentage'];
	this._type = null;

	// Initialise state variables
	this._init_type(options.type)
	this.set_scaling(options.scaling);
	this.set_position(options.position, strict=true);
	
    };

    this.default_options = {
	// Default options for valve initialisation
	type : 'linear',
	scaling : 0.15,
	position : 0.5,
	name : '',
	show_name_log : true,
        handle_rest_angle : -PI/4,
	handle_range : PI/2,
	body_angle : 0.0,
	body_img_URL : 'http://visualchemeng.com/wp-content/uploads/2018/09/valve4.svg',
	handle_img_URL : 'http://visualchemeng.com/wp-content/uploads/2018/09/valve_handle.svg',
	highlight_img_URL : 'http://visualchemeng.com/wp-content/uploads/2018/09/valve_handle_highlight.svg'
    };


    this.position = function() {
	return this._position;
    };


    this.flow_capacity = function() {
	return this._flow_capacity;
    };


    this.scaling = function() {
	return this._scaling;
    };
    
    
    this.set_position = function(new_pos, strict=false) {
	if (new_pos >= 1.0) {
	    if (strict) {
		throw new RangeError("valve position must be in range 0 <= position <= 1.0. Requested " + new_pos);
	    } else {
		new_pos = 1.0;
	    };
	}
	else if (new_pos <= 0.0) {
	    if (strict) {
		throw new RangeError("valve position must be in range 0 <= position <= 1.0. Requested " + new_pos);
	    } else {
		new_pos = 0.0;
	    };
	};
	this._position = new_pos;
	this._update_flow_capacity();
    };


    this.set_position_from_flow_capacity = function(flow_capacity) {
	/* Set valve position from the flow capacity. */

	// validate flow capacity
	if (flow_capacity >= 1.0 || flow_capacity < 0.0) {
	    throw new RangeError("flow capacity out of range 0 <= fc <= 1.0. Got flow_capacity = " + flow_capacity);
	};

	// set the flow capacity, base on the valve type
	if (this._type == 'linear') {
	    this._set_position_from_flow_capacity_linear(flow_capacity);
	} else if (this._type == 'equal_percentage') {
	    this._set_position_from_flow_capacity_equal_percentage(flow_capacity);
	};
    };

    
    this.set_scaling = function(scaling) {
	if (scaling => 0.0) {
	    this._scaling = scaling;	    
	} else {
	    throw new RangeError("valve scaling parameter must be > 0. Got " + scaling);
	};
    };
	

    this.is_on_handle = function(x, y) {
	var psuedo_body = {
	    position : this._handle_loc(),
	    angle : this._handle_angle()
	};
	var rotated_point = utils.rotate_point_with_body(psuedo_body, { x : x, y : y});
	var w = this.images.handle.width*this._scaling;
	var h = this.images.handle.height*this._scaling;
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
    this._init_type = function(type) {
	if (this._supported_types.includes(type)) {
	    this._type = type;
	} else {
	    throw new RangeError("Invalid valve type '" + this._type + "'. Supported types are " + this._supported_types + ".");   
	};
    };


    this._update_flow_capacity = function() {
	if (this._type == 'linear') {
	    this._update_flow_capacity_linear();
	} else if (this._type == 'equal_percentage') {
	    this._update_flow_capacity_equal_percentage();
	};
    };


    this._update_flow_capacity_linear = function() {
	this._flow_capacity = this._position;
    };


    this._update_flow_capacity_equal_percentage = function() {
	this._flow_capacity = (Math.exp(this._position) - 1.0)/(Math.exp(1) - 1.0);
    };
    

    this._set_position_from_flow_capacity_linear = function(fc) {
	this.set_position(fc);
    };

    
    this._set_position_from_flow_capacity_equal_percentage = function(fc) {
	this.set_position(Math.log(fc*(Math.exp(1) - 1.0) + 1.0));
    };

        this._is_valid_type = function(type) {
	/* Ensure the valid type is supported */
	if (this._supported_types.includes(type)) {
	    return True;
	};
	return False;

    };
    

    this._set_position_from_angle = function(angle) {
	if (angle > PI) {
	    var normed_angle = angle - 2*PI;
	}
	else {
	    var normed_angle = angle;
	};
	var new_pos = (normed_angle - this._handle_rest_angle)/this._handle_range;
	this.set_position(new_pos);
    };


    this._handle_angle = function() {
	return this._handle_rest_angle + this._position*this._handle_range;
    };
    

    this._handle_loc = function() {
	return createVector(this.x, this.y)
    };

    
    this._show_body = function() {
	push();
	imageMode(CENTER);
	translate(this.x, this.y);
	rotate(this._body_angle);
	image(this.images.body, 0 , 0,
	      this.images.body.width*this._scaling,
	      this.images.body.height*this._scaling);
	pop();
    };


    this._show_handle = function() {
	push();
	var pos = this._handle_loc(); 
	translate(pos.x, pos.y);
	rotate(this._handle_angle());
	imageMode(CENTER);
	image(this.images.handle, 0, 0,
	      this.images.handle.width*this._scaling,
	      this.images.handle.height*this._scaling);
	pop();

    };

    this._show_position = function() {
	push()
	textAlign(CENTER, CENTER);
	textSize(20);
	fill(255);
	noStroke();
	var percent_open = this._position*100.0;
	var h =  1.2*this.images.body.height*this._scaling;
	var dx = h*Math.sin(this._body_angle);
	var dy = h*Math.cos(this._body_angle);
	text(percent_open.toFixed(0) + '%', this.x + dx, this.y + dy);
	pop();
    }


    this._show_name = function() {
	push()
	textAlign(CENTER, CENTER);
	textSize(20);
	fill(255);
	noStroke();
	var h =  1.2*this.images.body.height*this._scaling;
	var dx = h*Math.sin(this._body_angle);
	var dy = -h*Math.cos(this._body_angle);
	text(this.name, this.x + dx, this.y + dy);
	pop();
    };


    this._highlight = function() {
	push();
	imageMode(CENTER);
	var pos = this._handle_loc(); 
	translate(pos.x, pos.y);
	rotate(this._handle_angle());
	image(this.images.highlight, 0, 0,
	      this.images.highlight.width*this._scaling,
	      this.images.highlight.height*this._scaling);
	pop();
    };

    // Auto-initialisation
    this.__init__(x, y, options);
};
