function initSetSelect() {
    var DefaultSelectValue = '-';
    var DefaultSelectText = '-- Select a complex set --';

    var setSelect = document.querySelector("#setSelect");

    // Clear all options from the select, just in case
    DomUtils.clearSelect(setSelect);
    DomUtils.add(DomUtils.createOption(DefaultSelectValue, DefaultSelectText), setSelect);
    for (var i = 0; i < AllSetDescriptors.length; i++) {
        var setDescriptor = AllSetDescriptors[i];
        DomUtils.add(DomUtils.createOption(setDescriptor['id'], setDescriptor['name']), setSelect);
    }

    setSelect.onchange = function (e) {
        var selectedValue = e.target.value;
        if (selectedValue !== DefaultSelectValue) {
            processSetSelection(selectedValue);
        }
    }
}

function getDescriptor(setId) {
    for (var i = 0; i < AllSetDescriptors.length; i++) {
        var setDescriptor = AllSetDescriptors[i];
        if (setDescriptor.id === setId) {
            return setDescriptor;
        }
    }

    throw "Invalid set id: " + setId;
}

function processSetSelection(setId) {
    var setDescriptor = getDescriptor(setId);

    var inputParamsContainer = document.querySelector(".controlPanel .inputParams");

    // clear children
    inputParamsContainer.innerHTML = '';

    var addInputParam = function(text, id, defaultValue) {
        var label = document.createElement('label');

        DomUtils.add(DomUtils.createSpan(text), label)
        DomUtils.add(DomUtils.createInput(id, 'text', defaultValue), label);

        DomUtils.add(label, inputParamsContainer);
    }

    for (var i = 0; i < setDescriptor.parameters.length; i++) {
        var param = setDescriptor.parameters[i];
        addInputParam(param['label'], param['id'], param['defaultValue']);
    }
}

function initDrawButton() {
    var drawButton = document.querySelector('.drawButton');

    drawButton.onclick = function () {
        var setSelect = document.querySelector("#setSelect");
        var setId = setSelect.value;
        var setDescriptor = getDescriptor(setId);

        var inputParams = document.querySelectorAll(".controlPanel .inputParams input");
        var paramValues = {};
        for (var i = 0; i < inputParams.length; i++) {
            var inputParam = inputParams[i];
            paramValues[inputParam.name] = parseFloat(inputParam.value);
        }

        drawComplexSet(setDescriptor, paramValues);
    }
}

function drawComplexSet(setDescriptor, paramValues) {
    var palette = [
        {rate: 0.0, hue: {r: 0, g: 0, b: 0}},
        {rate: 0.65, hue: {r: 255, g: 0, b: 0}},
        {rate: 0.99, hue: {r: 255, g: 255, b: 0}},
        {rate: 1.0, hue: {r: 255, g: 255, b: 255}}
    ];
    var histogram = new HistogramColorProvider(palette, paramValues['maxIter']);

    var checker = setDescriptor.getChecker(paramValues);
    var defaultAxes = setDescriptor.getAxes(paramValues);

    var drawStrategy = new PointStrategy({
        checkPoint: function(c) { return checker.checkPoint(c); },
        colorPoint: function(pointData) {
            if (!pointData.inSet) {
                histogram.countColor(pointData.iteration);
            }
        },
        postColorPoint: function(pointData) {
            if (pointData.inSet) {
                return histogram.getColor(paramValues['maxIter']);
            } else {
                return histogram.getColor(pointData.iteration);
            }
        }
    });

    var options = {
        canvasId: 'main',
        zoomCanvasId: 'zoom',
        defaultAxes: defaultAxes,
        drawStrategy: drawStrategy,
        fullScreen: true,
        beforeDrawSet: function() {
            var loader = document.getElementById('loader');
            loader.style.display = 'block';

            var drawButton = document.querySelector('.drawButton');
            drawButton.value = 'Loading ...';
            drawButton.disabled = 'disabled';
        },
        afterDrawSet: function() {
            var loader = document.getElementById('loader');
            loader.style.display = 'none';

            var drawButton = document.querySelector('.drawButton');
            drawButton.value = 'Draw';
            drawButton.disabled = '';
        }
    };

    var canvasWrapper = new ZoomCanvasWrapper(options);
    canvasWrapper.drawSet();
}

window.onload = function () {
    initSetSelect();
    initDrawButton();
};
