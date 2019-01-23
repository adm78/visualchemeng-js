// VCE Project - Distillation McCabe Thiele test backend class
//
// This class is for testing purposes only.
//
// Requires:
// vce_distillation.js
//
// Andrew D. McGuire 2019
// a.mcguire227@gmail.com
//----------------------------------------------------------
function DistMcCabeTheile(options) {
    /*

    */
    DistColumnBase.call(this, options);
  
    // Overide base column methods
    // this.V = function() {
    // 	return 0.25*this.F + 0.25*this.F*(1.0-this.R)
    // };
    
    // this.L = function() {
    // 	return this.F - this.V();
    // };
    this.solve = function() {
	// solve the system using the mccabe-theile method
    };
  
};

	
