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
        this.context.fillStyle = "#000000";
        for (var w = 0; w <= this.canvas.width; w++){
            for (var h = 0; h <= this.canvas.height; h++){
                var z = this.translatePoint(w, h);
                if (this.checkPoint(z)) {
                    // belongs to set - color black                
                    //ctx.putImageData(pixelData, w, h);
                    this.context.fillRect(w, h, 1, 1);
                } else {
                    // does not belong to set - do nothing (color white)
                }            
            }
        }
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
                return;
            }

            self.endX = (e.clientX - self.canvasRect.left) / self.canvas.clientWidth * self.canvas.width;
            self.endY = (e.clientY - self.canvasRect.top) / self.canvas.clientHeight * self.canvas.height;

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
    }
}