function ComplexSetDescriptor(options) {
	this.name = options.name;
    this.id = options.id;
	this.axesFactory = options.axesFactory;
    this.parameters = options.parameters;
    this.checkerFactory = options.checkerFactory;
    this.description = options.description;
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
    description: 'The Mandelbrot set is the set of complex numbers <i>c</i> for which the function ' +
                 '<i>f<sub>c</sub>(z) = z<sup>2</sup> + c</i> ' +
                 'does not diverge when iterated from <i>z = 0</i>, ' +
                 'i.e. for which the sequence ' +
                 '<i>f<sub>c</sub>(0), f<sub>c</sub>(f<sub>c</sub>(0)), ...</i> ' +
                 'remains bounded in absolute value.',
    axesFactory: function(parameterValues) {
        return {x_min: -2, x_max: 0.75, y_min: -1.5, y_max: 1.5};
    },
    parameters: [{
        label: 'Max Iterations',
        id: 'maxIter',
        tip: 'Max number of iterations before function sequence is considered bounded',
        defaultValue: '50'
    }],
    checkerFactory: function(parameterValues) {
        return new MandelbrotSetChecker(parameterValues['maxIter']);
    }
});

var JuliaSetDescriptor = new ComplexSetDescriptor({
    id: 'julia-set',
    name: 'Julia Set',
    description: 'The Julia set for a given complex number <i>c</i> ' +
                 'is the set of complex numbers <i>z<sub>0</sub></i> for which the function ' +
                 '<i>f<sub>c</sub>(z) = z<sup>2</sup> + c</i> ' +
                 'does not converge to any limit when iterated from <c>z = z<sub>0</sub></c>.' +
                 'i.e. for which the sequence ' +
                 '<i>f<sub>c</sub>(z<sub>0</sub>), f<sub>c</sub>(f<sub>c</sub>(z<sub>0</sub>)), ...</i> ' +
                 'remains unbounded in absolute value.',
    axesFactory: function(parameterValues) {
        var c = new Complex(parameterValues['cReal'], parameterValues['cImg']);
        var R = this.getR(c);
        return {x_min: -R, x_max: R, y_min: -R, y_max: R};
    },
    parameters: [
        {
            label: 'Max Iterations', id: 'maxIter', defaultValue: '50',
            tip: 'Max number of iterations before function sequence is considered bounded'
        },
        {label: 'Real part of c', id: 'cReal', tip: 'Recommended values are between -1 and 1', defaultValue: '0.3'},
        {label: 'Imaginary part of c', id: 'cImg', tip: 'Recommended values are between -1 and 1', defaultValue: '0.5'}
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

var BurningShipSetDescriptor = new ComplexSetDescriptor({
    id: 'burning-ship',
    name: 'Burning Ship Set',
    description: 'The Burning Ship set is the set of complex numbers <i>c</i> for which the function ' +
                 '<i>f<sub>c</sub>(z) = (|Re(z)| + i|Im(z)|)<sup>2</sup> + c</i> ' +
                 'does not diverge when iterated from <i>z = 0</i>, ' +
                 'i.e. for which the sequence ' +
                 '<i>f<sub>c</sub>(0), f<sub>c</sub>(f<sub>c</sub>(0)), ...</i> ' +
                 'remains bounded in absolute value.',
    axesFactory: function(parameterValues) {
        return {x_min: -2, x_max: 0.75, y_min: -1.5, y_max: 1.5};
    },
    parameters: [{
        label: 'Max Iterations',
        id: 'maxIter',
        tip: 'Max number of iterations before function sequence is considered bounded',
        defaultValue: '50'
    }],
    checkerFactory: function(parameterValues) {
        return new BurningShipChecker(parameterValues['maxIter']);
    }
});

var AllSetDescriptors = [MandelbrotSetDescriptor, JuliaSetDescriptor, BurningShipSetDescriptor];