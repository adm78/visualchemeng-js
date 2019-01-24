// VCE Project - mt_frontend.js
//
// Mccbabe theile testing.
//
//
// Requires:
//
// Andrew D. McGuire 2019
// a.mcguire227@gmail.com
//
//----------------------------------------------------
var options = {
    xf : 0.5,
    xd : 0.95,
    xb : 0.05,
    P : 101.3e3, // Pa
    q : 7.0/6.0,
    R : 6.692,
    y_eq : vce_math.interp_1d(data.equilibrium_data.x, data.equilibrium_data.y)
};
var column = new DistMcCabeTheile(options);
plot_mccabe_thiele_diagram(column, 'mccabe_thiele_container');
 

