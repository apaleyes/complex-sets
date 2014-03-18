function ComplexSetChecker(maxIter, name) {
    this.maxIter = maxIter;
    this.name = name;
}

ComplexSetChecker.prototype = {
    checkPoint: function(c) {
        throw "Not implemented";
    }
};