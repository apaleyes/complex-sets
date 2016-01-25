var maxIter = 200;

var defaults = {
   x_min: -2,
   x_max: 0.75,
   y_min: -1.5,
   y_max: 1.5
};

var canvasWrapper;

window.onload = function (){
    var palette = [
        {rate: 0.0, hue: {r: 0, g: 0, b: 0}},
        {rate: 0.65, hue: {r: 255, g: 0, b: 0}},
        {rate: 0.99, hue: {r: 255, g: 255, b: 0}},
        {rate: 1.0, hue: {r: 255, g: 255, b: 255}}
    ];
    var histogram = new HistogramColorProvider(palette, maxIter);

    var checker = new MandelbrotSetChecker(maxIter);

    var drawStrategy = new PointStrategy({
        checkPoint: function(c) { return checker.checkPoint(c); },
        colorPoint: function(pointData) {
            if (!pointData.inSet) {
                histogram.countColor(pointData.iteration);
            }
        },
        postColorPoint: function(pointData) {
            if (pointData.inSet) {
                return histogram.getColor(maxIter);
            } else {
                return histogram.getColor(pointData.iteration);
            }
        }
    });

    var options = {
        canvasId: 'main',
        zoomCanvasId: 'zoom',
        defaultAxes: defaults,
        drawStrategy: drawStrategy
    };

    var canvas = document.getElementById('main');
    var zoomCanvas = document.getElementById('zoom');
    canvas.width = document.body.clientWidth;
    zoomCanvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    zoomCanvas.height = document.body.clientHeight;

    canvasWrapper = new ZoomCanvasWrapper(options);
    canvasWrapper.drawSet();

    var resetButton = document.getElementsByClassName('resetButton')[0];
    resetButton.onclick = function () {
        canvasWrapper.resetZoom();
    }
}