var maxIter = 20;
var c = new Complex(1/3, 1/2);
var R = (1.0 + Math.sqrt(1 + 4 * c.abs())) / 2.0;

var defaults = {
   x_min: -R,
   x_max: R,
   y_min: -R,
   y_max: R 
};

var canvasWrapper;

window.onload = function () {
    var checker = new JuliaSetChecker(maxIter, c, R);

    canvasWrapper = new CanvasWrapper({
        canvasId: 'main',
        zoomCanvasId: 'zoom',
        defaultAxes: defaults,
        checkPoint: function(c) { return checker.checkPoint(c); }
    });
    canvasWrapper.drawSet();

    var resetButton = document.getElementsByClassName('resetButton')[0];
    resetButton.onclick = function () {
        canvasWrapper.resetZoom();
    }
}


