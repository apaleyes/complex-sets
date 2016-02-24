function ZoomCanvasWrapper(options) {
    CanvasWrapper.call(this, options);

    this.zoomCanvasId = options.zoomCanvasId;    
    this.zoomCanvas = document.getElementById(this.zoomCanvasId);
    this.zoomCanvasRect = this.zoomCanvas.getBoundingClientRect();
    this.zoomContext = this.zoomCanvas.getContext('2d');
    if (options.fullScreen) {
        this.zoomCanvas.width = document.body.clientWidth;
        this.zoomCanvas.height = document.body.clientHeight;
    }

    this.startX = 0;
    this.startY = 0;
    this.endX = 0;
    this.endY = 0;
    this.isZoomInProcess = false;
    this.initStartZoom();
    this.initEndZoom();
    this.initZoomMove();
    // used to prevent accidential click on canvas
    this.minZoomWindowSize = 10;
}

ZoomCanvasWrapper.prototype = Object.create(CanvasWrapper.prototype);

ZoomCanvasWrapper.prototype.constructor = ZoomCanvasWrapper;

ZoomCanvasWrapper.prototype.drawZoomRect = function(x, y) {
    this.clearZoomCanvas();

    var ctx = this.zoomContext;
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#00FF00";

    var minX = this.toWidthUnits(Math.min(this.clientStartX, x));
    var minY = this.toHeightUnits(Math.min(this.clientStartY, y));
    var width = this.toWidthUnits(Math.abs(this.clientStartX - x));
    var height = this.toHeightUnits(Math.abs(this.clientStartY - y));

    ctx.strokeRect(minX, minY, width, height);
};

ZoomCanvasWrapper.prototype.clearZoomCanvas = function() {
    this.zoomContext.clearRect(0, 0, this.zoomCanvas.width, this.zoomCanvas.height);
};

ZoomCanvasWrapper.prototype.initZoomMove = function() {
    var self = this;
    self.zoomCanvas.onmousemove = function (e) {
        if (self.isZoomInProcess) {
            var mouseX = e.clientX - self.zoomCanvasRect.left;
            var mouseY = e.clientY - self.zoomCanvasRect.top;

            self.drawZoomRect(mouseX, mouseY);
        }
    }
};

ZoomCanvasWrapper.prototype.initStartZoom = function() {
    var self = this;
    self.zoomCanvas.onmousedown = function (e) {
        self.clientStartX = e.clientX - self.canvasRect.left;
        self.clientStartY = e.clientY - self.canvasRect.top;

        self.startX = self.toWidthUnits(self.clientStartX);
        self.startY = self.toHeightUnits(self.clientStartY);
        self.isZoomInProcess = true;
    }
};

ZoomCanvasWrapper.prototype.initEndZoom = function() {
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
};

ZoomCanvasWrapper.prototype.performZoom = function() {
    this.currentAxes = {
        x_min: this.translateToComplexX(Math.min(this.startX, this.endX)),
        x_max: this.translateToComplexX(Math.max(this.startX, this.endX)),
        y_min: this.translateToComplexY(Math.max(this.startY, this.endY)),
        y_max: this.translateToComplexY(Math.min(this.startY, this.endY))
    }

    this.clearCanvas();
    this.drawSet(self.checkPoint);
};

ZoomCanvasWrapper.prototype.resetZoom = function () {
    this.currentAxes = this.defaultAxes;
    this.clearCanvas();
    this.drawSet(self.checkPoint);
};

// Zoom is considered invalid if any of zoom window sizes is less than minZoomWindowSize
// This helps avoid unwanted zoom operations, e.g. clicks
ZoomCanvasWrapper.prototype.isValidZoom = function () {
    var xSize = Math.max(this.startX, this.endX) - Math.min(this.startX, this.endX);
    var ySize = Math.max(this.startY, this.endY) - Math.min(this.startY, this.endY);

    var xValid = (xSize >= this.minZoomWindowSize);
    var yValid = (ySize >= this.minZoomWindowSize);
    return xValid && yValid;
};