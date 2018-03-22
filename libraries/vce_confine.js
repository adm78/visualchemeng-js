// VCE Project - Confinement class
//
// The Confine class is intended to be used to enforce particle to
// remain within a area of the canvas by acting as a hard boundary. It
// is supposed to be general enough that it can be customised to
// handle complex geometries and applications.
//
// Requires:
// - p5.js or p5.min.js
// - vce_particle.js
// - p5collide.js
//
// Andrew D. McGuire 2018
// a.mcguire227@gmail.com
//----------------------------------------------------------

function Confine() {

    /* Initialise the confine. 
      
       args:

    */
 
    // Confine attributes
    this.areas = [];
    
    // Confine methods
    this.isOnBoundary = function(x,y,r=0) {
	// Return true if (x,y) lies on a confine boundary
	// Return false if not.
	
    };

    this.isOutwith = function(x,y) {
	// Return true id (x,y) lies in confine.
	// Return false if not.
	
    };
    
    this.getTangent = function(x,y) {
	// Return the tangent to the wall nearest to position
	// x,y. 
    };

    this.getRandomPosition = function(x,y) {
	// Return an random position in the confine
	
    };

} // end of Confine class
