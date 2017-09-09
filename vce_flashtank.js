//=================================================================
// vce_flashtank.js
//
// This script facilitates the simple modelling of a flash drum
//
// Andrew D. McGuire 2017
// amcguire227@gmail.com
//
// ================================================================

// --------------------------------------------------
//             visualisation functionality
// --------------------------------------------------
var img;
function preload() {
  img = loadImage("../assets/raster/flash_base.png");
}


function setup() {
    var canvas= createCanvas(windowWidth,windowHeight);
   
    // window sizing
    // var xmax = min(772+28,windowWidth-2*28);
    // var ymax = xmax*0.618;

}

function draw() {
    background(51);
    stroke(255);
    strokeWeight(4);
    image(img, 0 , 0);
    // for (i = 0; i < particles.length; i++) {
    // 	particles[i].show(1);
    // }
    // loadImage("../assets/raster/flash_bare.png", function(img) {
    // 	image(img, 0, 0);
    // });
}



// --------------------------------------------------
//              flash tank calculations
// --------------------------------------------------

// var AC_etoh = [5.24677,1598.673,-46.424]; //bar, K
// var AC_meoh = [5.20277,1580.080,-33.650]; //bar
// var AC_h2o = [4.6543,1435.264,-64.848]; //bar, K
//var K = [P_Antoine(T,AC_meoh)/P, P_Antoine(T,AC_h2o)/P];

function RachfordRiceSum(beta,z,K) {
    // http://folk.ntnu.no/skoge/bok/mer/flash_english_edition_2009
    //compute the vap and liq split
    var result = 0.0;
    var arrayLength = z.length;
    for (var i = 0; i < arrayLength; i++) {
	result = result + RachfordRiceElem(z[i],K[i],beta);
    }
    return result;   
}

function RachfordRiceElem(zi,Ki,beta) {
    var result = zi*(Ki-1)/(1+beta*(Ki-1));
    return result;
}

function RachfordRiceBeta(beta, args) {
    // wrapper function for RachfordRiceSum
    // that ensure it has a fixed number of args
    // args = [z,k]
    return RachfordRiceSum(beta, args[0], args[1]);    
}


function getX(z,K,beta) {
    var x = []
    var arrayLength = z.length;
    for (var i = 0; i < arrayLength; i++) {
	x[i] = z[i]/(1+beta*(K[i]-1));
    }
    return x
}

function getY(x,K) {
    var y = []
    var arrayLength = x.length;
    for (var i = 0; i < arrayLength; i++) {
	y[i] = K[i]*x[i];
    }
    return y
}

function test() {
    
    // example taken from
    // http://folk.ntnu.no/skoge/bok/mer/flash_english_edition_2009

    // conditions
    var P = 0.5;//bar
    var T = 390.0;//K
    var z = [0.5,0.3,0.2];
    var K = [1.685,0.742,0.532]  //pentane, haxane, cyclohexane
    var F = 20; //kmol/hr
    var args = [z,K];
    
    // solution
    var beta_solution = newtonsMethod(RachfordRiceBeta,0.5,args);
    console.log("beta_solution = ", beta_solution);
    var beta = beta_solution[1];
    var V = beta*F;
    var L = F - V;
    var x = getX(z,K,beta);
    var y = getY(x,K);
    console.log("x = ",x);
    console.log("y = ",y);
    console.log("V = ",V);
    console.log("L = ",L);
    return 0;
}

test()
