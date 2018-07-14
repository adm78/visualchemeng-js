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
	var dx1 = 0.5*h*Math.cos(a-0.5*PI);
	var dx2 = 0.5*w*Math.cos(PI-a);
	var dy1 = 0.5*h*Math.sin(a-0.5*PI);
	var dy2 = 0.5*w*Math.sin(PI-a);
	var x = x - dx1 + dx2;
	var y = y + dy1 + dy2;
    }
    else if (mode != CENTER && mode !== 'undefined') {
	throw new TypeError("mode arg must be either CENTER or LEFT.")
    };

    // set the object attributes
    this.body = Bodies.rectangle(x, y, w, h, options);
    this.w = w;
    this.h = h;
    World.add(world, this.body);

    
    // class methods
    this.show = function() {
	var pos = this.body.position;
	var angle = this.body.angle;
	push();
	translate(pos.x, pos.y);
	rotate(angle);
	rectMode(CENTER);
	strokeWeight(1);
	noStroke();
	fill(0);
	rect(0, 0, this.w, this.h);
	pop();
	push()
	fill(255,105,180);
	noStroke();
	translate(pos.x, pos.y);
	ellipse(0, 0, 5.0);
	pop()
    };
    
};
