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
        {label: 'Max Iterations', id: 'maxIter', tip: 'Max iterations'}
    ],
    checkerFactory: function(parameterValues) {
        return new MandelbrotSetChecker(parameterValues['maxIter']);
    }
});

var AllSetDescriptors = [MandelbrotSetDescriptor];