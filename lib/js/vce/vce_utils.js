// VCE Project - vce_utils.js
//
// This file serves as a library of useful functions for the
// visualchemeng project
//
// Requires:
// - plotly.js or minified equivalent (only selected functions require this library)
// - p5.dom.js or minified equivalent (only selected functions require this library)
//
// Andrew D. McGuire 2018
// amcguire227@gmail.com
//----------------------------------------------------------
var utils = {

    sleep: function (time) {
        // time delay functionality
        // use as await sleep(sleep_time);
        // must be called within an async function
        return new Promise((resolve) => setTimeout(resolve, time));
    },


    isEqual: function (value, other) {

        // Check if two arrays are equal.
        // Credit Chris Ferdinandi
        // https://gomakethings.com/check-if-two-arrays-or-objects-are-equal-with-javascript/

        // Get the value type
        var type = Object.prototype.toString.call(value);

        // If the two objects are not the same type, return false
        if (type !== Object.prototype.toString.call(other)) return false;

        // If items are not an object or array, return false
        if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;

        // Compare the length of the length of the two items
        var valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
        var otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
        if (valueLen !== otherLen) return false;

        // Compare two items
        var compare = function (item1, item2) {
            if (item1 !== item2) return false;
        };

        // Compare properties
        var match;
        if (type === '[object Array]') {
            for (var i = 0; i < valueLen; i++) {
                compare(value[i], other[i]);
            }
        } else {
            for (var key in value) {
                if (value.hasOwnProperty(key)) {
                    compare(value[key], other[key]);
                }
            }
        }

        // If nothing failed, return true
        return true;

    },


    getSimBoxDimensions: function (div_id = '#sim_container') {
        //get the dimension of the simbox
        var sb_ymax = $(div_id).outerHeight() * 0.95;
        var sb_xmax = $(div_id).outerWidth() * 0.97;
        return {
            ymax: sb_ymax,
            xmax: sb_xmax
        };
    },


    stretch: function (div_id) {
        // stretch a div fill it's parent container (almost)
        var child = select(div_id);
        var parent_id = child.parent().id;
        var parent_dim = this.getSimBoxDimensions('#' + parent_id);
        child.style('width', parent_dim.xmax.toString());
        child.style('height', parent_dim.ymax.toString());
    },


    loadImgErrFix: function (errEvt) {
        // load an image and handle any CORS errors that may occur.
        const pic = errEvt.target;
        pic.crossOrigin = null, pic.src = pic.src;
    },


    _get_plotly_figure_handle: function (container_id) {
        // private function to get a handle on a Plotly figure
        var d3 = Plotly.d3;
        var d3_string = "div[id='".concat(container_id, "']");
        var d3_selection = d3.select(d3_string);
        return d3_selection.node();
    },

    resizePlotlyWidth: function (container_id, frac = 0.33) {
        // resize the width of a plotly svg container with
        var fig = this._get_plotly_figure_handle(container_id);
        var window_width = document.getElementById(container_id).offsetWidth;
        var svg_container = document.getElementById(container_id).getElementsByClassName('svg-container')[0];
        svg_container.style.width = (window_width * frac) + 'px';
        Plotly.Plots.resize(fig);
    },

    resizePlotlyHeight: function (container_id) {
        var fig = this._get_plotly_figure_handle(container_id);
        var window_height = document.getElementById(container_id).offsetHeight;
        var svg_container = document.getElementById(container_id).getElementsByClassName('svg-container')[0];
        svg_container.style.height = (window_height - 25) + 'px';
        Plotly.Plots.resize(fig);
    },

    resizePlotly: function (container_id, w_frac = 0.33) {
        // resize a plotly graph to fill its container
        this.resizePlotlyHeight(container_id);
        this.resizePlotlyWidth(container_id, w_frac);
    },


    generateLabels: function (arrx, letter) {
        // generate a number based label array based on an array length
        // and a letter
        //
        // example: axrr = [1.0,0.0,0.0], letter = 'z'
        //          => returns ['z1','z2','z3']
        labels = [];
        for (var i = 0; i < arrx.length; i++) {
            labels.push(letter + (i + 1));
        }
        return labels;
    },


    getImgScaledDimensions: function (img, img_shrink_factor, ymax) {

        // return the scaled image dimensions
        // that maintain the apect ratio.
        var scaled_height = ymax * img_shrink_factor;
        var scaled_width = img.width * scaled_height / img.height;
        return {
            width: scaled_width,
            height: scaled_height
        }

    },


    polygon: function (x, y, radius, npoints) {
        //From: https://p5js.org/examples/form-regular-polygon.html
        var angle = TWO_PI / npoints;
        beginShape();
        for (var a = 0; a < TWO_PI; a += angle) {
            var sx = x + cos(a) * radius;
            var sy = y + sin(a) * radius;
            vertex(sx, sy);
        }
        endShape(CLOSE);
    },


    //From: https://jsfiddle.net/1vrkw1pc/
    //extend two javascript objects (useful if you want to merge some arg
    //options object with a default options object.
    extend: function () {
        for (var i = 1; i < arguments.length; i++)
            for (var key in arguments[i])
                if (arguments[i].hasOwnProperty(key)) {
                    if (typeof arguments[0][key] === 'object'
                        && typeof arguments[i][key] === 'object')
                        extend(arguments[0][key], arguments[i][key]);
                    else
                        arguments[0][key] = arguments[i][key];
                }
        return arguments[0];
    },


    merge_options: function (obj1, obj2) {
        // Merge two objects without affecting the inputs.
        // From: https://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically
        var obj3 = {};
        for (var attrname in obj1) {
            obj3[attrname] = obj1[attrname];
        }
        for (var attrname in obj2) {
            obj3[attrname] = obj2[attrname];
        }
        return obj3;
    },


    deep_copy: function (obj) {
        // deep copy an object (attributes only)
        return JSON.parse(JSON.stringify(obj));
    },


    is_on_canvas: function (x, y) {
        // check if coordinates are in the canvas
        var dimensions = utils.getSimBoxDimensions();
        if (x > 0 && x <= dimensions.xmax && y > 0 && y <= dimensions.ymax) {
            return true;
        }
        return false;
    },


    rotate_point_with_body: function (body, point) {
        // adpated from https://stackoverflow.com/a/38285610/4530680
        var dx = point.x - body.position.x;
        var dy = point.y - body.position.y;
        var mouseAngle = Math.atan2(dy, dx);
        var mouseDistance = Math.sqrt(dx * dx + dy * dy);
        var x = body.position.x + mouseDistance * Math.cos(mouseAngle - body.angle);
        var y = body.position.y + mouseDistance * Math.sin(mouseAngle - body.angle);
        return {x: x, y: y};
    },


    get_abs_coords: function (xmax, ymax, img_width, img_height, scaling) {
        // Convert canvas, image dimensions and positional scaling factors
        // into absolute positions, width and height.
        return {
            x: (xmax + scaling.x_scaling * img_width) / 2.0,
            y: (ymax + scaling.y_scaling * img_height) / 2.0,
            w: scaling.w_scaling * img_width,
            h: scaling.h_scaling * img_height,
            a: scaling.a
        };

    },


    // load a script and run a cal back function when it is done
    // source: https://stackoverflow.com/a/950146/4530680
    loadScript: function (url, callback) {
        // Adding the script tag to the head as suggested before
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;

        // Then bind the event to the callback function.
        // There are several events for cross browser compatibility.
        script.onreadystatechange = callback;
        script.onload = callback;

        // Fire the loading
        head.appendChild(script);
    },


    // Test if an object is an array
    isArray: function (obj) {
        if (Object.prototype.toString.call(obj) === '[object Array]') {
            return true;
        }
        return false;
    },


    Counter: function (max) {
        if (max == null) {
            max = 1000;
        }


        this.max = max;
        this.value = 0;
        this.increment = function () {
            if (this.value > this.max) {
                this.reset();
            } else {
				this.value = this.value + 1;
			}
        };

        this.reset = function () {
            this.value = 0;
        };
    }
};
