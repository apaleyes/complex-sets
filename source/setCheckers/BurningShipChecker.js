function BurningShipChecker(maxIter) {
    this.maxIter = maxIter;
}

BurningShipChecker.prototype.constructor = BurningShipChecker;

BurningShipChecker.prototype.iterationFunction = function (z, c) {
    // In the normal coordinate system this fractal renders upside down
    // This is the most sutable place to flip it, thus -1.0 multiplier for Im part
    var z_abs = new Complex(Math.abs(z.re()), -1.0 * Math.abs(z.im()));
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
