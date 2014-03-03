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
function checkCardiodOrSecondBulb(x, y) {
    var p = (x - 1/4);
    var q = p*p + y*y;
    return q * (q + p) < 1/4 * y*y;
}

var inSetHue = {r: 0, g: 0, b: 0};
var orangeRedHue = {r: 220, g: 20, b: 60};
var blueGreenHue = {r: 13, g: 152, b: 186};
function getColor(minHue, maxHue, rate) {
    var r = Math.round((maxHue.r - minHue.r) * rate);
    var g = Math.round((maxHue.g - minHue.g) * rate);
    var b = Math.round((maxHue.b - minHue.b) * rate);

    return 'rgb(' + r + ',' + g + ',' + b + ')';
}

function linearGradient(pointData) {
    if (pointData.inSet) {
        return getColor(inSetHue, orangeRedHue, 0);
    } else {
        var colorRate = 1 - pointData.iteration / maxIter;
        return getColor(inSetHue, orangeRedHue, colorRate);
    }
}

var histogram = [];
var histogramTotal;
for (var i=0; i<maxIter; i++) {
    histogram.push(0);
}

function histogramColorPoint(pointData) {
    if (!pointData.inSet) {
        histogram[pointData.iteration - 1] += 1;
    }
    return;
}

function histogramCalculationFinished() {
    histogramTotal = 0.0;
    for (var i = 0; i < maxIter; i += 1) {
        histogramTotal += histogram[i];
    }
}

function histogramPostColorPoint(pointData) {
    var rate = 0.0;
    if (!pointData.inSet) {
        for (var i = 0; i < pointData.iteration; i += 1) {
            rate += histogram[i] / histogramTotal;
        }
    }

    return getColor(inSetHue, blueGreenHue, rate);
}

var canvasManager;

window.onload = function (){
    canvasManager = new CanvasManager({
        canvasId: 'main',
        zoomCanvasId: 'zoom',
        defaultAxes: defaults,
        checkPoint: checkMandelbrotPoint,
        //colorPoint: linearGradient
        colorPoint: histogramColorPoint,
        postColorPoint: histogramPostColorPoint,
        calculationFinished: histogramCalculationFinished
    });
    canvasManager.drawSet();

    var resetButton = document.getElementsByClassName('resetButton')[0];
    resetButton.onclick = function () {
        canvasManager.resetZoom();
    }
}