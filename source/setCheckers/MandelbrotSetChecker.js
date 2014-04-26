function MandelbrotSetChecker(maxIter) {
    ComplexSetChecker.call(this, maxIter, "Mandelbrot Set");
}

MandelbrotSetChecker.prototype = Object.create(ComplexSetChecker.prototype);

MandelbrotSetChecker.prototype.constructor = MandelbrotSetChecker;

MandelbrotSetChecker.prototype.iterationFunction = function (z, c) {
    return z.square().add(c);
};

MandelbrotSetChecker.prototype.checkPoint = function(c) {
    var initC = c;

    if (this.checkCardioidOrSecondBulb(c)) {
        return {point: initC, inSet: true};
    }

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

// Optimization check
// Details: http://en.wikipedia.org/wiki/Mandelbrot_set#Cardioid_.2F_bulb_checking
MandelbrotSetChecker.prototype.checkCardioidOrSecondBulb = function (c) {
    var p = (c.x - 1/4);
    var q = p*p + c.y*c.y;
    return q * (q + p) < 1/4 * c.y*c.y;
};