var CanvasManager = function (canvasId, zoomCanvasId, defaultAxes, checkPoint, colorPoint) {
    this.canvasId = canvasId;
    this.zoomCanvasId = zoomCanvasId;
    this.checkPoint = checkPoint;
    this.colorPoint = colorPoint;

    this.canvas = document.getElementById(this.canvasId);
    this.canvasRect = this.canvas.getBoundingClientRect();
    this.context = this.canvas.getContext('2d');

    if (this.zoomCanvasId != null) {
        this.zoomCanvas = document.getElementById(this.zoomCanvasId);
        this.zoomCanvasRect = this.zoomCanvas.getBoundingClientRect();
        this.zoomContext = this.zoomCanvas.getContext('2d');
    }

    this.defaultAxes = defaultAxes;
    this.currentAxes = this.defaultAxes;

    this.initZoom();
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

    toWidthUnits: function (w) {
        return w / this.canvas.clientWidth * this.canvas.width;
    },

    toHeightUnits: function (h) {
        return h / this.canvas.clientHeight * this.canvas.height;
    },

    clearCanvas: function () {
        this.context.fillStyle = "#FFFFFF";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    },

    drawSet: function () {
        var ratio = this.getRatio();

        var start = new Date();
        for (var w = 0; w <= this.canvas.width; w++){
            for (var h = 0; h <= this.canvas.height; h++){
                var z = this.translatePoint(w, h);
                var pointData = this.checkPoint(z, ratio);
                if (typeof(this.colorPoint) !== 'undefined') {
                    var color = this.colorPoint(pointData);
                    this.context.fillStyle = color;
                    this.context.fillRect(w, h, 1, 1);
                } else {
                    // color function is not provided - default to dlack and white coloring
                    if (pointData.inSet) {
                        // belongs to set - color black
                        this.context.fillStyle = "#000000";
                        this.context.fillRect(w, h, 1, 1);
                    } else {
                        // does not belong to set - do nothing
                    }
                }
            }
        }
        var end = new Date();

        var executionTime = end - start;
    },

    initZoom: function() {
        this.startX = 0;
        this.startY = 0;
        this.endX = 0;
        this.endY = 0;
        this.isZoomInProcess = false;
        this.initStartZoom();
        this.initEndZoom();
        this.initZoomMove();
        // used to prevent accidential click on canvas instead of zoom
        this.minZoomWindowSize = 10;
    },

    drawZoomRect: function(x, y) {
        this.clearZoomCanvas();

        var ctx = this.zoomContext;
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#00FF00";
        ctx.setLineDash([5]);

        var minX = this.toWidthUnits(Math.min(this.clientStartX, x));
        var minY = this.toHeightUnits(Math.min(this.clientStartY, y));
        var width = this.toWidthUnits(Math.abs(this.clientStartX - x));
        var height = this.toHeightUnits(Math.abs(this.clientStartY - y));

        ctx.strokeRect(minX, minY, width, height);
    },

    clearZoomCanvas: function() {
        this.zoomContext.clearRect(0, 0, this.zoomCanvas.width, this.zoomCanvas.height);
    },

    initZoomMove: function() {
        var self = this;
        self.zoomCanvas.onmousemove = function (e) {
            if (self.isZoomInProcess) {
                var mouseX = e.clientX - self.zoomCanvasRect.left;
                var mouseY = e.clientY - self.zoomCanvasRect.top;

                self.drawZoomRect(mouseX, mouseY);
            }
        }
    },

    initStartZoom: function() {
        var self = this;
        self.zoomCanvas.onmousedown = function (e) {
            self.clientStartX = e.clientX - self.canvasRect.left;
            self.clientStartY = e.clientY - self.canvasRect.top;

            self.startX = self.toWidthUnits(self.clientStartX);
            self.startY = self.toHeightUnits(self.clientStartY);
            self.isZoomInProcess = true;
        }
    },

    initEndZoom: function() {
        var self = this;
        self.zoomCanvas.onmouseup = function (e) {
            self.clearZoomCanvas();
            if (!self.isZoomInProcess) {
                self.isZoomInProcess = false;
                return;
            }

            self.endX = self.toWidthUnits(e.clientX - self.canvasRect.left);
            self.endY = self.toHeightUnits(e.clientY - self.canvasRect.top);

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