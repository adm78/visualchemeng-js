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

function DistColumnBase(options) {

    /* Initialise the column

       Args:
       

    */
 
    // Column attributes                       
    this.x = options.x;
    this.y = options.y;
    this.z = options.z;
    this.L = options.L;
    this.V = options.V;
    this.F = options.F;
    this.R = options.R;
    this.components = options.components;

    // Column methods
    this.R_min = function() {};

    this.stages = function() {};

    this.Q_condenser = function() {};

    this.Q_reboiler =  function() {};
  
};


function unit_testDistillationColumn() {

    /* Column unit test */
    return false;
};
	
