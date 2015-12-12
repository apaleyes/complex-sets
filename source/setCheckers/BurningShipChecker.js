function BurningShipChecker(maxIter) {
    this.maxIter = maxIter;
}

BurningShipChecker.prototype.constructor = BurningShipChecker;

BurningShipChecker.prototype.iterationFunction = function (z, c) {
    var z_abs = new Complex(Math.abs(z.re()), Math.abs(z.im()));
    return z_abs.square().add(c);
};

BurningShipChecker.prototype.checkPoint = function(c) {
    var initC = c;

    var z = new Complex(), prevZ;
    for (var i = 0; i <= this.maxIter; i++) {
        prevZ = z;
        z = this.iterationFunction(z, c);

        if (z.equals(prevZ)) {
            return {point: initC, inSet: true};
        }

        if (z.normSquared() > 4) {
            return {point: initC, inSet: false, iteration: i};
        }
    }

    return {point: initC, inSet: true};
};
