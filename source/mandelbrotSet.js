window.onload = function (){
    var maxIter = 15;

    var x_min = -2, x_max = 0.75, y_min = -1.5, y_max = 1.5;

    function f(z, c){
        return z.square().add(c);
    }

    var canvas = document.getElementById('main');
    var ctx = canvas.getContext('2d');
    var width = canvas.width, height = canvas.height;

    function translatePoint(px, py) {
        var x_range = x_max - x_min;
        var px_shift = width * Math.abs(x_min) / x_range; // shift to center for canvas coordinates
        var x = (px - px_shift) * x_range / width;

        var y_range = y_max - y_min;
        var py_shift = height * Math.abs(y_min) / y_range;
        var y = -1 * (py - py_shift) * y_range / height;

        return new Complex(x, y);
    }

    function checkPoint(c) {
        var z = new Complex(0, 0);
        for (var i = 1; i <= maxIter; i++) {
            z = f(z, c);
            if (z.abs() > 2) return false;
        }
        return true;
    }

    ctx.fillStyle = "#000000";
    for (var w = 0; w <= width; w++){
        for (var h = 0; h <= height; h++){
            var c = translatePoint(w, h);
            if (checkPoint(c)) {
                console.log('ok');
                // belongs to set - color black                
                ctx.fillRect(w, h, 1, 1);
            } else {
                // does not belong to set - do nothing (color white)
            }            
        }
    }
}