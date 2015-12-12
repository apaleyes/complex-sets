var maxIter = 200;

var defaults = {
   x_min: -2,
   x_max: 0.75,
   y_min: -1.5,
   y_max: 1.5
};

var canvasWrapper;

window.onload = function (){
    var checker = new BurningShipChecker(maxIter);

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

    var options = {
        canvasId: 'main',
        zoomCanvasId: 'zoom',
        defaultAxes: defaults,
        drawStrategy: drawStrategy
    };

    canvasWrapper = new ZoomCanvasWrapper(options);
    canvasWrapper.drawSet();

    var resetButton = document.getElementsByClassName('resetButton')[0];
    resetButton.onclick = function () {
        canvasWrapper.resetZoom();
    }
}