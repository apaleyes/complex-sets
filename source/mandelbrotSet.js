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

    // var linerGrad = new LinearGradientColorProvider(blackHue, blueGreenHue, maxIter);
    // options.colorPoint = function (pointData) {
    //     if (pointData.inSet) {
    //         return linerGrad.getColor(maxIter);
    //     } else {
    //         return linerGrad.getColor(pointData.iteration);
    //     }
    // };

    // var palette = [
    //     {rate: 0.0, hue: {r: 25, g: 7, b: 26}},
    //     {rate: 0.5, hue: {r: 211, g: 236, b: 248}},
    //     {rate: 0.70, hue: {r: 255, g: 170, b: 0}},
    //     {rate: 1.0, hue: {r: 0, g: 0, b: 0}},
    // ];
    var palette = [
        {rate: 0.0, hue: {r: 0, g: 0, b: 0}},
        {rate: 0.65, hue: {r: 255, g: 0, b: 0}},
        {rate: 0.95, hue: {r: 255, g: 255, b: 0}},
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