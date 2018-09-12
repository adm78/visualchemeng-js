// VCE Project - Multi-Body Particle Class
//
// A particle factory for building various types of particles
// including single bodied (vce_particle.MatterParticle) and
// multi-body particle types (e.g. vce_multibody.TwoBodyParticle).
//
// Requires:
// - matter.js
// - p5.js or p5.min.js
// - vce_matter_particle.js
// - vce_multibody.js
// - vce_constraint.js
//
// Andrew D. McGuire 2018
// a.mcguire227@gmail.com
//----------------------------------------------------------

function ParticleFactory(world, x, y, options) {
    /*
    
       Args:
           - world (matter.World) : The world to be passed to the particle constructor.
           - x (float) : The x-position to pass to the particle constructor.
           - y (float) : The y-position to pass to the particle constructor.
           - options (JSON object) : Particle options to pass to the
             particle constructor. Importantly this must have a 'type'
             attribute which is used to decide which particle
             constructor to call. See the 'Returns' info below for
             more details. If no options arg is passed, then the
             vce_particle.PhysEngineParticle constructor is called
             without an options arg.
	   
       Returns:
           A PhysEngineParticle or MultiBodyParticle object.

	   options.type    Constructor called
           ----------------------------------------
	   'single-body'   vce_particle.PhysEngineParticle
           'two-body'      vce_multibody.TwoBodyParticle
	   
    */
    
    // set some defaults
    var default_options = {'type': 'single-body'};
    options = options || default_options;
    
    // call the relavant constructor
    if (options.type === 'single-body') {
	var Part = new MatterParticle(world, x, y, options);
    }
    else if (options.type === 'two-body') {
	var Part = new TwoBodyParticle(world, x, y, options);
    }
    else {
	throw new RangeError("Unsupported particle 'type' ", options.type, "encountred particle.settings");
    };
    return Part;
};
