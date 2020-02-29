function EDMDGraphics(simulation, canvas) {

    this._simulation = simulation;
    this._canvas = canvas;
    this._sim_dt_per_frame = 1000.0;

    this.update = function() {
	this._simulation.step(this._sim_dt_per_frame);
    };


    this.show = function() {
	this._show_background();
	this._show_particles();
	this._highlight_first_event();
	this._show_time();
	this._show_fps();
    };

    this._show_background = function() {
	push();
	background(51);
	stroke(255);
	strokeWeight(1);
	pop();
    };


    this._show_particles = function() {
	for (var i=0; i < this._simulation.particles.length; i++) {
	    this._simulation.particles[i].show();
	};
    };

    this._show_time = function() {
	push();
	textSize(32);
	fill(255, 255, 255);
	textAlign(LEFT, TOP);
	text(this._simulation.time.toFixed(1)+'s', this._canvas.width*0.02, this._canvas.height*0.02);
	pop();
    };


    this._show_fps = function() {
	push()
	textAlign(LEFT,BOTTOM);
	text(frameRate().toFixed(0) + 'fps', this._canvas.width*0.02, this._canvas.height*0.98);
	pop()
    };


    
    this._highlight_first_event = function() {
	/* Highlight the particle(s) involved in first event (if any exists) */
	var event = this._simulation.first_event();
	if (event != null) {
	    event.part_1.highlight();
	    if (event.part_2) {
		event.part_2.highlight();
	    };
	};
    };
    
}
