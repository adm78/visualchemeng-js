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
	// Exchanger duty (W)
	return this.F*this.delta_h();
    };
    
    this.delta_h = function() {
	// Enthalpy change (J)
	return vce_math.integrator.simpson(this.component.Cp_liq, this.T_in, this.T_out, 50)
    };

};

function Methanol() {
    
    // Methanol dummy component
    this.A_liq = 256040;
    this.B_liq = -2741.4;
    this.C_liq = 14.777;
    this.D_liq = -0.0351;
    this.E_liq = 0.00003;
 
    
    this.Cp_liq = (function(T) {
	// Cp_liq (J/mol.K)
	return this.A_liq + this.B_liq*T + this.C_liq*Math.pow(T,2) + this.D_liq*Math.pow(T,3) + this.E_liq*Math.pow(T,4);
    }).bind(this)
    // @Note: 'bind' allows this method to be used by callers other than
    // Methanol, whilst still pointing `this` at Methanol (instead of the
    // caller object instance). See
    // https://stackoverflow.com/a/20279485/4530680 for more info.
};
