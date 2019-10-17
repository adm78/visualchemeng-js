function EDMDGraphics(simulation) {

    this.simulation = simulation;


    this.update = function() {

    };


    this.draw = function() {
	
    };

    this.add_particle = function() {
	// Add a new Particle object to the particles array
	// at the position of the mouse. If this overlaps with
	// another particle, then try another position until we
	// find a overlap free position or deem the ensemble
	// to be full.
	var particle_options = { radius : getRadius() }; 
	var new_part = new Particle(mouseX, mouseY, particle_options);
	var attempts = 0;
	var success = false;
	var max_attempts = 1000;
	
	if (!this.simulation.ensemble_full) {
	    while (!success && attempts < max_attempts) {
		success = this.simulation.add_particles(new_part);
		if (!success) {
		    // try another insertion position
		    new_part = this._random_move(part);
		};
		attempts = attempts + 1;
	    };
	    if (!success) {
		console.log("add_particle: max attempts exceeded.");
	    };
	    
	} else {
	    console.log("md.js: ensemble full!");
	};
    };

    this._random_move = function(part) {
    
	// translate a particle by a small random amount, ensuring the
	// resulting position lies within the sim box.

	// TODO: we should use the particle perturb method here. 

	while (true) {
	    var old_x = part.pos.x;
	    var old_y = part.pos.y;
            part.pos.x = part.pos.x + part.radius*(Math.random()*2.0-1.0);
            part.pos.y = part.pos.y + part.radius*(Math.random()*2.0-1.0);
            // reject if we're outwith the sim box
            if (!particleInSimBox(part)) {
		part.pos.x = old_x;
		part.pos.y = old_y;
            }
	    else { break;};
	}
	return part;
}


    this._draw_particles = function() {


    };

    this._draw_time = function() {


    };


    this._draw_fps = function() {

    };


    
    this._highlight_event_particles = function(event) {

	/* Highlight the particle(s) involved in
	   an event

	   args:
	   event - a valid Event object
	*/

	var p1 = particles[event.p1_index];
	p1.highlight();
	if (event.p2_index) {
            var p2 = particles[event.p2_index];
            p2.highlight();
	}
    };
    
}
