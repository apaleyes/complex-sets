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
