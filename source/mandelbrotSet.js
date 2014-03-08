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
    var r = Math.round(maxHue.r * rate + minHue.r * (1.0 - rate));
    var g = Math.round(maxHue.g * rate + minHue.g * (1.0 - rate));
    var b = Math.round(maxHue.b * rate + minHue.b * (1.0 - rate));

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

function getTestPaletteColor(rate) {
    // source http://en.wikipedia.org/wiki/File:Escape_Time_Algorithm.png
    var palette = [
        {rate: 0.0, hue: {r: 0, g: 0, b: 0}},
        {rate: 0.25, hue: {r: 255, g: 170, b: 0}},
        {rate: 0.50, hue: {r: 211, g: 236, b: 248}},
        {rate: 1.0, hue: {r: 25, g: 7, b: 26}},
    ];

    for (var i=0; i<palette.length - 1; i++) {
        if (palette[i].rate <= rate && rate <= palette[i+1].rate) {
            var localRate = (rate - palette[i].rate) / (palette[i+1].rate - palette[i].rate);
            return getColor(palette[i].hue, palette[i+1].hue, localRate);
        }
    }

    throw "rate is " + rate + ", should be between 0 and 1";
}

function histogramPalettePostColorPoint(pointData) {
    var rate = 0.0;
    if (!pointData.inSet) {
        for (var i = 0; i < pointData.iteration; i += 1) {
            rate += histogram[i] / histogramTotal;
        }
    }

    // maybe dirty, but working workaround for numbers like 1.0000000000004
    if (rate > 1.0) {
        rate = 1.0;
    }

    return getTestPaletteColor(rate);
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
        postColorPoint: histogramPalettePostColorPoint,
        calculationFinished: histogramCalculationFinished
    });
    canvasManager.drawSet();

    var resetButton = document.getElementsByClassName('resetButton')[0];
    resetButton.onclick = function () {
        canvasManager.resetZoom();
    }
}