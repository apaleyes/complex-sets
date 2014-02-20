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
            return {inSet: false, iterationRate: i / maxIter};
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

var canvasManager;

window.onload = function (){
    canvasManager = new CanvasManager('main', 'zoom', defaults, checkMandelbrotPoint);
    canvasManager.drawSet();

    var resetButton = document.getElementsByClassName('resetButton')[0];
    resetButton.onclick = function () {
        canvasManager.resetZoom();
    }
}