// VCE Project - Event class
//
// A simple collision event class that can store information about the
// type, time and particles involved in a collision event.
//
// Andrew D. McGuire 2017
// a.mcguire227@gmail.com
//----------------------------------------------------------

function Event(ct,t,p1_index,p2_index=null,wall=null) {

    /* Events are either with the wall or another particle
    
       args:
       ct       - collision type ("w" is wall collision, anything else is binary particle)
       t        - time of collision
       p1_index - location parameter for the first particle
       p2_index - location parameter for the second particle (optional)
       wall     - name of wall involved in collision
    */
    
    // Event attributes
    this.wc_log = false; // is it wall collision? (otherwise binary particle col)
    this.t = t;
    this.p1_index = p1_index;
    this.p2_index = p2_index;
    this.wall = wall;   

    // Set event attributes based on the collision type
    if (ct==="w") {
	this.wc_log = true;
    }
    else {
	// Warn if second particle index was not passed
	if (p2_index === null) {
	    console.log("Warning: Event: second particle index undefined");
	}
    };
    
} // end of Event class
