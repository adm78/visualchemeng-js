// VCE Project - Constants
//
// A simple class to store physical constants.  Could be JSON but it's
// easier to serve it this way.
//
// Adding to this file:
// Each constant should have an associated description and unit in SI
// form. For dimensionless paramereters, unit should be '-'. Only add
// a new constant if you need it, not beacuse you think you might!
//
// Requires:
// no requirements
//
// Andrew D. McGuire 2018
// a.mcguire227@gmail.com
//----------------------------------------------------------

function Constants() {

    this.R = 8.3144598 // universal gas constant
    this.R_unit = "J K$^{−1}$ mol$^{−1}$"
    
    
};
	
