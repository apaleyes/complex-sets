var maxIter = 15;

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
    if (typeof(ratio) !== 'undefined') {
        iterCount *= ratio;
    }

    var z = new Complex(0, 0), prev = NaN;
    for (var i = 1; i <= iterCount; i++) {
        prev = z;
        z = f(z, c);

        if (z.equals(prev)) {
            return true;
        }

        if (z.abs() > 2) {
            return false;
        }
    }
    return true;
}

var canvasManager;

window.onload = function (){
    canvasManager = new CanvasManager('main', defaults, checkMandelbrotPoint);
    canvasManager.drawSet();

    var resetButton = document.getElementsByClassName('resetButton')[0];
    resetButton.onclick = function () {
        canvasManager.resetZoom();
    }
}