// VCE Project - Component class
//
// A base component class.
//
// Requires:
// - no requirements

// To Do:
// - add a mixture class to enable multi-component streams with the
//   same functionality as Component objects. 
// 
// Andrew D. McGuire 2018
// a.mcguire227@gmail.com
//----------------------------------------------------------

function Component() {

    // Liquid heat capacity parameters
    this.A_l = null;
    this.B_l = null;
    this.C_l= null;
    this.D_l = null;
    this.E_l = null;
    
    
    // @Note: 'bind' allows this method to be used by callers other
    // than `Component`, whilst still pointing `this` at `Component`
    // (instead of the caller object instance). See
    // https://stackoverflow.com/a/20279485/4530680 for more info.        
    this.Cp_l = (function(T) {
	// Liquid heat capacity (J/mol.K)
	return (this.A_l + this.B_l*T + this.C_l*Math.pow(T,2) + this.D_l*Math.pow(T,3) + this.E_l*Math.pow(T,4))/1000.0;
    }).bind(this)


    // Heat of vaporisation parameters
    this.A_vap = null;
    this.B_vap = null;
    this.C_vap = null;
    this.D_vap = null;
    this.T_limit_lower_vap = null;
    this.T_limit_upper_vap = null;
    
    this.lambda_vap = function(T) {
	// Heat of vaporisation (J/mol)
	var T_r = T/this.T_limit_upper_vap;
	var exponent = this.B_vap + this.C_vap*T_r + this.D_vap*Math.pow(T_r, 2);
	return this.A_vap*Math.pow((1.0 - T_r), exponent)/1000.0;
    };
};
