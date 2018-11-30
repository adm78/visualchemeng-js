// VCE Project - vce_component.js
//
// Base component and mixture classes.
//
// Requires:
// - vce_constants.js

// To Do:
// - fill in function body for mixture classes
// 
// Andrew D. McGuire 2018
// a.mcguire227@gmail.com
//----------------------------------------------------------
function Component() {

    // Average Molecular Weight (kg/mol)
    this.amw = null;
    
    // Liquid heat capacity parameters (J/mol.K)
    this.A_l = null;
    this.B_l = null;
    this.C_l= null;
    this.D_l = null;
    this.E_l = null;
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

    
    // Vapour pressure parameters
    this.A_vap_p = null;
    this.B_vap_p = null;
    this.C_vap_p = null;
    this.D_vap_p = null;
    this.E_vap_p = null;
    this.T_limit_lower_vap_p = null; // (K)
    this.T_limit_upper_vap_p = null; // (K)
    this.P_vap = function(T) { // (Pa)
	return Math.exp(this.A_vap_p + (this.B_vap_p/T) + this.C_vap_p*Math.log(T) + this.D_vap_p*Math.pow(T, this.E_vap_p));
    };
    
    
    // Liquid density parameters
    this.A_rho_l = null;
    this.B_rho_l = null;
    this.C_rho_l = null;
    this.D_rho_l = null;
    this.T_limit_lower_rho_l = null; // (K)
    this.T_limit_upper_rho_l = null; // (K)
    this.rho_l_eqn = 1;
    this.rho_l = function(T) { // (mol/m3)
	if (this.rho_l_eqn === 1) {
	    var num = 1000*this.A_rho_l;
	    var den_exp = 1 + (1 - Math.pow(T/this.C_rho_l, this.B_rho_l))
	    var den = Math.pow(this.B_rho_l, den_exp);
	    return num/den; 
	} else if (this.rho_l_eqn === 2) {
	    return (this.A_rho_l + this.B_rho_l*T + this.C_rho_l*Math.pow(T,2) + this.D_rho_l*Math.pow(T,3))*1000.0
	} else {
	    throw new RangeError("Invalid liquid density equation number.")
	}
    };


    // Vapour density (ideal gas)
    this.rho_v = function(P, T) {
	return P*this.amw/(vce_constants.R*T);
    };
    

    // Thermal conductivity parameters
    this.A_k = null;
    this.B_k = null;
    this.C_k = null;
    this.D_k = null;
    this.T_limit_lower_k = null // (K)
    this.T_limit_upper_k = null // (K)
    this.k = function(T) {
	return (this.A_k + this.B_k*T + this.C_k*Math.pow(T,2) + this.D_k*Math.pow(T,3))
    };


    // Liquid viscosity parameters
    this.A_mu_l = null;
    this.B_mu_l = null;
    this.C_mu_l = null;
    this.D_mu_l = null;
    this.E_mu_l = null;
    this.T_limit_lower_mu_l = null;
    this.T_limit_upper_mul_l = null;
    this.mu_l = function(T) { //(Pa.s)
	return Math.exp(this.A_mu_l + (this.B_mu_l/T) + this.C_mu_l*Math.log(T) + T*Math.pow(T, this.E_mu_l));
    };
    
};


function Mixture(components, x) {
    /* A simple mixture class capable of computing average
       thermodynamic properties of component mixtures.

       Note: not all component methods are supported. */

    // Attributes
    this.components = components; // an array of Component objects
    this.x = x // an array of associated mole fractions (doubles)
    this.amw = get_amw(this)

    // Methods
    this.Cp_l = (function(T) {
	// Molar average liquid heat capacity (J/mol.K)
	var Cp_l = 0.0;
	for (var i=0; i < this.components.length; i++) {
	    if (this.components[i].Cp_l(T) === null) {
		return null
	    } else {
		Cp_l = Cp_l + this.x[i]*this.components[i].Cp_l(T)
	    };
	};
	return Cp_l;
    }).bind(this)


    this.rho_l = function(T) { };

    this.rho_v = function(P,T) {};

    this.k = function(T) {};

    this.mu_l = function(T) {};

    
    // Initialisation routines
    function get_amw(obj) {
	var amw = 0.0;
	for (var i = 0; i < obj.components.length; i++) {
	    if (obj.components[i].amw === null) {
		return null;
	    } else {
		amw = amw + obj.x[i]*obj.components[i].amw;
	    };
	};
	return amw;
    };

    

};

