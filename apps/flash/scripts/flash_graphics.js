// VCE Project - flash_graphics.js
//
// Flash tank simulation graphics class.
//
// Requires:
// - p5.js or p5.min.js
// - vce_utils.js
// - vce_particle.js
// - vce_particle_source.js
//
// Andrew D. McGuire 2018
// a.mcguire227@gmail.com
//
// @TODO: compute source args for update method.
//
//----------------------------------------------------------
function FlashGraphics(canvas, flash, images, sysid, debug) {


    // Set the main class attributes
    this.canvas = canvas;
    this.flash = flash;
    this.xmax = canvas.width;
    this.ymax = canvas.height;
    this.canvas_sf = 0.6;
    this.images = images;
    this.sid = utils.getImgScaledDimensions(this.images.tank, this.canvas_sf, this.ymax);
    this.debug = debug;
    this.ndraws = 0;
    this.sysid = sysid // system identifier used for loading system-specific settings

    // graphical config (can be tuned, could be moved to settings.js)
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

    var tops_x = (this.xmax/2) + 0.5*this.sid.width;
    var tops_y = (this.ymax/2.0) - 0.475*this.sid.height;
    this.tops_pos = createVector(tops_x, tops_y);

    var tops_x = (this.xmax/2.0) + 0.5*this.sid.width;
    var tops_y = (this.ymax/2.0) + 0.475*this.sid.height;
    this.bottoms_pos = createVector(tops_x, tops_y);

    // Add particle sources to the ensembles, leave rates unitialised as this will be set on update. 
    // feed
    var full_feed_particle_options = [];
    for (var i = 0; i < settings.sys[this.sysid].particles.length; i++) {
    	full_feed_particle_options[i] = utils.merge_options(settings.sys[this.sysid].particles[i],
							    settings.sys[this.sysid].particle_sources.feed.options);
    };
    var feed_source = new ParticleSource(this.feed_pos.x, this.feed_pos.y, null, full_feed_particle_options);
    this.Ensembles.feed.addSource(feed_source);

    // tops
    var full_tops_particle_options = [];
    for (var i = 0; i < settings.sys[this.sysid].particles.length; i++) {
    	full_tops_particle_options[i] = utils.merge_options(settings.sys[this.sysid].particles[i],
							    settings.sys[this.sysid].particle_sources.tops.options);
    };
    var tops_source = new ParticleSource(this.tops_pos.x, this.tops_pos.y, null, full_tops_particle_options);
    this.Ensembles.tops.addSource(tops_source);

    // bottoms
    var full_bottoms_particle_options = [];
    for (var i = 0; i < settings.sys[this.sysid].particles.length; i++) {
    	full_bottoms_particle_options[i] = utils.merge_options(settings.sys[this.sysid].particles[i],
							       settings.sys[this.sysid].particle_sources.bottoms.options);
    };
    var bottoms_source = new ParticleSource(this.bottoms_pos.x, this.bottoms_pos.y, null, full_bottoms_particle_options);
    this.Ensembles.bottoms.addSource(bottoms_source);

    
    // initialise the valve
    var valve_options = {};
    if (!vce_online) {
	valve_options.body_img_URL = "../../../../lib/images/valve4.svg";
	valve_options.handle_img_URL = "../../../../lib/images/valve_handle.svg";
	valve_options.highlight_img_URL = "../../../../lib/images/valve_handle_highlight.svg";
    }
    this.valve = new Valve(this.feed_pos.x, this.feed_pos.y, valve_options)
    var F_range = getRanges(this.sysid).F;
    this.valve.set_position(flash.F/(F_range.max - F_range.min));

    
    // set the stream-specific update options
    // @TODO: the source args options need to be constructed and
    // passed. These are related to the composition of the flash
    // streams.
    stream_specific_options = {
	feed : {
	    xmax : 0.5*(this.xmax-this.sid.width),
	    ymax : 2*this.ymax,
	    dt : this.pspeed,
	    dx_max : 0.1*this.kpert,
	    dy_max : 0.1*this.kpert,
	},
	tops : {
	    xmax : this.xmax,
	    ymax : this.ymax,
	    dx_max : this.kpert,
	    dy_max : this.kpert,
	    dt : this.pspeed
	},
	bottoms : {
	    xmax : this.xmax,
	    ymax : 2.0*this.ymax,
	    dx_max : 0.25*this.kpert,
	    dy_max : 0.25*this.kpert,
	    apply_vbound : true,
	    vbound : 0.98*this.ymax,
	    ecoeff : this.ecoeff,
	    dt : this.pspeed
	}
    };

    // public methods
    this.update = function() {
	this._update_particle_source_rates(); // @Performance: maybe only do this after the flash backend has updated?
	for (var key in this.Ensembles) {
	    this.Ensembles[key].update(stream_specific_options[key]);
	};
    };


    this.show = function() {
	this._show_background();
	this._show_ensembles();
	this.valve.show();
	this._show_fps();
	this._show_number_particles();
    };

    
    this.colours = function() {
	var c = []
	var particles = settings.sys[this.sysid].particles
	for (var i = 0; i < particles.length; i++) {
	    c.push(particles[i].colour);
	}
	return c;
    };

    
    // private methods
    this._update_particle_source_rates = function() {
	this.Ensembles.feed.sources[0].set_rate(this.pout*this.flash.F);
	this.Ensembles.tops.sources[0].set_rate(this.pout*this.flash.V);
	this.Ensembles.bottoms.sources[0].set_rate(this.pout*this.flash.L);
    };

    
    this._show_background = function() {
	push();
	background(51);
	imageMode(CENTER);
	image(this.images.tank, this.xmax/2 , this.ymax/2, this.sid.width, this.sid.height);
	pop();
    };


    this._show_ensembles = function() {
	for (var key in this.Ensembles) {
	    this.Ensembles[key].show();
	};
    };


    this._show_temp = function() {
	var T_string = flash.T.toFixed(0)+" K";
	push()
	textSize(32);
	fill(255, 255, 255);
	textAlign(LEFT);    
	text(T_string, 10, 30);
	pop()
    };


    this._show_pressure = function() {
	var P_string = flash.P.toFixed(2)+" bar";
	push()
	textSize(32);
	fill(255, 255, 255);
	textAlign(LEFT);    
	text(P_string, 10, 65);
	pop()
    };


    this._show_stream_labels = function() {
	var F_string_pos_x = 0.5*(this.xmax-this.sid.width);
	var F_string_pos_y = this.feed_pos.y-30;
	var V_string_pos_x = this.tops_pos.x;
	var V_string_pos_y = this.tops_pos.y-30;
	var L_string_pos_x = this.bottoms_pos.x;
	var L_string_pos_y = this.bottoms_pos.y+50;
	push();
	textAlign(CENTER);
	textSize(24);
	fill('#444');
	ellipse(F_string_pos_x,F_string_pos_y-8,30);
	ellipse(V_string_pos_x,V_string_pos_y-8,30);
	ellipse(L_string_pos_x,L_string_pos_y-8,30);
	fill(255, 255, 255);
	text("F", F_string_pos_x,F_string_pos_y);
	text("V", V_string_pos_x,V_string_pos_y);
	text("L", L_string_pos_x,L_string_pos_y);
	pop();
    };


    this._show_fps = function() {
	push()
	textAlign(LEFT,BOTTOM);
	text(frameRate().toFixed(0) + 'fps', this.canvas.width*0.02, this.canvas.height*0.98);
	pop()
    };


    this._show_number_particles = function() {
	var n = 0;
	for (var key in this.Ensembles) {
	    n = n + this.Ensembles[key].particles.length;
	};
	push();
	textAlign(LEFT,BOTTOM);
	text(n.toFixed(0) + ' particles', this.canvas.width*0.02, this.canvas.height*0.94);
	pop();
    };
    
};
