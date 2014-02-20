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

var canvasManager;

window.onload = function (){
    canvasManager = new CanvasManager('main', 'zoom', defaults, checkMandelbrotPoint);
    canvasManager.drawSet();

    var resetButton = document.getElementsByClassName('resetButton')[0];
    resetButton.onclick = function () {
        canvasManager.resetZoom();
    }
}