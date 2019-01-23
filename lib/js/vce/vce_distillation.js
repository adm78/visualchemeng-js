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
    this.xf = options.x;
    this.xd = options.y;
    this.xb = options.z;
    this.F = options.F;
    this.R = options.R;
    this.q = options.q;
    this.P = options.P;
    this.VL_VL_min_ratio = options.VL_VL_min_ratio;
    this.components = options.components;
    this.stages = [];
    this.feed_pos = 0;
    

    // Column methods
    this.L = function() {};
    
    this.V = function() {};
    
    this.R_min = function() {};

    this.n_stages = function() {};

    this.Q_condenser = function() {};

    this.Q_reboiler =  function() {};
  
};


function Stage() {
    
};


function unit_testDistillationColumn() {

    /* Column unit test */
    return false;
};
	
