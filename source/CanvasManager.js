var CanvasManager = function (canvasId, defaultAxes, checkPoint) {
    this.canvasId = canvasId;
    this.checkPoint = checkPoint;

    this.canvas = document.getElementById(this.canvasId);
    this.canvasRect = this.canvas.getBoundingClientRect();
    this.context = this.canvas.getContext('2d');

    this.defaultAxes = defaultAxes;
    this.currentAxes = this.defaultAxes;

    // init zoom
    this.startX = 0;
    this.startY = 0;
    this.endX = 0;
    this.endY = 0;
    this.isZoomInProcess = false;
    this.initStartZoom();
    this.initEndZoom();
    // used to prevent accidential click on canvas instead of zoom
    this.minZoomWindowSize = 10;
}

CanvasManager.prototype = {
    translateX: function (px) {
        var x_range = this.currentAxes.x_max - this.currentAxes.x_min;
        var x = x_range / this.canvas.width * px + this.currentAxes.x_min;
        return x;
    },

    translateY: function (py) {
        var y_range = this.currentAxes.y_max - this.currentAxes.y_min;
        var y = -1.0 * y_range / this.canvas.height * py + this.currentAxes.y_max;
        return y;
    },

    translatePoint: function (px, py) {
        var x = this.translateX(px);
        var y = this.translateY(py);

        return new Complex(x, y);
    },

    clearCanvas: function () {
        this.context.fillStyle = "#FFFFFF";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    },

    drawSet: function () {
        var ratio = this.getRatio();

        this.context.fillStyle = "#000000";
        var start = new Date();
        for (var w = 0; w <= this.canvas.width; w++){
            for (var h = 0; h <= this.canvas.height; h++){
                var z = this.translatePoint(w, h);
                if (this.checkPoint(z, ratio)) {
                    // belongs to set - color black                
                    //ctx.putImageData(pixelData, w, h);
                    this.context.fillRect(w, h, 1, 1);
                } else {
                    // does not belong to set - do nothing (color white)
                }            
            }
        }
        var end = new Date();

        var executionTime = end - start;
        console.log("DrawSet worked for " + executionTime + " ms");
    },

    initStartZoom: function() {
        var self = this;
        self.canvas.onmousedown = function (e) {
            self.startX = (e.clientX - self.canvasRect.left) / self.canvas.clientWidth * self.canvas.width;
            self.startY = (e.clientY - self.canvasRect.top) / self.canvas.clientHeight * self.canvas.height;
            self.isZoomInProcess = true;
        }
    },

    initEndZoom: function() {
        var self = this;
        self.canvas.onmouseup = function (e) {
            if (!self.isZoomInProcess) {
                self.isZoomInProcess = false;
                return;
            }

            self.endX = (e.clientX - self.canvasRect.left) / self.canvas.clientWidth * self.canvas.width;
            self.endY = (e.clientY - self.canvasRect.top) / self.canvas.clientHeight * self.canvas.height;

            if (!self.isValidZoom()) {
                self.isZoomInProcess = false;
                return;
            }

            self.performZoom();

            self.isZoomInProcess = false;
        }
    },

    performZoom: function() {
        this.currentAxes = {
            x_min: this.translateX(Math.min(this.startX, this.endX)),
            x_max: this.translateX(Math.max(this.startX, this.endX)),
            y_min: this.translateY(Math.max(this.startY, this.endY)),
            y_max: this.translateY(Math.min(this.startY, this.endY))
        }

        //maxIter *= 2;
        this.clearCanvas();
        this.drawSet(self.checkPoint);
    },

    resetZoom: function () {
        this.currentAxes = this.defaultAxes;
        this.clearCanvas();
        this.drawSet(self.checkPoint);  
    },

    // Zoom is considered invalid if any of zoom window sizes is less than minZoomWindowSize
    // This helps avoid unwanted zoom operations, e.g. clicks
    isValidZoom: function () {
        var xSize = Math.max(this.startX, this.endX) - Math.min(this.startX, this.endX);
        var ySize = Math.max(this.startY, this.endY) - Math.min(this.startY, this.endY);

        var xValid = (xSize >= this.minZoomWindowSize);
        var yValid = (ySize >= this.minZoomWindowSize);
        return xValid && yValid;
    },

    getRatio: function () {
        var xCurrent = this.currentAxes.x_max - this.currentAxes.x_min;
        var yCurrent = this.currentAxes.y_max - this.currentAxes.y_min;
        var xDefault = this.defaultAxes.x_max - this.defaultAxes.x_min;
        var yDefault = this.defaultAxes.y_max - this.defaultAxes.y_min;

        var xRatio = xDefault / xCurrent;
        var yRatio = yDefault / yCurrent;

        return Math.min(xRatio, yRatio);
    }
}