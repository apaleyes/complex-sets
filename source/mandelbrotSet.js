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

function checkMandelbrotPoint(c) {
    var z = new Complex(0, 0);
    for (var i = 1; i <= maxIter; i++) {
        z = f(z, c);
        if (z.abs() > 2) return false;
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