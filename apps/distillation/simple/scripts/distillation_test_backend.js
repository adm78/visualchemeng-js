// VCE Project - Distillation base class
//
// A distillation base class.
//
// Requires:
//
// Sources:
// http://staff.sut.ac.ir/haghighi/courses/Unit_Operation_I/solved_problems/Ponchon_Savarit_1/index.htm
//
//
// Andrew D. McGuire 2018
// a.mcguire227@gmail.com
//----------------------------------------------------------

// VCE Project - Distillation test backend class
//
// This is backend column test for use with the
// distllation_graphics.js. As you will see, it does not perform any
// rigorous compuation.
//
// Requires:
// vce_distillation.js
//
// Andrew D. McGuire 2018
// a.mcguire227@gmail.com
//----------------------------------------------------------

function DistTestBackend(options) {
    /*

    */
    DistColumnBase.call(this, options);
  
    // Overide base column methods
    this.V = function() {
	return 0.25*this.F + 0.25*this.F*(1.0-this.R)
    };
    
    this.L = function() {
	return this.F - this.V();
    };
  
};

	
