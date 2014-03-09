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

function checkMandelbrotPoint(c, ratio) {
    var iterCount = maxIter;

    var cx = c.x, cy = c.y;

    if (checkCardiodOrSecondBulb(c)) {
        return {inSet: true};
    }

    var z = new Complex(), prevZ;
    for (var i = 1; i <= iterCount; i++) {
        prevZ = z;
        z = f(z, c);

        if (z.equals(prevZ)) {
            return {inSet: true};
        }

        if (z.normSquared() > 4) {
            return {inSet: false, iteration: i};
        }
    }

    return {inSet: true};
}

// Optimization check
// Details: http://en.wikipedia.org/wiki/Mandelbrot_set#Cardioid_.2F_bulb_checking
function checkCardiodOrSecondBulb(c) {
    var p = (c.x - 1/4);
    var q = p*p + c.y*c.y;
    return q * (q + p) < 1/4 * c.y*c.y;
}

function checkMandelbrotPointJsOptimized(c, ratio) {
    var iterCount = maxIter;

    var cx = c.x, cy = c.y;

    if (checkCardiodOrSecondBulb(cx, cy)) {
        return {inSet: true};
    }

    var x = 0, y = 0, prevX = NaN, prevY = NaN;
    for (var i = 1; i <= iterCount; i++) {
        prevX = x;
        prevY = y;
        x = x*x - y*y + cx;
        y = 2 * prevX * prevY + cy;

        if (x == prevX && y == prevY) {
            return {inSet: true};
        }

        if (x*x+y*y > 4) {
            return {inSet: false, iteration: i};
        }
    }

    return {inSet: true};
}

// Optimization check
// Details: http://en.wikipedia.org/wiki/Mandelbrot_set#Cardioid_.2F_bulb_checking
function checkCardiodOrSecondBulbJsOptimized(x, y) {
    var p = (x - 1/4);
    var q = p*p + y*y;
    return q * (q + p) < 1/4 * y*y;
}

var blackHue = {r: 0, g: 0, b: 0};
var orangeRedHue = {r: 220, g: 20, b: 60};
var blueGreenHue = {r: 13, g: 152, b: 186};

var canvasManager;

window.onload = function (){
    var options = {
        canvasId: 'main',
        zoomCanvasId: 'zoom',
        defaultAxes: defaults,
        checkPoint: checkMandelbrotPoint
    };

    var linerGrad = new LinearGradientColorProvider(blackHue, blueGreenHue, maxIter);
    options.colorPoint = function (pointData) {
        if (pointData.inSet) {
            return linerGrad.getColor(maxIter);
        } else {
            return linerGrad.getColor(pointData.iteration);
        }
    };

    var palette = [
        {rate: 0.0, hue: {r: 25, g: 7, b: 26}},
        {rate: 0.5, hue: {r: 211, g: 236, b: 248}},
        {rate: 0.70, hue: {r: 255, g: 170, b: 0}},
        {rate: 1.0, hue: {r: 0, g: 0, b: 0}},
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