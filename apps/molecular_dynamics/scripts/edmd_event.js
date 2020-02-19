// VCE Project - Event class
//
// A simple collision event class that can store information about the
// type, time and particles involved in a collision event.
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


function Event(t, part_1, part_2 = null, wall = null) {

    // Event attributes
    this.t = t;
    this.part_1 = part_1;
    this.part_2 = part_2;
    this.wall = wall;

    if (this.wall === null) {
        if (this.part_2 === null) {
            throw new TypeError("Event: invalid second particle (null)");
        }
    }

    this.is_wall_collision = function () {
        return (this.wall != null);
    };

    this.smallest_particle = function () {
        if (this.is_wall_collision()) {
            return this.part_1
        }
        if (this.part_1.radius <= this.part_2.radius) {
            return this.part_1;
        }
        return this.part_2;
    };

    this.largest_particle = function () {
        if (this.is_wall_collision()) {
            return this.part_1
        }
        if (this.part_1.radius > this.part_2.radius) {
            return this.part_1;
        }
        return this.part_2;
    };

} // end of Event class
