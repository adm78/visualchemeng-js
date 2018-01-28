// VCE Project - flash.js
//
// This script facilitates the simple modelling of a flash drum
//
// Requires:
// - p5.js or p5.min.js
// - vce_utils.js
// - vce_particle.js
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
var feed_stream = new Ensemble();
var tops_stream = new Ensemble();
var bottoms_stream = new Ensemble();
var feed_pos;
var tops_pos;
var bottoms_pos;
var sid;

// visualt set-up globals
var rpart = 1.5;
var img_shrink_factor = 0.60;
var paused_log = true;
var ndraws = 0;
var outlet_freq = 1;
var gravity = 0.02;
var component_colours = ['#2e8ade','#de912e','#2ede71']
var flash_solution;
var pout = 10; // number of particle to output at a time
var pspeed = 1.0;
var kpert = 4.0;
var fr = 40;
var testInput;
var output_delay = 60;
var e_coeff = 0.3; // liquid-wall coefficent of restitution (kind of)

function preload() {
    // preload the flash tank image
    //URL = "http://visualchemeng.com/wp-content/uploads/2018/01/flash.svg";
    URL = "flash.svg";
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
    testInput = new Input(0.5, 390.0, [0.5,0.3,0.2], [1.685,0.742,0.532],20);
    var expectedOutput = new Output([0.33940869696634357, 0.3650560590371706, 0.2955352439964858],
				[0.5719036543882889, 0.27087159580558057, 0.15722474980613044],
				    13.814605255477089, 6.185394744522911);
    flash_solution = (test(testInput,expectedOutput)).solution;

    // draw the bar charts to screen
    var feed_data = [{
    x: ['z1', 'z2', 'z3'],
	y: [testInput.z[0], testInput.z[1], testInput.z[2]],
	type: 'bar',
    }];
    
    var tops_data = [{
	x: ['y1', 'y2', 'y3'],
	y: [flash_solution.y[0], flash_solution.y[1], flash_solution.y[2]],
	type: 'bar',
    }];
    
    var bottoms_data = [{
	x: ['x1', 'x2', 'x3'],
	y: [flash_solution.x[0], flash_solution.x[1], flash_solution.x[2]],
    type: 'bar',
    }];

    bar_chart_layout.yaxis.range = [0,getMaxComposition(flash_solution,testInput)];
    Plotly.newPlot('feedplotDiv', feed_data, bar_chart_layout);
    Plotly.newPlot('topsplotDiv', tops_data, bar_chart_layout);
    Plotly.newPlot('bottomsplotDiv', bottoms_data, bar_chart_layout);
    
    
    // draw the flash schematic to screen
    background(51);
    imageMode(CENTER);
    sid = getImgScaledDimensions(img);
    image(img, xmax/2 , ymax/2, sid.width, sid.height);
    frameRate(fr);

    // pre-compute key canvas positions
    feed_pos = getFeedPosition(sid,xmax);
    tops_pos = getTopsPosition(sid);
    bottoms_pos = getBottomsPosition(sid);

    
}

function draw() {

    /* Draws background and img to the canvas.
       This function is continuously called for the
       lifetime of the scripts executions after setup()
       has completed. */


    // draw the tanks and particle streams
    background(51);
    imageMode(CENTER);
    image(img, xmax/2 , ymax/2, sid.width, sid.height);
    feed_stream.show();
    tops_stream.show();
    bottoms_stream.show();


    // update particle streams
    if (!(paused_log)) {

	// update exisiting particle positions
	feed_stream.update(pspeed);
	tops_stream.update(pspeed);
	bottoms_stream.update(pspeed);
	feed_stream.removeOutliers(0.5*(xmax-sid.width),2*ymax);
	tops_stream.removeOutliers(xmax,ymax);
	bottoms_stream.applyBoundary(0.98*ymax,e_coeff);
	bottoms_stream.removeOutliers(xmax,2*ymax);
	tops_stream.perturb(kpert/1.0,kpert/1.0);
	bottoms_stream.perturb(kpert/4.0,kpert/4.0);
	
	// add new particles at desired freq
    	if (ndraws % outlet_freq === 0) {
	    
	    var colour = chooseColoursFromComposition(component_colours, flash_solution,testInput)

	    // handle the feed stream
	    for (i=0; i < pout; i++) {
		var new_feed_part1 = new Particle(feed_pos.x,feed_pos.y+0.01*sid.height,rpart,1.0,2.0,0.0,null,createVector(0,0), colour.z);
		var new_feed_part2 = new Particle(feed_pos.x,feed_pos.y-0.01*sid.height,rpart,1.0,2.0,0.0,null,createVector(0,0), colour.z);
		feed_stream.addParticle(new_feed_part1);
		feed_stream.addParticle(new_feed_part2);
	    };

	    // handle the delayed outlet and inlet streams
	    if (feed_stream.outliers >  output_delay) {
		for (i=0; i < pout; i++) {
		    var new_tops_part = new Particle(tops_pos.x,tops_pos.y,rpart,1.0,2.0,0.0,null,createVector(0,-gravity), colour.y);
		    var new_bottoms_part = new Particle(bottoms_pos.x,bottoms_pos.y,rpart,1.0,2.0,0.0,null,createVector(0,gravity), colour.x);
    		    tops_stream.addParticle(new_tops_part);
    		    bottoms_stream.addParticle(new_bottoms_part);
		};
		
	    };
    	};

    	// prevent potential overflow
    	ndraws = ndraws + 1;
    	if (ndraws === 10000) {
    	    ndraws = 0;
    	};
    };
};

