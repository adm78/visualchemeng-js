// VCE Project - flash.js
//
// This script facilitates the simple modelling of a flash drum
//
// Requires:
// - p5.js or p5.min.js
// - vce_utils.js
//
// Andrew D. McGuire 2017
// a.mcguire227@gmail.com
//----------------------------------------------------------

// --------------------------------------------------
//             visualisation functionality
// --------------------------------------------------
var img; // fash tank image object used by draw
var xmax;
var ymax;
var tops_particles = [];
var bottoms_particles = [];
var feed_particles = [];
var rpart = 2;
var img_shrink_factor = 0.90;

function preload() {
    // preload the flash tank image
    URL = "http://visualchemeng.com/wp-content/uploads/2018/01/flash.svg";
    img = loadImage(URL, pic => print(pic), loadImgErrFix);
}

function setup() {
    
    /* This function is called upon entry to create the
       simulation canvas which we draw onto and run 
       a very simple flash unit test */
    
    var dimensions = getSimBoxDimensions();
    xmax = dimensions.xmax;
    ymax = dimensions.ymax;
    console.log("xmax=",xmax);
    console.log("ymax=",ymax);
    var canvas= createCanvas(xmax, ymax);
    canvas.parent("sim_container")
    var testInput = new Input(0.5, 390.0, [0.5,0.3,0.2], [1.685,0.742,0.532],20);
    var expectedOutput = new Output([0.33940869696634357, 0.3650560590371706, 0.2955352439964858],
				[0.5719036543882889, 0.27087159580558057, 0.15722474980613044],
				    13.814605255477089, 6.185394744522911);
    //img = loadImage("http://visualchemeng.com/wp-content/uploads/2018/01/flash.svg");
    test(testInput,expectedOutput);

    //initialise the particles
    

}

function draw() {

    /* Draws background and img to the canvas.
       This function is continuously called for the
       lifetime of the scripts executions after setup()
       has completed. */
    
    background(51);
//     stroke(255);
    //     strokeWeight(4);
    imageMode(CENTER);
    var sid = getImgScaledDimensions(img);
    image(img, xmax/2 , ymax/2, sid.width, sid.height);

    // draw the particle stream
    
    
    //console.log("you should see the image now...");
    var tops_pos = getTopsPosition(sid);
    var bottoms_pos = getBottonsPositions(sid);
    var testPart1 = new Particle(tops_pos.x, tops_pos.y,rpart);
    var testPart2 = new Particle(bottoms_pos.x, bottoms_pos.y,rpart); 
    testPart1.show();
    testPart2.show();
}

function getTopsPosition(sid) {
    
    // return the position of the tops exit as a p5 vector
    var tops_x = (xmax/2) + 0.5*sid.width;
    var tops_y = (ymax/2.0) - 0.475*sid.height;
    return createVector(tops_x,tops_y);
    

}

function getBottonsPositions(sid) {
    
    // return the position of the bottoms exit as a p5 vector
    var tops_x = (xmax/2.0) + 0.5*sid.width;
    var tops_y = (ymax/2.0) + 0.475*sid.height;
    return createVector(tops_x,tops_y);

}

function getImgScaledDimensions(img) {

    // return the scaled image dimensions
    var scaled_height =  ymax*img_shrink_factor;
    var scaled_width = img.width*ymax/img.height;
    return { width : scaled_width,
	     height: scaled_height }

}

// --------------------------------------------------
//              flash tank calculations
// --------------------------------------------------

function RachfordRiceSum(beta,z,K) {
    
    /* Compute Rachford Rice sum
       http://folk.ntnu.no/skoge/bok/mer/flash_english_edition_2009

       args:
       beta - vapour liquid split (float)
       z    - feed composition array
       K    - component equilibrium constant array
    */

    var result = 0.0;
    var arrayLength = z.length;
    for (var i = 0; i < arrayLength; i++) {
	result = result + RachfordRiceElem(z[i],K[i],beta);
    }
    return result;   
}

function RachfordRiceElem(zi,Ki,beta) {

    /* Compute a single term of the rachford Rice sum
       
       args:
       beta - vapour liquid split (float)
       zi   - feed composition point
       Ki   - component equilibrium constant 
    */ 
    var result = zi*(Ki-1)/(1+beta*(Ki-1));
    return result;
}

function RachfordRiceBeta(beta, args) {
    // Wrapper function for RachfordRiceSum
    // that ensure it has a fixed number of args
    // args = [z,k]
    return RachfordRiceSum(beta, args[0], args[1]);    
}


function getX(z,K,beta) {
    // Generate the liquid composition array
    var x = []
    var arrayLength = z.length;
    for (var i = 0; i < arrayLength; i++) {
	x[i] = z[i]/(1+beta*(K[i]-1));
    }
    return x
}

function getY(x,K) {
    // Generate the vapour composition array
    var y = []
    var arrayLength = x.length;
    for (var i = 0; i < arrayLength; i++) {
	y[i] = K[i]*x[i];
    }
    return y
}

function Input(P,T,z,K,F) {

    // A simple class to store flash tank conditions
    this.P = P; // pressure [bar]
    this.T = T; // temperature [K[
    this.z = z; // inlet mole fraction array
    this.K = K; // equilibrium constant array
    this.F = F; // feed flowrate [kmol/hr]

}

function Output(x,y,V,L) {

    // A simple class to store flash tank solution
    // conditions
    this.x = x // liquid output composition array
    this.y = y // vapour output composition array
    this.V = V // vapour flowrate [kmol/hr]
    this.L = L // liquid flowaret [kmol/hr]

}

function test(input, expected) {

    // A simple unit test to make sure the flash tank works
    // as expected.
   
    // solve the flash system
    var args = [input.z,input.K];
    var beta_solution = newtonsMethod(RachfordRiceBeta,0.5,args);
    var beta = beta_solution[1];
    var V = beta*input.F;
    var L = input.F - V;
    var x = getX(input.z,input.K,beta);
    var y = getY(x,input.K);
    var Solution = new Output(x,y,V,L);
    
    // check that the solution is okay (only flowrates for now)   
    if (Solution.V !== expected.V || Solution.L !== expected.L) {
	console.log("Flash unit test failed: incorrect flowrates.");
	console.log("Expected: ", expected);
	console.log("Got: ", Solution);
	return 1;
    } 

    // test passed
    console.log("Flash unit test passed!");
    console.log("Got: ", Solution);
    return 0;

}


