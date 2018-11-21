// VCE Project - heat_exchanger_backend.js
//
// WIP Shell & Tube Heat Exchanger Backend Class
// simplications for now:
// - single component (methanol)
//
//
// Requires:
// - Nothing yet...
//
//
// Andrew D. McGuire 2018
// a.mcguire227@gmail.com
//
// To do:
// - everything
//
// --------------------------------------------------
function HeatExchanger() {

    // Assumption
    // - inlet steam is not super-heated

    // Tube side parameters
    this.F_tube = 1.0; // molar flow rate (mol/s)
    this.T_in_tube = 60 + 273.15; // Inlet temp (K)
    this.T_out_tube = 160.5 + 273.15; // Outlet temp (K)
    this.component_tube = new Methanol();

    // Shell side parameters
    this.component_shell = new Water();
    this.T_in_shell = 473.15 // Inlet temp (K)
    this.T_out_shell = 453.0 // Outlet temp (K)
    
    
    // Methods
    this.duty = function() {
	// Exchanger duty (W)
	return -this.F_tube*this.delta_h_tube();
    };


    this.F_shell = function() {
	// Shell molar flowrate (mol/s)
	return this.duty()/this.delta_h_shell();
    };

    
    this.delta_h_tube = function() {
	// Enthalpy change (J)
	return vce_math.integrator.simpson(this.component_tube.Cp_l, this.T_in_tube, this.T_out_tube, 50);
    };


    this.delta_h_shell = function() {
	return this.delta_h_v_shell() - this.lambda_shell() + this.delta_h_liq_shell(); 
    };


    this.delta_h_v_shell = function() {
	// We assume that the incoming steam in saturated (not superheated)
	return 0.0
    };


    this.lambda_shell = function() {
	return this.component_shell.lambda_vap(this.T_in_shell)
    };


    this.delta_h_liq_shell = function() {
	return vce_math.integrator.simpson(this.component_shell.Cp_l, this.T_in_shell, this.T_out_shell, 50);
    };


};

function Methanol() {    
    /* Methanol component */
    Component.call(this);

    // Liquid heat capacity parameters
    this.A_l = 256040;
    this.B_l = -2741.4;
    this.C_l = 14.777;
    this.D_l = -0.0351;
    this.E_l = 0.00003;
};


function Water() {
    // Water component
    Component.call(this);

    
    // Liquid heat capacity parameters
    this.A_l = 276370;
    this.B_l = -2090.1;
    this.C_l = 8.125;
    this.D_l = -0.014116;
    this.E_l = 9.37e-06;

    
    // Heat of vaporisation parameters
    this.A_vap = 56600000;
    this.B_vap = 0.612041;
    this.C_vap = -0.625697;
    this.D_vap = 0.398804;
    this.T_limit_lower_vap = 273.16;  //(K)
    this.T_limit_upper_vap = 647.096; //(K)



};
