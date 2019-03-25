// VCE Project - Distillation McCabe Thiele test backend class
//
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
    this.D = function() {
	return this.F - this.B();	
    };
    
    this.B = function() {
	return this.F*(this.xf - this.xd)/(this.xb - this.xd);
    };

    
    // solve the column
    this.solve = function() {
	this.stage_data = this.get_stage_data();
	this.n_stages = this.stage_data.n_stages;
	this.feed_pos = this.stage_data.feed_pos;
	this.stages = this._get_filtered_stage_data(this.stage_data);
    };

    
    this.feed_op = function(x) {
	// feed operating line
	var y;
	if (utils.isArray(x)) {
	    y = [];
	    for (var i = 0; i < x.length; i++) {
		y.push(this.feed_op(x[i]));
	    };
	} else {
	    y = (this.q/(this.q-1))*x - (this.xf/(this.q-1));
	};
	return y;
    };


    this.rect_op = function(x) {
	// rectifying operating line
	var y;
	if (utils.isArray(x)) {
	    y = [];
	    for (var i = 0; i < x.length; i++) {
		y.push(this.rect_op(x[i]));
	    };
	} else {
	    if (isFinite(this.R)) {
		y = (this.R/(this.R+1))*x + (this.xd/(this.R+1));
	    } else {
		y = x;
	    };
	};
	return y;
    };


    this.stripping_op = function(x) {
	// stripping operating line
	// @WIP
	var y;
	if (utils.isArray(x)) {
	    y = [];
	    for (var i = 0; i < x.length; i++) {
		y.push(this.strip_op(x[i]));
	    };
	} else {
	    // find where the rect line meets the feed op line
	    var intersect = this.op_line_intersect();
	    var m = (intersect.y - this.xb)/(intersect.x - this.xb);
	    var c = this.xb*(1 - m);
	    y = m*x + c; 
	};
	return y;

    };

    this.op_line_intersect = function() {
	/* Find the intersection between the the three lines.
	
	 The intersection is:
	 y_feed = y_op
	 => x = (b_feed - b_rect)/(m_feed - m_rect) 
	
	*/
	var x, y;
	if (isFinite(this.R)) {
	    var num = - (this.xf/(this.q-1)) - (this.xd/(this.R+1));
	    var den = (this.R/(this.R+1)) - (this.q/(this.q-1));
	} else {
	    var num = - (this.xf/(this.q-1));
	    var den = 1.0 - (this.q/(this.q-1));
	};
	x = num/den;
	y = this.rect_op(x);
	return	{x : x, y : y};
    };


    this.get_stage_data = function() {
	/* Generate the stage data for the column. x-value, y-values
	   and number of stages required.

	   @TODO: just make the stages, set the stage number etc, directly in this routine.
	*/

	// make sure we have a finite number of stages
	if (!this._n_stages_is_finite()) {
	    
	    var x_step = [];
	    var y_step = [];
	    var n_stages = null;
	    var feed_pos = null;
	    
	} else {
	    
	    var x_step = [this.xd];
	    var y_step = [this.xd];
	    var n_stages = 0;
	    var feed_pos = null;
	    var i = 0;
	    // x_step[x_step.length-1] > this.xb
	    while (x_step[x_step.length-1] > this.xb) {

		n_stages++;
		
		// 1. side step to the equilibrium line
		var x1 = this.x_eq(y_step[i]);
		var y1 = y_step[i];
		
		// 2. down step to the lowest operating line
		var x2 = x1;
		if (this.stripping_op(x2) > this.rect_op(x2)) {
		    var y2 = this.rect_op(x2);
		} else {
		    var y2 = this.stripping_op(x2);
		    if (feed_pos == null) {
			// we just jumped over the op line intersection, this is the feed position.
			feed_pos = n_stages;
		    };
		};

		// add the new points to the step data array
		x_step.push(x1, x2);
		y_step.push(y1, y2);
		i = i + 2;

	    };
	};
	return { x : x_step, y : y_step, n_stages : n_stages, feed_pos : feed_pos};
    };

    
    this._get_filtered_stage_data = function(stage_data) {
	// get a list of composition objects, one element for each stage of the column.
	var stages = []
	for (var i = 0; i < stage_data.x.length; i+=2) {
	    stages.push({x : stage_data.x[i], y : stage_data.y[i]});
	};
	return stages;
    };

    this._n_stages_is_finite = function() {
	var intersect = this.op_line_intersect();
	if (intersect.y < this.y_eq(intersect.x)) {
	    return true;
	};
	return false;
    };

};

	
