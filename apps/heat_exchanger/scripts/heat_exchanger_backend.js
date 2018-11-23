// VCE Project - heat_exchanger_backend.js
//
// WIP Shell & Tube Heat Exchanger Backend Class
//
//
// Requires:
// - vce_math.js
//
//
// Andrew D. McGuire 2018
// a.mcguire227@gmail.com
//
// To do:
// - everything...
//
// --------------------------------------------------
function HeatExchanger() {

    // Assumptions
    // - inlet steam is not super-heated

    // Tube side input parameters
    var tube_component_flowrates = [75.482, 5.6158, 13.907, 46.7592, 0.429, 0.258]; // (kmol/hr)
    this.mole_flow_tube = vce_math.sum(tube_component_flowrates)*1000.0/3600; // Inlet tube molar flow (mol/s)
    this.tube_x = get_x(tube_component_flowrates, this.mole_flow_tube); // input mole fractions (-)
    this.T_in_tube = 333.0; // Inlet temp (K)
    this.T_out_tube = 433.5; // Outlet temp (K)
    this.component_tube = new Mixture([new Methanol(), new Water(), new Glycerol(),
				       new FAME(), new Triglyceride(), new FFA()],
				      this.tube_x);

    // Shell side input parameters
    this.component_shell = new Water();
    this.T_in_shell = 473.15 // Inlet temp (K)
    this.T_out_shell = 453.0 // Outlet temp (K)

    
    // Computed parameters
    this.delta_h_tube = vce_math.integrator.simpson(this.component_tube.Cp_l, this.T_in_tube, this.T_out_tube, 50);// specific enthalpy change (J/mol)
    this.duty = this.mole_flow_tube*this.delta_h_tube // Exchanger duty (W)
    this.delta_h_liq_shell = vce_math.integrator.simpson(this.component_shell.Cp_l, this.T_in_shell, this.T_out_shell, 50); // (J/mol)
    this.lambda_shell = this.component_shell.lambda_vap(this.T_in_shell) // (J/mol)
    this.delta_h_v_shell = 0.0 // (J/mol)
    this.delta_h_shell = this.delta_h_v_shell - this.lambda_shell + this.delta_h_liq_shell; // (J/mol)
    this.mole_flow_shell = -this.duty/this.delta_h_shell; // Shell molar flowrate (mol/s)
    this.mass_flow_shell = this.mole_flow_shell*this.component_shell.amw; // (kg/s)


    // Initialisation methods
    function get_x(component_flowrates, total_flowrate) {
	var x = [];
	for (var i=0; i < component_flowrates.length; i++) {
	    x.push((component_flowrates[i]*1000.0/3600)/total_flowrate);
	};
	return x;
    };
};
