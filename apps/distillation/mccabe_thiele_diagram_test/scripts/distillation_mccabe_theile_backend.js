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
	    return 0.5;
	};
	return y;

    };

    this.rect_feed_intersect = function() {
	// find the intersection between the rectifying and feed op lines
	// @WIP
    };
};

	
