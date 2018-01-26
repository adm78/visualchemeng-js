// VCE Project - Ensemble class
//
// The Ensemble class is intended to hold and manipulate an array of
// Particles objects (vce_particle.js).
//
// Requires:
// - p5.js or p5.min.js
// - vce_particle.js
//
// Andrew D. McGuire 2017
// a.mcguire227@gmail.com
//----------------------------------------------------------

function Ensemble(p=[]) {

    /* Initialise the ensemble. 
      
       args:
       particles - an array of Particle objects

    */
 
    // Ensemble attributes
    this.particles = p;
    this.outlier_removed = false; // at least one outlier has been removed
    this.outliers = 0;
    
    // Ensemble methods
    this.addParticle = function(p,n=1) {
	for (var i = 0; i < n; i++) {
	    this.particles.push(p);
	};
    };
    
    this.update = function(dt) {
	
	//move all the particles forward in time by dt
	for (i = 0; i < this.particles.length; i++) {
	    this.particles[i].update(dt);
	};
    };

    this.show = function() {

	/* Draw all particles to the canvas */
	for (i = 0; i < this.particles.length; i++) {
	    this.particles[i].show();
	};
    };

    
    this.highlight = function() {

	// Highlight the particles red.
	fill(256,1,1);
	noStroke();
	for (i = 0; i < this.particles.length; i++) {
	    this.particles[i].highlight();
	};
    }

    
    this.perturb = function(xmax,ymax) {

	// randomly perturb all particle positions
	// by [0-xmax] in the x-direction and
	// by [0-ymax] in the y-direction.
	for (i = 0; i < this.particles.length; i++) {
	    var part = this.particles[i];
	    part.pos.x = part.pos.x + getRandomSigned()*xmax;
	    part.pos.y = part.pos.y + getRandomSigned()*ymax;
	};
    };

    this.removeOutliers = function(xmax,ymax) {

	// remove any particles that lie outwith the simualtion domain
	for (i = 0; i < this.particles.length; i++) {
	    if (!this.particles[i].inDomain(xmax,ymax)) {
		this.particles.splice(i,1);
		i = i - 1;
		this.updateOutliers();
	    };
	};
    };

    this.updateOutliers = function() {

	// update the number of outliers
	this.outliers = Math.min(this.outliers + 1,1000);
	this.outlier_removed = true;
	
    };


} // end of Particle class
