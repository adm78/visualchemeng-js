let settings = {

    frontend: {
        sim_container_id: "#sim_container",

        ke_plot_container: "ke_plot_container",
        coll_rate_plot_container: 'collision_rate_container',
        kernel_plot_container: 'collision_kernel_container',
        plot_update_interval: 2,
        kernel_update_interval: 200,

    },

    backend: {
        r_upper: 20,      // maximum radius
        r_lower: 5,       // minimum radius
        rho_0: 0.00015,   // initial particles/pixel
        n_init_try_max: 10,    // max number of attempt to incept initial particles
        n_add_try_max: 1000, // max number attempt to init new particles
    }

};
