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
var img_shrink_factor = 0.60;
var testPart1;
var testPart2;
var paused_log = true;
var ndraws = 0;
var outlet_freq = 1;
var gravity = 0.02;

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

    // draw the flash schematic to stream
    background(51);
    imageMode(CENTER);
    var sid = getImgScaledDimensions(img);
    image(img, xmax/2 , ymax/2, sid.width, sid.height);

    //initialise the particles
    // var tops_pos = getTopsPosition(sid);
    // var bottoms_pos = getBottonsPositions(sid);
    // testPart1 = new Particle(tops_pos.x,tops_pos.y,rpart,1.0,2.0,0.0,null,createVector(0,-0.01));
    // testPart2 = new Particle(bottoms_pos.x,bottoms_pos.y,rpart,1.0,2.0,0.0,null,createVector(0,0.01)); 

}

function draw() {

    /* Draws background and img to the canvas.
       This function is continuously called for the
       lifetime of the scripts executions after setup()
       has completed. */
    
    // draw the particle stream
    background(51);
    imageMode(CENTER);
    var sid = getImgScaledDimensions(img);
    image(img, xmax/2 , ymax/2, sid.width, sid.height);
    showAllParticles();

    
    // update particle streams
    if (!(paused_log)) {

	// update exisiting particle positions
	if (tops_particles.length !== 0 && bottoms_particles.length !== 0) {
	    updateAllParticles(0.5);
	    removeLostParticles();
	}

	// add new particles at desired freq
	if (ndraws % outlet_freq === 0) {
	    tops_pos = getTopsPosition(sid);
	    var new_tops_part = new Particle(tops_pos.x,tops_pos.y,rpart,1.0,2.0,0.0,null,createVector(0,-gravity));
	    tops_particles.push(new_tops_part);
	    var bottoms_pos = getBottonsPositions(sid);
	    var new_bottoms_part = 	new Particle(bottoms_pos.x,bottoms_pos.y,rpart,1.0,2.0,0.0,null,createVector(0,gravity));
	    bottoms_particles.push(new_bottoms_part);
	};

	// prevent potential overflow
	ndraws = ndraws + 1;
	if (ndraws === 10000) {
	    ndraws = 0;
	}
    };
};

function showAllParticles() {

    // draw the particle to the canvas
    
    stroke(255);
    strokeWeight(1);
    for (i = 0; i < tops_particles.length; i++) {
	tops_particles[i].show();
    };
    for (i = 0; i < bottoms_particles.length; i++) {
	bottoms_particles[i].show();
    };
};

function updateAllParticles(dt) {

    //move all the particles forward in time by dt
    for (i = 0; i < tops_particles.length; i++) {
	tops_particles[i].update(dt);
	tops_particles[i].perturb(rpart,rpart);
    };
    for (i = 0; i < bottoms_particles.length; i++) {
	bottoms_particles[i].update(dt);
	bottoms_particles[i].perturb(rpart/5.0,rpart/5.0);
    };
};    

function removeLostParticles() {
       
    for (i = 0; i < tops_particles.length; i++) {
	if (!particleInSimBox(tops_particles[i])) {
	    tops_particles.splice(i,1);
	};
    };
    for (i = 0; i < bottoms_particles.length; i++) {
	if (!particleInSimBox(bottoms_particles[i])) {
	    bottoms_particles.splice(i,1);
	};
    };
};

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
    var scaled_width = img.width*scaled_height/img.height;
    return { width : scaled_width,
	     height: scaled_height }

}

function particleInSimBox(part) {
    
    // check if the part lies completely within the sim box
    if (0 < part.pos.x - part.radius
	&& part.pos.x + part.radius < xmax
	&& 0 < part.pos.y - part.radius
	&& part.pos.y+ part.radius < ymax) {
	return true
    };
    return false;
};

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

//--------------------------------------------------------------------
//                  UI event listners
//--------------------------------------------------------------------
// run button
$('#run').click(async function(){

    // run/pause button functionality
    console.log("You just clicked stream/pause!");
    paused_log = !(paused_log);
    if (paused_log) {
	$("#run").text('Run');
    }
    else {
	$("#run").text('Pause');
    }
});
