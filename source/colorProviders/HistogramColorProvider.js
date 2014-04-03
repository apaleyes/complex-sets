function HistogramColorProvider(palette, colorScaleSize) {
    ColorProvider.call(this, palette, colorScaleSize);

    this.histogram = [];
    this.histogramTotal;

    for (var i = 0; i < this.colorScaleSize; i++) {
        this.histogram.push(0);
    }

    // Histogram cannot be used before it is built
    this.histogramIsBuilt = false;
}

HistogramColorProvider.prototype = Object.create(ColorProvider.prototype);

HistogramColorProvider.prototype.constructor = HistogramColorProvider;

HistogramColorProvider.prototype.countColor = function (colorNumber) {
    this.histogram[colorNumber - 1]++;

    // Histogram has to be rebuilt
    this.histogramIsBuilt = false;
}

HistogramColorProvider.prototype._ensureHistogramIsBuilt = function() {
    if (!this.histogramIsBuilt) {
        this._buildHistogram();
    }
}

HistogramColorProvider.prototype._buildHistogram = function () {
    this.histogramTotal = 0.0;
    for (var i = 0; i < this.colorScaleSize; i += 1) {
        this.histogramTotal += this.histogram[i];
    }

    this.histogramIsBuilt = true;
}

HistogramColorProvider.prototype.getColor = function (colorNumber) {
    this._ensureHistogramIsBuilt();

    var rate = 0.0;
    for (var i = 0; i < colorNumber; i += 1) {
        rate += this.histogram[i] / this.histogramTotal;
    }

    // maybe dirty, but working workaround for numbers like 1.0000000000004
    if (rate > 1.0) {
        rate = 1.0;
    }

    return this._getPaletteColor(rate);
}
