// VCE Project - heat_exchanger_components.js
//
// Heat exchanger custom components.
// Note: the data in this file was take from the material datasheet
// within my undergraduate plant design project (2013).
//
// Requires:
// - vce_component.Component
//
// Andrew D. McGuire 2018
// a.mcguire227@gmail.com
//
// To do:
// - add references
// - add missing tube side components
//
// --------------------------------------------------
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
    /* Water component */
    Component.call(this);

    this.amw = 18.0e-03; // (kg/mol)
    
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


    // Liquid density parameters
    this.A_rho_l = -13.851;
    this.B_rho_l = 0.64038;
    this.C_rho_l = -0.0019124;
    this.D_rho_l = 1.8211e-06;
    this.T_limit_lower_rho_l = 273.16; // (K)
    this.T_limit_upper_rho_l = 353.15; // (K)
    this.rho_l_eqn = 2;

    // Vapour pressure parameters
    this.A_vap_p = 73.649;
    this.B_vap_p = -7258.2;
    this.C_vap_p = -7.3037;
    this.D_vap_p = 4.1653e-06;
    this.E_vap_p = 2;
    this.T_limit_lower_vap_p = 273.16; // (K)
    this.T_limit_upper_vap_p = 647.096; // (K)


    // Liquid viscosity parameters
    this.A_mu_l = -52.843;
    this.B_mu_l = 3703.6;
    this.C_mu_l = 5.866;
    this.D_mu_l = -5.879e-29;
    this.E_mu_l = 10;
    this.T_limit_lower_mu_l = 273.16;
    this.T_limit_upper_mul_l = 646.15;


    // Thermal conductivity parameters
    this.A_k = -0.432;
    this.B_k = 0.0057255;
    this.C_k = -8.078e-06;
    this.D_k = 1.861e-09;
    this.T_limit_lower_k = 273.15 // (K)
    this.T_limit_upper_k = 633.15 // (K)

};


function Glycerol() {
    Component.call(this);    
    // Liquid heat capacity parameters
    this.A_l = 78468;
    this.B_l = 480.71;
    this.C_l = 0.0;
    this.D_l = 0.0;
    this.E_l = 0.0;

};


function FAME() {
    Component.call(this);
    // Liquid heat capacity parameters
    this.A_l = 324000;
    this.B_l = 928;
    this.C_l = 0.0;
    this.D_l = 0.0;
    this.E_l = 0.0;

};


function Triglyceride() {
    Component.call(this);
    // Liquid heat capacity parameters
    this.A_l = 5354.96;
    this.B_l = 5014.624;
    this.C_l = 0.0;
    this.D_l = 0.0;
    this.E_l = 0.0;
};


function FFA() {
    Component.call(this);
    // Liquid heat capacity parameters
    this.A_l = 459000;
    this.B_l = -866;
    this.C_l = 3.74;
    this.D_l = 0.0;
    this.E_l = 0.0;
};


				    
