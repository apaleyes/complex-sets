function PointStrategy(options) {
    this.checkPoint = options.checkPoint;
    this.colorPoint = options.colorPoint;

    if (options.postColorPoint && options.postColorPoint != null) {
        this.postColorPoint = options.postColorPoint;
    }

    if (options.calculationFinished && options.calculationFinished != null) {
        this.calculationFinished = options.calculationFinished;
    }
}

PointStrategy.prototype.initPointsData = function(width, height) {
    this.allPointsData = [];
    for (var i = 0; i <= width; i++) {
        this.allPointsData.push([]);
        for (var j = 0; j <= height; j++) {
            this.allPointsData[i].push(null);
        }
    }
};

PointStrategy.prototype.draw = function(canvasWrapper) {
    var width = canvasWrapper.width;
    var height = canvasWrapper.height;

    this.initPointsData(width, height);

    for (var w = 0; w <= width; w++){
        for (var h = 0; h <= height; h++){
            var z = canvasWrapper.translatePoint(w, h);
            var pointData = this.checkPoint(z);
            this.allPointsData[w][h] = pointData;
            var color = this.colorPoint(pointData);
            canvasWrapper.applyColor(color, w, h);
        }
    }

    if (this.calculationFinished) {
        this.calculationFinished();
    }

    if (this.postColorPoint) {
        for (var w = 0; w <= width; w++){
            for (var h = 0; h <= height; h++){
                var z = canvasWrapper.translatePoint(w, h);
                var color = this.postColorPoint(this.allPointsData[w][h]);
                canvasWrapper.applyColor(color, w, h);
            }
        }
    }
};