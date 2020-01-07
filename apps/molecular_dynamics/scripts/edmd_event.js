// VCE Project - Event class
//
// A simple collision event class that can store information about the
// type, time and particles involved in a collision event.
//
// TODO: clean this up (collision type should not be str etc.) 
//
// Andrew D. McGuire 2019
// a.mcguire227@gmail.com
//----------------------------------------------------------
const WallType = {
    LEFT: "left",
    RIGHT: "right",
    UP: "up",
    DOWN: "down"
};


function Event(t, part_1, part_2=null, wall=null) {
    
    // Event attributes
    this.t = t;
    this.part_1 = part_1;
    this.part_2 = part_2;
    this.wall = wall;
    
    if (this.wall === null) {
	if (this.part_2 === null) {
	    throw new TypeError("Event: invalid second particle (null)");
	};
    };

    this.is_wall_collision = function() {
	return (this.wall != null);
    };
    
} // end of Event class
