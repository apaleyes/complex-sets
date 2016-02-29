function DomUtils () {}
DomUtils.addOption = function(value, text, parent) {
    var opt = document.createElement('option');
    opt.value = value;
    opt.innerHTML = text;
    parent.appendChild(opt);
}

DomUtils.clearSelect = function(select) {
    select.options.length = 0;
}

DomUtils.addSpan = function(text, parent) {
    var span = document.createElement('span');
    span.innerHTML = text;
    parent.appendChild(span);
}

DomUtils.addInput = function(name, type, parent, defaultValue) {
    var input = document.createElement('input');
    input.type = type;
    input.name = name;
    if (defaultValue) {
        input.value = defaultValue;
    }
    parent.appendChild(input);
}
