// VCE Project - Separtor class
//
// A simple class to store input/output information and apply
// various transformations to simulate a separation unit operation.
//
// Requires:
// - vce_utils.js
//
// Andrew D. McGuire 2018
// a.mcguire227@gmail.com
//----------------------------------------------------------

function Separator(x=null,y=null,z=null,L=null,V=null,F=null,T=null,
		   P=null,K=null) {

    /* Initialise the separator. 

    */
 

    // Particle attributes
    this.x = x;
    this.y = y;
    this.z = z;
    this.L = L;
    this.V = V;
    this.F = F;
    this.T = T;
    this.P = P;
    this.K = K;
    
} // end of Separator class
