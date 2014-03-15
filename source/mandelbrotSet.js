var maxIter = 200;

function f(z, c){
    return z.square().add(c);
}

var defaults = {
   x_min: -2,
   x_max: 0.75,
   y_min: -1.5,
   y_max: 1.5 
};

var blackHue = {r: 0, g: 0, b: 0};
var orangeRedHue = {r: 220, g: 20, b: 60};
var blueGreenHue = {r: 13, g: 152, b: 186};

var canvasManager;

window.onload = function (){
    var checker = new MandelbrotSetChecker(maxIter);

    var options = {
        canvasId: 'main',
        zoomCanvasId: 'zoom',
        defaultAxes: defaults,
        checkPoint: function(c) { return checker.checkPoint(c); }
    };

    var palette = [
        {rate: 0.0, hue: {r: 0, g: 0, b: 0}},
        {rate: 0.65, hue: {r: 255, g: 0, b: 0}},
        {rate: 0.99, hue: {r: 255, g: 255, b: 0}},
        {rate: 1.0, hue: {r: 255, g: 255, b: 255}}
    ];
    var histogram = new HistogramColorProvider(palette, maxIter);
    options.colorPoint = function(pointData) {
        if (!pointData.inSet) {
            histogram.countColor(pointData.iteration);
        }
    };
    options.postColorPoint = function(pointData) {
        if (pointData.inSet) {
            return histogram.getColor(maxIter);
        } else {
            return histogram.getColor(pointData.iteration);
        }
    };

    canvasManager = new CanvasManager(options);
    canvasManager.drawSet();

    var resetButton = document.getElementsByClassName('resetButton')[0];
    resetButton.onclick = function () {
        canvasManager.resetZoom();
    }
}