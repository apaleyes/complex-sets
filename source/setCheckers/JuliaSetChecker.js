function JuliaSetChecker(maxIter, p, R) {
    this.p = p;
    this.R = R;
    this.maxIter = maxIter;
}

JuliaSetChecker.prototype.constructor = JuliaSetChecker;

JuliaSetChecker.prototype.iterationFunction = function (z) {
    return z.square().add(this.p);
};

JuliaSetChecker.prototype.checkPoint = function(z) {
    var initZ = z;
    for (var i = 1; i <= this.maxIter; i++) {
        z = this.iterationFunction(z);
        if (z.abs() > this.R) {
          return {point: initZ, inSet: false};
        }
    }
    return {point: initZ, inSet: true};
}
