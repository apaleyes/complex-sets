var CanvasWrapper = function (options) {
    this.canvasId = options.canvasId;
    this.zoomCanvasId = options.zoomCanvasId;

    this.drawStrategy = options.drawStrategy;

    this.canvas = document.getElementById(this.canvasId);
    if (options.fullScreen) {
        if (this.canvas.width != document.body.clientWidth)
            this.canvas.width = document.body.clientWidth;
        if (this.canvas.height != document.body.clientHeight)
            this.canvas.height = document.body.clientHeight;
    }

    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.canvasRect = this.canvas.getBoundingClientRect();
    this.context = this.canvas.getContext('2d');

    this.defaultAxes = options.defaultAxes;
    this.currentAxes = this.defaultAxes;

    if (options.beforeDrawSet) {
        this.beforeDrawSet = options.beforeDrawSet;
    }
    if (options.afterDrawSet) {
        this.afterDrawSet = options.afterDrawSet;
    }
}

CanvasWrapper.prototype = {
    translateToComplexX: function (px) {
        var x_range = this.currentAxes.x_max - this.currentAxes.x_min;
        var x = x_range / this.width * px + this.currentAxes.x_min;
        return x;
    },

    translateToComplexY: function (py) {
        var y_range = this.currentAxes.y_max - this.currentAxes.y_min;
        var y = -1.0 * y_range / this.height * py + this.currentAxes.y_max;
        return y;
    },

    translateToComplex: function (px, py) {
        var x = this.translateToComplexX(px);
        var y = this.translateToComplexY(py);

        return new Complex(x, y);
    },

    translateFromComplexX: function(z) {
        var x_range = this.currentAxes.x_max - this.currentAxes.x_min;
        var px = (z.x - this.currentAxes.x_min) * this.width / x_range;
        return px;
    },

    translateFromComplexY: function(z) {
        var y_range = this.currentAxes.y_max - this.currentAxes.y_min;
        var py = (this.currentAxes.y_max - z.y) * this.height / y_range;
        return py;
    },

    translateFromComplex: function(z) {
        var px = this.translateFromComplexX(z);
        var py = this.translateFromComplexY(z);
        return [px, py];
    },

    adjustCurrentAxes: function() {
        var x_range = this.currentAxes.x_max - this.currentAxes.x_min;
        var y_range = this.currentAxes.y_max - this.currentAxes.y_min;
        if (x_range / this.width < y_range / this.height) {
            var required_x_range = this.width / this.height * y_range;
            var x_margin = (required_x_range - x_range) / 2.0;
            this.currentAxes.x_max += x_margin;
            this.currentAxes.x_min -= x_margin;
        } else if (x_range / this.width > y_range / this.height) {
            var required_y_range = this.height / this.width * x_range;
            var y_margin = (required_y_range - y_range) / 2.0;
            this.currentAxes.y_max += y_margin;
            this.currentAxes.y_min -= y_margin;
        } // otherwise they are equal - do nothing
    },

    toWidthUnits: function (w) {
        return w / this.canvas.clientWidth * this.width;
    },

    toHeightUnits: function (h) {
        return h / this.canvas.clientHeight * this.height;
    },

    clearCanvas: function () {
        this.context.fillStyle = "#FFFFFF";
        this.context.fillRect(0, 0, this.width, this.height);
    },

    drawSet: function () {
        if (this.beforeDrawSet) {
            this.beforeDrawSet();
        }

        // A bit hacky way to allow some time for browser to apply necessary changes before drawing
        // Idea is to schedule the set drawing with some short delay
        // Without this browser never has time to get in control of the execution thread
        var self = this;
        setTimeout(function(){
            var start = new Date();
            self.adjustCurrentAxes();
            self.drawStrategy.draw(self);

            var end = new Date();
            var executionTime = end - start;
            console.log("Drawn in " + executionTime + " ms");

            if (self.afterDrawSet) {
                self.afterDrawSet();
            }
        }, 500);
    },

    applyColor: function (color, w, h) {
        if (typeof(color) !== 'undefined') {
            this.context.fillStyle = color;
            this.context.fillRect(w, h, 1, 1);
        }
    }
}