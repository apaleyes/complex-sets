var CanvasWrapper = function (options) {
    this.canvasId = options.canvasId;
    this.zoomCanvasId = options.zoomCanvasId;

    this.drawStrategy = options.drawStrategy;

    this.canvas = document.getElementById(this.canvasId);
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.canvasRect = this.canvas.getBoundingClientRect();
    this.context = this.canvas.getContext('2d');

    this.defaultAxes = options.defaultAxes;
    this.currentAxes = this.defaultAxes;
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
        var start = new Date();
        this.drawStrategy.draw(this);

        var end = new Date();
        var executionTime = end - start;
        console.log("Drawn in " + executionTime + " ms");
    },

    applyColor: function (color, w, h) {
        if (typeof(color) !== 'undefined') {
            this.context.fillStyle = color;
            this.context.fillRect(w, h, 1, 1);
        }
    }
}