// VCE Project - Boundary class
//
// A boundary class compatible with p5.js and matter.js.
//
// Requires:
// - matter.js
// - p5.js 
// 
// Adpated from Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/uITcoKpbQq4
//
// Andrew D. McGuire 2018
// a.mcguire227@gmail.com
//----------------------------------------------------------


function Boundary(x, y, w, h, a, world, mode=CENTER) {
    /* Create a boundary and add it to the target matter.World.

       Args:
           - x (float) : The x-coordinate of the new boundary.
	   - y (float) : The y-coordinate of the new boundary.
           - w (float) : The width of the new boundary.
           - h (float) : The height of the new boundary.
	   - world (matter.World) : The matter world to add the
             boundary body to. If world is null then the boundary is
             created, but not added to the world.
           - mode (p5 rectMode option) : The p5 rectMode to use. This
             sets the precise meaning on the x, y args. Only LEFT and
             CENTER are currently supported. CENTER is assumed by
             default.

    */

    // initialisation
    var options = {
	friction: 0,
	restitution: 0.95,
	angle: a,
	isStatic: true
    }

    // Translate coordinate if required
    if (mode == LEFT) {
	var pos = left2center(x, y, w, h, a);
	x = pos.x;
	y = pos.y;	
    }
    else if (mode != CENTER && mode !== 'undefined') {
	throw new TypeError("mode arg must be either CENTER or LEFT.")
    };

    // set the object attributes
    this.body = Bodies.rectangle(x, y, w, h, options);
    this.w = w;
    this.h = h;
    this.active = false;
    World.add(world, this.body);

    
    // class methods
    this.show = function() {

	this.pos = this.body.position;
	this.angle = this.body.angle;	
	this.show_shape();
	this.show_center();
	this.show_lcorner();
	
    };

    
    this.show_shape= function() {
	push();
	translate(this.pos.x, this.pos.y);
	rotate(this.angle);
	rectMode(CENTER);
	stroke(255)
	strokeWeight(1);
	if (this.active) { fill('rgba(255, 0, 0, 0.5)')}
	else { fill('rgba(0, 0, 0, 0.5)') };
	rect(0, 0, this.w, this.h);
	pop();
    };
    

    this.show_center = function() {
	// show central point
	push()
	fill(255,105,180);
	noStroke();
	translate(this.pos.x, this.pos.y);
	ellipse(0, 0, 5.0);
	pop()
    };

    
    this.show_lcorner = function() {
	// show corner point
	push()
	var l_pos = center2left(this.pos.x, this.pos.y, this.w, this.h, this.angle)
	fill(135, 206, 250);
	noStroke();
	translate(l_pos.x, l_pos.y);
	ellipse(0, 0, 5.0);
	pop()
    };


    this.mousePressed = function(mouseX, mouseY) {
	if (this.is_in_bounds(mouseX, mouseY)) {
	    this.active = true;
	}
	else {
	    this.active = false;
	};
    };
    
    
    this.mouseDragged = function(mouseX, mouseY) {
	if (this.active) {
	    console.log(this.body.position);
	    console.log({mouseX : mouseX, mouseY : mouseY});
	    var offset = {
		x : mouseX - this.body.position.x,
		y : mouseY - this.body.position.y
	    };
	    Body.translate(this.body, offset);
	};
    };


    this.is_in_bounds = function(x, y) {
	// check if x, y lies within the bounds of the body
	
	// rotate the point around the center of mass of the reactangle
	// adpated from https://stackoverflow.com/a/38285610/4530680
	var dx=mouseX-this.body.position.x;
	var dy=mouseY-this.body.position.y;
	var mouseAngle=Math.atan2(dy,dx);
	var mouseDistance=Math.sqrt(dx*dx+dy*dy);
	var x = this.body.position.x+mouseDistance*Math.cos(mouseAngle-this.angle);
	var y = this.body.position.y+mouseDistance*Math.sin(mouseAngle-this.angle);

	// check if rotated mouse coordinates are in the bounds of the reactangle
	if (x > this.body.position.x - 0.5*this.w && x < this.body.position.x + 0.5*this.w) {
	    if (y > this.body.position.y - 0.5*this.h && y < this.body.position.y + 0.5*this.h) {
		return true;
	    };
	};
	return false
	

    };
};


function center2left(x, y, w, h, a) {
    return {
	x : x + 0.5*h*Math.sin(a) + 0.5*w*Math.cos(PI-a),
	y : y - 0.5*h*Math.cos(a) - 0.5*w*Math.sin(PI-a)
    };
};


function left2center(x, y, w, h, a) {
    return {
	x : x - 0.5*h*Math.sin(a) - 0.5*w*Math.cos(PI-a),
	y : y + 0.5*h*Math.cos(a) + 0.5*w*Math.sin(PI-a)
    };
   
};