function restart() {
    
    // effectively reload the page
    paused_log = true;
    feed_stream = new Ensemble();
    tops_stream = new Ensemble();
    bottoms_stream = new Ensemble();


}

function getMaxComposition(s, input) {

    // return the maximum composition value
    // across all streams
    var max = input.z[0];
    for (var i = 0; i < input.length; i++) {
	if (input.z[i] > max) {
	    max = input.z[i];
	};
	if (s.x[i] > max) {
	    max = s.x[i];   
	}
	if (s.y[i] > max) {
	    max = s.y[i];   
	}
    };
    return max;

}

function getFeedPosition(sid,xmax) {

    // return the position the feed stream should start
    var feed_x =  0.75*(0.5*xmax - 0.5*sid.width);
    var feed_y = (ymax/2.0)+0.05*sid.height;
    return createVector(feed_x,feed_y);
}


function getTopsPosition(sid) {

    // return the position of the tops exit as a p5 vector
    var tops_x = (xmax/2) + 0.5*sid.width;
    var tops_y = (ymax/2.0) - 0.475*sid.height;
    return createVector(tops_x,tops_y);

}

function getBottomsPosition(sid) {

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

function chooseColoursFromComposition(colours, s, input) {

    // select a particle colour from a list, based on
    // compositions on flash solution s (Output object).
    var x_cum = [s.x[0]];
    var y_cum = [s.y[0]];
    var z_cum = [input.z[0]];

    // generate cumulative composition lists
    for (var i = 1; i < s.x.length; i++) {
	x_cum[i] = x_cum[i-1] + s.x[i];
	y_cum[i] = y_cum[i-1] + s.y[i];
	z_cum[i] = z_cum[i-1] + input.z[i];
    };
    // choose a component
    var rndx = Math.random();
    for (var i = 0; i < x_cum.length; i++) {
	if (rndx <= x_cum[i]) {
	    var i_x = i;
	    break;
	}
    };
    var rndy = Math.random();
    for (var i = 0; i < y_cum.length; i++) {
	if (rndy <= y_cum[i]) {
	    var i_y = i;
	    break;
	}
    };
    var rndy = Math.random();
    for (var i = 0; i < y_cum.length; i++) {
	if (rndy <= y_cum[i]) {
	    var i_y = i;
	    break;
	}
    };
    var rndz = Math.random();
    for (var i = 0; i < z_cum.length; i++) {
	if (rndz <= z_cum[i]) {
	    var i_z = i;
	    break;
	}
    };
    return {x : colours[i_x],
	    y : colours[i_y],
	    z : colours[i_z]};
};
// --------------------------------------------------
//              composition graph layout
// --------------------------------------------------
var bar_chart_layout = {
    
    margin : {
	l: 30,
	r: 30,
	b: 30,
	t: 20,
	pad: 5
    },
    hoverlabel: {bordercolor:'#333438'},
    plot_bgcolor: '#333438',
    paper_bgcolor: '#333438',
    marker: {
	color : component_colours
    },
    height:200,
    xaxis: {
	showgrid: false,
	gridcolor: '#44474c',
	tickmode: 'auto',
	titlefont: {
	    family: 'Roboto, serif',
	    size: 18,
	    color: 'white'
	},
	tickfont: {color:'white'}
    },
    yaxis: {
	showgrid: true,
	gridcolor: '#44474c',
	tickmode: 'auto',
	titlefont: {
	    family: 'Roboto, serif',
	    size: 18,
	    color: 'white'
	},
	tickfont: {color:'white'}
    },
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
	return {success:1,
		solution:Solution};
    }

    // test passed
    console.log("Flash unit test passed!");
    console.log("Got: ", Solution);
    return {success:1,
	    solution:Solution};

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

// restart button
$('#restart').click(async function(){

    // restart button functionality
    console.log("You just clicked restart!");
    restart();
});

// resize on full page load (jquery)
$(document).ready(function () {
    //resizeWindow()
});
