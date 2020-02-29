// VCE Project - Simple Particle Class
//
// A simple class to store particle information and apply various
// transformations to simulate particle movement. This particle has
// the functionality required for a rudimentry physics engine. It
// should be used in situations where the particle boundaries are
// simple and external forces are limited. For more complex boundaries
// and external forces, consider using the
// vce_matter_particle.MatterParticle class.
// 
//
// Requires:
// - p5.js or p5.min.js
// - vce_utils.js
// - vce_math.js
//
// Andrew D. McGuire 2018
// a.mcguire227@gmail.com
//----------------------------------------------------------

function Particle(x, y, options) {

    /* Initialise the particle. 

       If an energy arg is passed and vx and vy are null, then the
       velocity vector is computed from the energy.
       
       The energy is split randomly between the x and y components of
       the velocity unless a theta arg is specified.  theta is the
       angle made by the particle trajectory to the normal.

       If vx and vy are given, then these directly specify the
       velocity vector and the energy is ignored.
       
       options attributes:
       x      - particle initial x position
       y      - particle in ital y position
       r      - particle radius     
       energy - particle energy
       vx     - particle x velocity
       vy     - particle y velocity
       theta  - angle made by inital velocity vector (radians)
       acc    - particle acceleration vector (2 element array or p5 vector)
       colour - particle colour for display (Hex CSS)
       init_force - the initial force to apply to the particle (vector)
       buoyancy - the bouyancy to apply to the particle
       perturbation - the number of pixels to perturb the particle at
                      each update (vector)

    */
    let default_options = {
        radius: 5.0,
        shape: {type: 'circle'},
        energy: 1.0,
        v: {x: null, y: null},
        theta: null,
        acc: createVector(0, 0),
        colour: '#2e8ade',
        buoyancy: 0.0,
        perturbation: {x: 0, y: 0},
    };
    options = utils.merge_options(default_options, options);


    // Particle attributes
    this.pos = createVector(x, y); // position vector
    this.shape = options.shape; // shape of the particle to be draw (note: treated as a sphere for collision purposes)
    this.radius = options.radius;              // radius
    this.acc = (utils.isArray(options.acc)) ? createVector(options.acc[0], options.acc[1]) : options.acc; // current acceleration vector
    this.acc_old = this.acc;      // previous acceleration vector
    this.mass = Math.pow(this.radius, 3.0) / 125.0; // mass
    this.energy = options.energy;         // particle kinetic energy
    this.vel = initVelocity(this.mass, this.energy, options.v.x, options.v.y, options.theta);     // velocity vector
    this.colour = options.colour;
    this.buoyancy = options.buoyancy;
    this.perturbation = options.perturbation;

    // Particle Methods
    function initVelocity(mass, energy, vx, vy, theta) {

        // initialises particle velocity based on
        // (in order of priority)
        // 1.) mass and energy (and traj angle theta, if provided)
        // 2.) velocity components vx and vy

        if (vx === null || vy === null) {
            var vres = Math.pow(2.0 * energy / mass, 0.5);
            if (theta === null) {
                theta = 2.0 * Math.PI * Math.random();
            }
            vx = vres * Math.cos(theta);
            vy = -vres * Math.sin(theta);
        }
        return createVector(vx, vy);
    }

    this.update = function (dt) {

        /* Compute the new acceleration, position and
           velocity vectors using the Velocity Verlet algorithm
           with time-step dt. Constant acceleration is
           assumed for the moment. */

        this.update_acc(dt);
        this.update_pos(dt);
        this.update_vel(dt);

    };

    this.show = function () {

        /* Draw the particle as an circle on
           the canvas. Size is controlled by
           the particle radius. */
        push();
        fill(this.colour);
        noStroke();
        translate(this.pos.x, this.pos.y);
        if (this.shape.type === 'circle') {
            ellipse(0, 0, this.radius * 2);
        } else if (this.shape.type === 'polygon') {
            utils.polygon(0, 0, this.radius, this.shape.sides);
        }
        pop();
    };

    this.highlight = function () {

        // Highlight the particle red.
		push();
        fill(256, 1, 1);
        noStroke();
        ellipse(this.pos.x, this.pos.y, 2.0 * this.radius);
        pop();
    };


    this.perturb = function (xmax, ymax) {
        // Randomly perturb the particle position
        // by [0-xmax] in the x-direction and
        // by [0-ymax] in the y-direction.
        // If no args are passed then the particle perturbation
        // attribute is used instead.
        if (typeof xmax == 'undefined') {
            xmax = this.perturbation.x
        }
        if (typeof ymax == 'undefined') {
            ymax = this.perturbation.y
        }
        var dx = xmax * vce_math.getRandomSigned();
        var dy = ymax * vce_math.getRandomSigned();
        this.translate(dx, dy);
    };


    this.translate = function (dx, dy) {
        // Translate the particle.
        this.pos.x = this.pos.x + dx;
        this.pos.y = this.pos.y + dy;
    };


    this.apply_bouyant_force = function (gravity) {
        // Apply buoyancy forces to the particle.
        if (this.buoyancy !== 0.0) {
            this.acc.y = this.acc.y - this.buoyancy;
        }
    };


    this.update_acc = function (dt) {

        /* Update acceleration term. Constant
           acceleration for now so no change.*/
        this.acc_old = this.acc;
    };

    this.update_pos = function (dt) {

        /* Update the particle position
           according to a time-step of size dt.*/

        let pos_1 = this.pos;
        pos_1.add(p5.Vector.mult(this.vel, dt));
        let pos_2 = p5.Vector.mult(this.acc, 0.5 * Math.pow(dt, 2.0));
        this.pos = p5.Vector.add(pos_1, pos_2);
    };

    this.update_vel = function (dt) {

        /* Update the velocity according to
           and its accelerate over time
           interval dt. */

        var v_1 = this.vel;
        var a_sum = p5.Vector.add(this.acc, this.acc);
        var v_2 = p5.Vector.mult(a_sum, 0.5 * dt);
        this.vel = p5.Vector.add(v_1, v_2);
    };

    this.reflect_side = function () {
        // Invert the x velocity component
        this.vel.x = -this.vel.x;
    };

    this.reflect_top = function () {
        // Invert the y velocity component
        this.vel.y = -this.vel.y;
    };

    this.apply_boundary_cond = function (xmax, ymax) {

        /* Update the particle position to
           simulate periodic boundary conditions
           with box bounds (0,xmax), (0,ymax)*/

        if (this.pos.x >= xmax) {
            this.pos.x = this.pos.x - xmax
        }
        if (this.pos.x < 0) {
            this.pos.x = this.pos.x + xmax
        }
        if (this.pos.y >= ymax) {
            this.pos.y = this.pos.y - ymax
        }
        if (this.pos.y < 0) {
            this.pos.y = this.pos.y + ymax
        }
    };

    this.apply_impulse = function (Jx, Jy) {

        /*
           Compute and apply velocity change due to
           an impulse applied to the particle.

           args:
           Jx - scalar x-component of the impulse vector
           Jy - scalar y-component of the impulse vector
        */

        this.vel.x = this.vel.x + (Jx / this.mass);
        this.vel.y = this.vel.y + (Jy / this.mass);
    };


    this.inDomain = function (xmax, ymax) {

        // check if the part lies completely within
        // the domain [0, xmax, 0, ymax]
        return 0 < this.pos.x - this.radius
			&& this.pos.x + this.radius < xmax
			&& 0 < this.pos.y - this.radius
			&& this.pos.y + this.radius < ymax;
    };

    this.total_velocity = function () {
        // |v| = (v_x^2 + v_y^2)^0.5
        return Math.sqrt(Math.pow(this.vel.x, 2) + Math.pow(this.vel.y, 2));
    };

    this.kinetic_energy = function () {
        return 0.5 * this.mass * Math.pow(this.total_velocity(), 2);
    };


} // end of Particle class
