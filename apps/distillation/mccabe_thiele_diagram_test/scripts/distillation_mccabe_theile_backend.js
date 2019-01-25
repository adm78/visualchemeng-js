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


    this.n_stages = function() {
	if (this.R == 1.0) {
	    return undefined;
	} else {
	    return this.stage_data().n_stages;
	};	
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
	    y = (this.R/(this.R+1))*x + (this.xd/(this.R+1));
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
	var num = - (this.xf/(this.q-1)) - (this.xd/(this.R+1));
	var den = (this.R/(this.R+1)) - (this.q/(this.q-1));
	x = num/den;
	y = this.rect_op(x);
	return	{x : x, y : y};
    };


    this.stage_data = function() {
	/* Generate the stage data for the column. x-value, y-values
	   and number of stages required.

	   @TODO: Make this stable for R values close to unity
	   (failing around 1.5 just now!)
	*/
	var x_step = [this.xd];
	var y_step = [this.xd];
	var n_stages = 0;
	var i = 0;
	// x_step[x_step.length-1] > this.xb
	while (x_step[x_step.length-1] > this.xb) {
	    
	    // side step to the equilibrium line
	    var x1 = this.x_eq(y_step[i]);
	    var y1 = y_step[i];
	    
	    // down step to the lowest operating line
	    var x2 = x1;
	    if (this.stripping_op(x2) > this.rect_op(x2)) {
		var y2 = this.rect_op(x2);
	    } else {
		var y2 = this.stripping_op(x2);
	    };

	    // add the new points to the step data array
	    x_step.push(x1, x2);
	    y_step.push(y1, y2);
	    i = i + 2;
	    n_stages++;
	};
	return { x : x_step, y : y_step, n_stages : n_stages};
    };
};

	
