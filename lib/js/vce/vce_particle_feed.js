// VCE Project - Particle Feed Class
//
// A data structure for storing information about a
// particle source.
// 
//
// Requires:
// - no requirements
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
           - particle_options (JSON object) : Specifies the graphical
             properties of the particle. See vce_particle_factory.js
             for more details on this optinal arg.
    */

    // initialisation
    this.x = x;
    this.y = y;
    this.rate = rate;
    this.particle_options = particle_options;

};

