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

    this.F = 1.0 // molar flow rate (mol/s)
    this.T_in = 60 + 273.15; // (K)
    this.T_out = 160.5 + 273.15; // (K)
    this.component = new Methanol(); 
    
    // Methods
    this.duty = function() {
	return this.F*this.delta_h();
    };
    
    this.delta_h = function() {
	// Enthalpy change (J)
	
	// we need a proper numerical integrator for this part
	return this.component.Cp_liq(0.5*(this.T_out + this.T_in))*(this.T_out - this.T_in);
    };

};

function Methanol() {
    
    // Methanol dummy component
    this.A_liq = 256040;
    this.B_liq = -2741.4;
    this.C_liq = 14.777;
    this.D_liq = -0.0351;
    this.E_liq = 0.00003;
 
    
    this.Cp_liq = function(T) {
	// Cp_liq (J/mol.K)
	return this.A_liq + this.B_liq*T + this.C_liq*Math.pow(T,2) + this.D_liq*Math.pow(T,3) + this.E_liq*Math.pow(T,4);
    };
};
