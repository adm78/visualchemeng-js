// VCE Project - edmd_kinetic_energy_plot.js
//
//
// Requires:
// - plotly.js
//
// TODO: use real kernel data in the plot
//
// Andrew D. McGuire 2019
// a.mcguire227@gmail.com
//----------------------------------------------------------
function CollisionKernelPlot(container_id) {

    this.__init__ = function () {
        this._container_id = container_id;
        Plotly.newPlot(this._container_id, this._initialise_traces(), this._layout());
    };

    this.update = function (simulation) {
        var latest_data = this._get_latest_data(simulation);
        Plotly.restyle(this._container_id, latest_data);
    };


    this._layout = function () {
        return {
            title: "size dependent collision frequency",
            titlefont: {
                family: 'Roboto, serif',
                size: 18,
                color: 'white'
            },
            margin: {
                l: 20,
                r: 20,
                b: 0,
                t: 35,
                pad: 20
            },
            scene: {
                xaxis: {
                    title: 'r1',
                    gridcolor: '#44474c',
                    titlefont: {
                        family: 'Roboto, serif',
                        size: 18,
                        color: 'white'
                    },
                    tickfont: {color: 'white'}
                },
                yaxis: {
                    title: 'r2',
                    gridcolor: '#44474c',
                    titlefont: {
                        family: 'Roboto, serif',
                        size: 18,
                        color: 'white'
                    },
                    tickfont: {color: 'white'}
                },
                zaxis: {
                    title: 'C(r1, r2)',
                    titlefont: {
                        family: 'Roboto, serif',
                        size: 18,
                        color: 'white'
                    },
                    tickfont: {color: 'white'}
                },
                camera: {
                    eye: {
                        x: 1.8,
                        y: 1.8,
                        z: 1.0,
                    }
                }
            },
            hoverlabel: {bordercolor: '#333438'},
            plot_bgcolor: '#333438',
            paper_bgcolor: '#333333',
        };
    };


    this._initialise_traces = function () {
        // todo: add some real data or no data at all
        let trace = {
            type: "surface",
            x: [0, 10],
            y: [0, 10],
            z: [[0, 0], [0, 0]],
            color: 'green',
            // opacity: 0.4,
            showscale: false
        };
        return [trace];
    };


    this._get_latest_data = function (simulation) {

        let coll_stats = new CollisionStats();
        let freq_data = coll_stats.collision_frequency(simulation.event_log, simulation.volume(), simulation.particles,
            simulation.config);
        return {x: freq_data.x, y: freq_data.y, z: [freq_data.z]};
        // Note: z data needs to be wrapped, since we could be updating multiple traces at a time.
    };

    this.__init__();
}
