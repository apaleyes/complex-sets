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
