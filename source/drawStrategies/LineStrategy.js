function LineStrategy(options) {
    this.checkPoint = options.checkPoint;
    this.colorPoint = options.colorPoint;
}

LineStrategy.prototype.draw = function(canvasWrapper) {
    var width = canvasWrapper.width;
    var height = canvasWrapper.height;

    for (var h = 0; h <= height; h++){
        var linePoints = [];        
        for (var w = 0; w <= width; w++){        
            var z = canvasWrapper.translateToComplex(w, h);
            linePoints.push(z);            
        }

        //here comes web worker
        var self = this;
        this.processLine(linePoints, canvasWrapper, function (linePoints, canvasWrapper) {
            self.displayLine(linePoints, canvasWrapper);
        });
    }
};

LineStrategy.prototype.processLine = function(linePoints, canvasWrapper, displayLine){
    var linePointsData = [];
    for (var i = 0; i < linePoints.length; i++){
        var pointData = this.checkPoint(linePoints[i]);
        linePointsData.push(pointData);
    }

    displayLine(linePointsData, canvasWrapper);
};

LineStrategy.prototype.displayLine = function(linePointsData, canvasWrapper){
    for (var i = 0; i < linePointsData.length; i++){
        var pointData = linePointsData[i];
        var coords = canvasWrapper.translateFromComplex(pointData.point);
        var color = this.colorPoint(pointData);
        canvasWrapper.applyColor(color, coords[0], coords[1]);
    }
};
