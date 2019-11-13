// VCE Project - Event class
//
// A simple collision event class that can store information about the
// type, time and particles involved in a collision event.
//
// Andrew D. McGuire 2019
// a.mcguire227@gmail.com
//----------------------------------------------------------

function Event(ct, t, part_1=null, part_2=null,wall=null) {

    /* Events are either with the wall or another particle
    
       args:
       ct       - collision type ("w" is wall collision, anything else is binary particle)
       t        - time of collision: float
       part_1   - first particle involved in the event: Union[Particle, MatterParticle]
       part_2   - seconds particle involved in the event:  Union[Particle, MatterParticle]
       wall     - name of wall involved in collision: str
    */
    
    // Event attributes
    this.wc_log = false; // is it wall collision? (otherwise binary particle collision)
    this.t = t;
    this.part_1 = part_1;
    this.part_2 = part_2;
    this.wall = wall;   

    // Set event attributes based on the collision type
    if (ct==="w") {
	this.wc_log = true;
    }
    else {
	// Warn if a second particle not passed
	if (part_2 === null) {
	    throw new TyepError("Event: invalid second particle (null)");
	}
    };
    
} // end of Event class
