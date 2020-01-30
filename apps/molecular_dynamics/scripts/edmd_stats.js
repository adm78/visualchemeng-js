function CollisionStats() {

    this.collision_frequency = function(event_log, volume, particle_list, config) {

    	// C(x,y) = n_coll(x,y)/(dt*n(x)*n(y))
		const r_max = config.r_upper;
		const r_min = 0;
		const n_bins = 10;

		// Note: each sieve size represents the smallest particle (radius) the sieve (bin) can hold
		const sieve_sizes = vce_math.linspace(r_min, r_max, n_bins);
		let n_coll = vce_math.zeros_2d([sieve_sizes.length, sieve_sizes.length]);


		// Compute the number of collisions for each (x,y) radii pair
		for (let i = 0; i < event_log.n_events; i++) {
			let event = event_log.n_events[i];
			if (!event.is_wall_collision()) {
				let x_sieve_index = this._get_sieve_index(event.part_1.radius, sieve_sizes);
				let y_sieve_index = this._get_sieve_index(event.part_2.radius, sieve_sizes);
				n_coll[x_sieve_index][y_sieve_index] = n_coll[x_sieve_index][y_sieve_index] + 1;
			}
		}

		// Compute the number of particle in each radii bin
		let n = vce_math.zeros_1d(n_bins);
		for (let i = 0; i < particle_list.length; i++) {
			let sieve_index = this._get_sieve_index(particle_list[i].radius, sieve_sizes);
			n[sieve_index] = n[sieve_index] + 1;
		}


		// Normalise
		let z = vce_math.zeros_2d([n_bins, n_bins]);
		if (event_log.dt > 0) {
			for (let i = 0; i < sieve_sizes.length; i++) {
				for (let j = 0; j < sieve_sizes.length; j++) {
					if (n[i] > 0 && n[j] > 0) {
						z[i][j] = n_coll[i][j] / (n[i] * n[j] * event_log.dt)
					}
				}
			}
		}
		return {x: sieve_sizes, y: sieve_sizes, z: z}
    };

    this._get_sieve_index = function(value, sieve_list) {
    	for (let sieve_index = 0; sieve_index < sieve_list.length - 1; sieve_index++) {
    		if (sieve_list[sieve_index + 1] > value > sieve_list[sieve_index]) {
    			return sieve_index;
			}
		}
    	return sieve_list.length - 1
	};


}
