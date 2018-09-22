// VCE Project - Value class
//
// A graphical, interactive valve class.
//
// Requires:
// - vce_utils.js
// - p5.js or p5.min.js
//
// Andrew D. McGuire 2018
// a.mcguire227@gmail.com
//----------------------------------------------------------

function Valve(x, y, img) {

    this.x = x;
    this.y = y;
    this.image = img;
    this.scaling = 0.15;

    this.show = function() {
	push();
	imageMode(CENTER);
	image(this.image, this.x , this.y,
	      this.image.width*this.scaling,
	      this.image.height*this.scaling);
	pop();
    };
    
};
