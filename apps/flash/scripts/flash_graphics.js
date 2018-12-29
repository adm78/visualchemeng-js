// VCE Project - flash_graphics.js
//
// Flash tank simulation graphics class.
//
// Requires:
// - p5.js or p5.min.js
// - vce_utils.js
// - vce_particle.js
//
// Andrew D. McGuire 2018
// a.mcguire227@gmail.com
//
// @TODO: finish implementing the new update method
//
//----------------------------------------------------------
function FlashGraphics(canvas, flash, images, debug) {


    // Set the main class attributes
    this.canvas = canvas;
    this.flash = flash;
    this.xmax = canvas.width;
    this.ymax = canvas.height;
    this.canvas_sf = 0.6;
    this.images = images;
    this.sid = utils.utils.getImgScaledDimensions(this.images.tank, this.canvas_sf, this.ymax);
    this.debug = debug;
    this.ndraws = 0;

    // graphical config (can be tuned)
    this.rpart = 1.5; // stream particle radii (float)
    this.outlet_freq = 1; // # draws/stream replenish (int)
    this.gravity = 0.02;  // what it says on the tin
    this.pout = 0.5; // controls number of particle to output at a time
    this.pspeed = 1.0; // dt between particle updates
    this.kpert = 4.0; // particle perturbation scaling constant (float)
    this.output_delay = 60; // control delay between feed entering flash and first particle exit
    this.e_coeff = 0.3; // liquid-wall coefficent of restitution (kind of)

    // initialise the ensembles
    this.Ensembles = {};
    this.Ensembles.feed = new Ensemble([], null, 'feed');
    this.Ensembles.tops = new Ensemble([], null, 'tops');
    this.Ensembles.bottoms = new Ensemble([], null, 'bottoms');

    // Compute the particle source positions
    var feed_x =  0.75*(0.5*this.xmax - 0.5*this.sid.width);
    var feed_y = (this.ymax/2.0) + 0.05*this.sid.height;
    this.feed_pos = createVector(feed_x, feed_y);

    var tops_x = (xmax/2) + 0.5*sid.width;
    var tops_y = (ymax/2.0) - 0.475*sid.height;
    this.tops_pos = createVector(tops_x,tops_y);

    var tops_x = (xmax/2.0) + 0.5*sid.width;
    var tops_y = (ymax/2.0) + 0.475*sid.height;
    this.bottoms_pos = createVector(tops_x,tops_y);

    // Add particle sources to the ensembles

    
    // intialise the valve
    var valve_options = {};
    if (!online) {
	valve_options.body_img_URL = "../../../../lib/images/valve4.svg";
	valve_options.handle_img_URL = "../../../../lib/images/valve_handle.svg";
	valve_options.highlight_img_URL = "../../../../lib/images/valve_handle_highlight.svg";
    }
    this.valve = new Valve(this.feed_pos.x, this.feed_pos.y, valve_options)
    var F_range = getRanges(sys).F;
    valve.set_position(flash.F/(F_range.max - F_range.min));


    // public methods
    this.update = function() {

	//@TODO: ensemble updates should be handled by the ensembles,
	// not here. We shoudl just be computing the options objects
	// to pass to this.Ensembles.$name.update. Any of the static stuff
	// should be moved to a settings.js file.

	// update exisiting particle positions
	this.Ensembles.feed.update(pspeed);
	this.Ensembles.tops.update(pspeed);
	this.Ensembles.bottoms.update(pspeed);
	feed_stream.removeOutliers(0.5*(xmax-sid.width),2*ymax);
	tops_stream.removeOutliers(xmax,ymax);
	bottoms_stream.applyBoundary(0.98*ymax,e_coeff);
	bottoms_stream.removeOutliers(xmax,2*ymax);
	tops_stream.perturb(kpert/1.0,kpert/1.0);
	bottoms_stream.perturb(kpert/4.0,kpert/4.0);

	// add new particles at desired freq
    	if (ndraws % outlet_freq === 0) {

	    var colour = chooseColoursFromComposition(getColours(sys),flash)

	    // handle the feed stream
	    for (i=0; i < pout*flash.F; i++) {
		var feed_particle_options = {
		    radius : rpart,
		    energy : 1.0,
		    v : { x : 2.0, y : 0.0 },
		    colour : colour.z
		}
		var new_feed_part1 = new Particle(feed_pos.x,feed_pos.y+0.01*sid.height, feed_particle_options);
		var new_feed_part2 = new Particle(feed_pos.x,feed_pos.y-0.01*sid.height, feed_particle_options);
		feed_stream.addParticle(new_feed_part1);
		feed_stream.addParticle(new_feed_part2);
	    };

	    // handle the delayed outlet streams
	    if (feed_stream.outliers >  output_delay) {
		for (i=0; i < pout*flash.V; i++) {
		    var tops_particle_options = {
			radius : rpart,
			v : { x : 2.0, y : 0.0 },
			colour : colour.y,
			acc : createVector(0, -gravity)
		    };
		    var new_tops_part = new Particle(tops_pos.x, tops_pos.y, tops_particle_options);
    		    tops_stream.addParticle(new_tops_part);

		};
		for (i=0; i < pout*flash.L; i++) {
		    var bottoms_particle_options = {
			radius : rpart,
			v : { x : 2.0, y : 0.0 },
			colour : colour.x,
			acc : createVector(0, gravity)
		    };
		    var new_bottoms_part = new Particle(bottoms_pos.x, bottoms_pos.y, bottoms_particle_options);
		    bottoms_stream.addParticle(new_bottoms_part);
		};
	    };
    	};

    	// prevent potential overflow
    	this.ndraws = this.ndraws + 1;
    	if (this.ndraws > 10000) {
    	    this.ndraws = 0;
    	};

    };


    this.show = function() {
	this._show_background();
	this._show_ensembles();
	this.valve.show();
    };


    // private methods
    this._show_background = function() {
	push();
	background(51);
	imageMode(CENTER);
	image(this.image.tank, this.xmax/2 , this.ymax/2, this.sid.width, this.sid.height);
	pop();
    };


    this._show_ensembles() = function() {
	for (var key in this.Ensembles) {
	    this.Ensembles[key].show();
	};
    };
    
};
