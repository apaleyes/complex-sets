function ComplexSetDescriptor(options) {
	this.name = options.name;
    this.id = options.id;
	this.axesFactory = options.axesFactory;
    this.parameters = options.parameters;
    this.checkerFactory = options.checkerFactory;
}

ComplexSetDescriptor.prototype.constructor = ComplexSetDescriptor;

ComplexSetDescriptor.prototype.getAxes = function(parameterValues) {
    return this.axesFactory(parameterValues);
}

ComplexSetDescriptor.prototype.getChecker = function(parameterValues) {
    return this.checkerFactory(parameterValues);
}

var MandelbrotSetDescriptor = new ComplexSetDescriptor({
    id: 'mandelbrot-set',
    name: 'Mandelbrot Set',
    axesFactory: function(parameterValues) {
        return {x_min: -2, x_max: 0.75, y_min: -1.5, y_max: 1.5};
    },
    parameters: [
        {label: 'Max Iterations', id: 'maxIter', tip: 'Max iterations', defaultValue: '50'}
    ],
    checkerFactory: function(parameterValues) {
        return new MandelbrotSetChecker(parameterValues['maxIter']);
    }
});

var JuliaSetDescriptor = new ComplexSetDescriptor({
    id: 'julia-set',
    name: 'Julia Set',
    axesFactory: function(parameterValues) {
        var c = new Complex(parameterValues['cReal'], parameterValues['cImg']);
        var R = this.getR(c);
        return {x_min: -R, x_max: R, y_min: -R, y_max: R};
    },
    parameters: [
        {label: 'Max Iterations', id: 'maxIter', tip: 'Max iterations', defaultValue: '50'},
        {label: 'c real', id: 'cReal', tip: 'c real', defaultValue: '0.3'},
        {label: 'c img', id: 'cImg', tip: 'c img', defaultValue: '0.5'}
    ],
    checkerFactory: function(parameterValues) {
        var maxIter = parameterValues['maxIter'];
        var c = new Complex(parameterValues['cReal'], parameterValues['cImg']);
        var R = this.getR(c);
        return new JuliaSetChecker(maxIter, c, R);
    }
});
JuliaSetDescriptor.getR = function(c) {
    return (1.0 + Math.sqrt(1 + 4 * c.abs())) / 2.0;
};

var AllSetDescriptors = [MandelbrotSetDescriptor, JuliaSetDescriptor];