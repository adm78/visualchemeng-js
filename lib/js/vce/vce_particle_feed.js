// VCE Project - Particle Feed Class
//
// A data structure for storing information about a
// particle source.
// 
//
// Requires:
// - vce_utils.js
//
// Andrew D. McGuire 2018
// a.mcguire227@gmail.com
//----------------------------------------------------------

function ParticleFeed(x, y, rate, particle_options) {
    /* A particle feed class compatible with p5.js and
       matter.js. Simply a data structure that can be utilised to
       store and manipluate properties of a source of particles.

       Args:
           - x (float) : The x-coordinate of the new boundary.
	   - y (float) : The y-coordinate of the new boundary.
	   - rate (float) : The rate [particles/draw() call] that
             particle should be generated
       Optional:
           - particle_options (JSON object or array of JSON particle
             options) : Specifies the graphical properties of the
             particle(s). See vce_particle_factory.js for more details
             on this optinal arg.
    */

    // initialisation
    this.x = x;
    this.y = y;
    this.rate = rate;
    this.particle_options = particle_options; // all other particle options

    // Feed class attributes
    this.get_particle_options_weighted = function(p) {
	
	// Draw a single options object from a list of partcle_options
	// based on probabilty list `p`. `p` may or may not be
	// normalised. If this.particle_options is not an array then
	// the only avaiable particle_options is returned. If p is
	// 'undefined' or null and this.particle_options is an array,
	// then we return the first element of that array.
	
	if (utils.isArray(this.particle_options)) {

	    // check the p is valid
	    if (p == 'undefined' || p == null) {
		return this.particle_options[0]
	    };
	    
	    var p_cum = [];
	    p.reduce(function(a,b,i) { return p_cum[i] = a+b; },0);
	    var p_sum = p_cum[p_cum.length-1];
	    var rnd = Math.random();

	    for (var i = 0; i < p_cum.length; i++) {
		if (rnd <= p_cum[i]/p_sum) {
		    return this.particle_options[i];
		};
	    };
	    throw new RangeError("No particle option was selected!");

	} else {
	    return this.particle_options;
	};
	
    };


    this.set_rate = function(rate) {
	if (isNaN(rate) || rate < 0) {
	    throw new RangeError("rate arg must be a valid number > 0. Passed ", rate);
	};
	this.rate = rate;
    };
    
};

