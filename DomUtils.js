function DomUtils () {}
DomUtils.createOption = function(value, text) {
    var opt = document.createElement('option');
    opt.value = value;
    opt.innerHTML = text;
    return opt;
}

DomUtils.clearSelect = function(select) {
    select.options.length = 0;
}

DomUtils.createSpan = function(text) {
    var span = document.createElement('span');
    span.innerHTML = text;
    return span;
}

DomUtils.createInput = function(name, type, defaultValue) {
    var input = document.createElement('input');
    input.type = type;
    input.name = name;
    if (defaultValue) {
        input.value = defaultValue;
    }
    return input;
}

DomUtils.createTooltipLink = function(tooltipText) {
    var link = document.createElement('a');
    link.href = 'javascript:void(0);';
    link.title = tooltipText;
    link.className = 'tooltip';
    return link;
}

DomUtils.add = function(element, parent) {
    parent.appendChild(element);
}