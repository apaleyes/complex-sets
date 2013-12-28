window.onload = function (){
    var maxIter = 20;

    var c = new Complex(1/3, 1/3);
    function f(z) {
        return z.square().add(c);
    }
    var R = (1.0 + Math.sqrt(1 + 4 * c.abs())) / 2.0;

    var canvas = document.getElementById('main');
    var canvasRect = canvas.getBoundingClientRect();
    var ctx = canvas.getContext('2d');
    var defaults = {
       x_min: -R,
       x_max: R,
       y_min: -R,
       y_max: R 
    };
    var x_min = defaults.x_min, x_max = defaults.x_max, y_min = defaults.y_min, y_max = defaults.y_max;
    var width = canvas.width, height = canvas.height;

    function translateX(px, boundaries) {
        var x_range = boundaries.x_max - boundaries.x_min;
        // var px_shift = width * Math.abs(boundaries.x_min) / x_range; // shift to center for canvas coordinates
        // var x = (px - px_shift) * x_range / width;
        var x = x_range / width * px + boundaries.x_min;
        return x;
    }

    function translateY(py, boundaries) {
        var y_range = boundaries.y_max - boundaries.y_min;
        // var py_shift = height * Math.abs(boundaries.y_min) / y_range;
        // var y = -1 * (py - py_shift) * y_range / height;
        var y = -1.0 * y_range / height * py + boundaries.y_max;
        return y;
    }

    function translatePoint(px, py, boundaries) {
        var x = translateX(px, boundaries);
        var y = translateY(py, boundaries);

        return new Complex(x, y);
    }

    function checkPoint(z) {
        for (var i = 1; i <= maxIter; i++) {
            z = f(z);
            if (z.abs() > R) return false;
        }
        return true;
    }

    function clearCanvas() {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawSet() {
        ctx.fillStyle = "#000000";
        for (var w = 0; w <= width; w++){
            for (var h = 0; h <= height; h++){
                var z = translatePoint(w, h, {x_min:x_min, x_max:x_max, y_min:y_min, y_max:y_max});
                if (checkPoint(z)) {
                    // belongs to set - color black                
                    //ctx.putImageData(pixelData, w, h);
                    
                    ctx.fillRect(w, h, 1, 1);
                } else {
                    // does not belong to set - do nothing (color white)
                }            
            }
        }
    }

    drawSet();

    var startX = -1;
    var startY = -1;
    canvas.onmousedown = function (e) {
        // startX = e.clientX - canvasRect.left;
        // startY = e.clientY - canvasRect.top;
        startX = (e.clientX - canvasRect.left) / canvas.clientWidth * width; console.log(startX);
        startY = (e.clientY - canvasRect.top) / canvas.clientHeight * height; console.log(startY);
    }

    canvas.onmouseup = function (e) {
        if (startX < 0 || startY < 0) {
            return;
        }

        // var endX = e.clientX - canvasRect.left;
        // var endY = e.clientY - canvasRect.top;

        var endX = (e.clientX - canvasRect.left) / canvas.clientWidth * width;
        var endY = (e.clientY - canvasRect.top) / canvas.clientHeight * height;

        // console.log(startX);
        // console.log(startY);
        // console.log(endX);
        // console.log(endY);

        var prev = {x_min:x_min, x_max:x_max, y_min:y_min, y_max:y_max};
        x_min = translateX(Math.min(startX, endX), prev);
        x_max = translateX(Math.max(startX, endX), prev);
        y_min = translateY(Math.max(startY, endY), prev);
        y_max = translateY(Math.min(startY, endY), prev);
        
        // console.log(x_min);
        // console.log(x_max);
        // console.log(y_min);
        // console.log(y_max);

        maxIter *= 2;
        clearCanvas();
        drawSet();

        startX = -1;
        startY = -1;
    }
}