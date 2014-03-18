function JuliaSetChecker(maxIter, p, R) {
    this.p = p;
    this.R = R;
    ComplexSetChecker.call(this, maxIter, "Julia Set");
}

JuliaSetChecker.prototype = Object.create(ComplexSetChecker.prototype);

JuliaSetChecker.prototype.constructor = JuliaSetChecker;

JuliaSetChecker.prototype.iterationFunction = function (z) {
    return z.square().add(this.p);
};

JuliaSetChecker.prototype.checkPoint = function(z) {
    for (var i = 1; i <= this.maxIter; i++) {
        z = this.iterationFunction(z);
        if (z.abs() > this.R) {
          return {inSet: false};
        }
    }
    return {inSet: true};
}
