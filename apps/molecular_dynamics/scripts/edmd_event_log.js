// VCE Project - edmd_event_log.js
//
//
// Requires:
// - plotly.js
//
//
// Andrew D. McGuire 2019
// a.mcguire227@gmail.com
//----------------------------------------------------------
function EventLog() {
    // A data storage/analysis class for historical events
    //
    // For performance reasons, we assume that events go in in
    // chronological order.

    this.__init__ = function (t_start) {
        this._t_start = t_start;
        this._t_current = t_start;
        this._events = [];
        this._max_stored_events = 2000; //TODO: move to config
    };

    this.event = function(i) {
        return this._events[i];
    };

    this.t = function () {
        return this._t_current;
    };

    this.reset = function (t_start) {
        this.__init__(t_start);
    };

    this.add_event = function (event) {
        if (this.n_events > this._max_stored_events) {
            this._events.shift();
            this._t_start = this._events[0].t;
        }
        this._events.push(event);
    };

    this.update_current_time = function (time) {
        this._t_current = time;
    };

    this.n_events = function () {
        return this._events.length
    };


    this.average_collision_rate = function () {
        if (this._events.length < 1) {
            return 0;
        } else {
            var dt = this._t_current - this._t_start;
            return this.n_events() / dt;
        }
    };

    this.dt = function () {
        return this._t_current - this._t_start;
    };

    this.__init__(t_start);
}
