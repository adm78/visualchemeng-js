// VCE Project - Constraint class
//
// A wrapper around the matter.js constraint class.
//
// Requires:
// - matter.js
// - p5.js 
// 
// Andrew D. McGuire 2018
// a.mcguire227@gmail.com
//----------------------------------------------------------

function PhysEngineConstraint(matter_options, world, width, colour) {

    this.width = width;
    this.colour = colour;
    this.constraint = Constraint.create(matter_options);
    World.add(world, this.constraint);

    this.show = function() {
	var a = this.constraint.bodyA.position;
	var b = this.constraint.bodyB.position;
	strokeWeight(this.width);
	stroke(this.colour);
	line(a.x, a.y, b.x, b.y);
    };
    
};
