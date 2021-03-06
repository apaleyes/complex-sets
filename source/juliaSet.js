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
    var drawStrategy = new PointStrategy({
        checkPoint: function(c) { return checker.checkPoint(c); },
        colorPoint: function(pointData) {
            if (pointData.inSet) {
                return '#000000';
            } else {
                return;
            }
        }
    });

    canvasWrapper = new CanvasWrapper({
        canvasId: 'main',
        zoomCanvasId: 'zoom',
        defaultAxes: defaults,
        drawStrategy: drawStrategy
    });
    canvasWrapper.drawSet();

    var resetButton = document.getElementsByClassName('resetButton')[0];
    resetButton.onclick = function () {
        //canvasWrapper.resetZoom();
    }
}


