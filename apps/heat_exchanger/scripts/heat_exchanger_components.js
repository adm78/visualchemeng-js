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
