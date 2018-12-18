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
    this.component_flow_tube = [75.482/3.6, 5.6158/3.6, 13.907/3.6, 46.7592/3.6, 0.429/3.6, 0.258/3.6]; // (mol/s)
    this.mole_flow_tube = vce_math.sum(this.component_flow_tube); // tube input molar flow (mol/s)
    this.x_tube = vce_math.normalise(this.component_flow_tube); // tube input mole fractions (-)
    this.T_in_tube = 333.0; // Inlet temp (K)
    this.T_out_tube = 433.5; // Outlet temp (K)
    this.component_tube = new Mixture([new Methanol(), new Water(), new Glycerol(),
				       new FAME(), new Triglyceride(), new FFA()],
				      this.x_tube);

    // Shell side input parameters
    this.component_shell = new Water();
    this.T_in_shell = 473.15 // Inlet temp (K)
    this.T_out_shell = 453.0 // Outlet temp (K)
    

    // Pipe properties 
    this.d_out = 30e-03 // (m)
    this.d_in = 26e-03 // (m)
    this.L = 6.0 // (m)
    this.K_1 = 0.175 // (-) (triangular pitch configuration factor)
    this.n_1 = 2.285 // (-) (triangular pitch configuration factor)
    this.k_w_tubing = 16 // (W/m K)
    this.A_tube = this.d_out*Math.PI*this.L; // (m2)


    // --------------------------------
    // Sequentially Computed parameters
    // --------------------------------
    
    // Tube specific enthanlpy and exchanger duty:
    this.delta_h_tube = vce_math.integrator.simpson(this.component_tube.Cp_l, this.T_in_tube, this.T_out_tube, 50);//  (J/mol)
    this.duty = this.mole_flow_tube*this.delta_h_tube // (W)

    // Shell specific enthalpy change:
    this.delta_h_liq_shell = vce_math.integrator.simpson(this.component_shell.Cp_l, this.T_in_shell, this.T_out_shell, 50); // (J/mol)
    this.lambda_shell = this.component_shell.lambda_vap(this.T_in_shell) // (J/mol)
    this.delta_h_v_shell = 0.0 // (J/mol)
    this.delta_h_shell = this.delta_h_v_shell - this.lambda_shell + this.delta_h_liq_shell; // (J/mol)

    // Shell flow:
    this.mole_flow_shell = -this.duty/this.delta_h_shell; // (mol/s)
    this.mass_flow_shell = this.mole_flow_shell*this.component_shell.amw; // (kg/s)
    this.P_shell = this.component_shell.P_vap(this.T_in_shell); // (Pa)
    
    // Mean temperature difference:
    // - Log mean temp difference
    var delta_T_lm_num = (this.T_in_shell - this.T_out_tube) - (this.T_out_shell - this.T_in_tube);
    var delta_T_lm_exp_num = (this.T_in_shell - this.T_out_tube)/(this.T_out_shell - this.T_in_tube);
    this.delta_T_lm = delta_T_lm_num/Math.log(delta_T_lm_exp_num); // (K)

    // - Corrected temperature diff
    this.R = (this.T_in_shell - this.T_out_shell)/(this.T_out_tube - this.T_in_tube); // (-)
    this.S = (this.T_out_tube - this.T_in_tube)/(this.T_in_shell - this.T_in_tube); // (-)
    var num_1 = Math.sqrt(Math.pow(this.R,2) + 1);
    var num_2 = Math.log((1-this.S)/(1-this.R*this.S))
    var den_1 = this.R - 1
    var den_2_num_exp = 2 - this.S*(this.R + 1 - num_1);
    var den_2_den_exp = 2 - this.S*(this.R + 1 + num_1);
    var den_2 = Math.log(den_2_num_exp/den_2_den_exp);
    this.T_corr_factor = (num_1*num_2)/(den_1*den_2); // (-)
    this.delta_T_m = this.delta_T_lm*this.T_corr_factor; // (K)

    // Heat transfer coefficient
    var U_guess = 420 // (W/m2 K)
    //this.soln = solve_U(this, U_guess, rtol=0.01);

};


function solve(e, U_guess, U_c_guess) {

    // Determine the number of tubes/bundle diameter
    e.A = e.duty/(U_guess*e.delta_T_m); // require heat transfer area
    e.N_tube = Math.ceil(e.A/e.A_tube); // number tubes
    e.D_bundle = e.d_out*Math.pow(e.N_tube/e.K_1,1.0/e.n_1);
    e.T_m_shell = 0.5*(e.T_in_shell + e.T_out_shell); // mean shell temp
    e.T_m_tube = 0.5*(e.T_in_tube + e.T_out_tube); // mean tube temp
	
    // Compute the shell side heat transfer coefficient
    e.T_wall = e.T_m_shell - (U_guess/U_c_guess)*(e.T_m_shell - e.T_m_tube); // tube wall temp
    e.T_m_cond = 0.5*(e.T_wall + e.T_m_shell); // mean condensate temperatue
    e.k_cond = e.component_shell.k(e.T_m_cond);
    e.rho_v_cond = e.component_shell.rho_v(e.P_shell, e.T_m_cond);
    e.rho_l_cond = e.component_shell.rho_l(e.T_m_cond);
    e.mu_l_cond = e.component_shell.mu_l(e.T_m_cond);
    e.vert_tube_loading = e.mass_flow_shell/(e.N_tube*Math.PI*e.d_out);
    e.h_shell_kerr = 0.95*e.k_cond*Math.pow((e.rho_l_cond*(e.rho_l_cond - e.rho_v_cond)*vce_constants.g)/
					    (e.mu_l_cond*e.vert_tube_loading), 1/3);
	
    // pretend we solve it for now, return the update exchanger object
    return e 
    };
