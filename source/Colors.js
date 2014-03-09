function ColorProvider(palette, colorScaleSize) {
    this.palette = palette;
    this.colorScaleSize = colorScaleSize;
}

ColorProvider.prototype = {
    _getPaletteColor: function(rate) {
        for (var i=0; i<this.palette.length - 1; i++) {
            if (this.palette[i].rate <= rate && rate <= this.palette[i+1].rate) {
                var localRate = (rate - this.palette[i].rate) / (this.palette[i+1].rate - this.palette[i].rate);
                return this._getColor(this.palette[i].hue, this.palette[i+1].hue, localRate);
            }
        }

        throw "rate is " + rate + ", should be between 0 and 1";
    },

    _getColor: function(minHue, maxHue, rate) {
        var r = Math.round(maxHue.r * rate + minHue.r * (1.0 - rate));
        var g = Math.round(maxHue.g * rate + minHue.g * (1.0 - rate));
        var b = Math.round(maxHue.b * rate + minHue.b * (1.0 - rate));

        return 'rgb(' + r + ',' + g + ',' + b + ')';
    },

    getColor: function(colorNumber) {
        throw "Not implemented";
    }
}

function LinearGradientColorProvider(startHue, endHue, colorScaleSize) {
    var palette = [
        {rate: 0.0, hue: startHue},
        {rate: 1.0, hue: endHue}
    ];

    ColorProvider.call(this, palette, colorScaleSize);
}

LinearGradientColorProvider.prototype = Object.create(ColorProvider.prototype);

LinearGradientColorProvider.prototype.constructor = LinearGradientColorProvider;

LinearGradientColorProvider.prototype.getColor = function (colorNumber) {
    var rate = 1 - colorNumber / this.colorScaleSize;
    return this._getPaletteColor(rate);
};

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
