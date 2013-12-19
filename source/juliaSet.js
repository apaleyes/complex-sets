window.onload = function (){
    var maxIter = 20;

    var c = new Complex(1/3, 1/3);
    function f(z) {
        return z.square().add(c);
    }
    var R = (1.0 + Math.sqrt(1 + 4 * c.abs())) / 2.0;

    var x_min = -R, x_max = R, y_min = -R, y_max = R;

    var canvas = document.getElementById('main');
    var ctx = canvas.getContext('2d');
    var width = canvas.width, height = canvas.height;

    function translatePoint(px, py) {
        var x = (px - width/2) * (x_max - x_min) / width;
        var y = -1 * ((py - height/2) * (y_max - y_min) / height);
        return new Complex(x, y);
    }

    function checkPoint(z) {
        for (var i = 1; i <= maxIter; i++) {
            z = f(z);
            if (z.abs() > R) return false;
        }
        return true;
    }

    // var pixelData = ctx.createImageData(1, 1);
    // var data = pixelData.data;
    // data[0] = 0; data[1] = 0; data[2] = 0; data[3] = 255;
    ctx.fillStyle = "#000000"
    for (var w = 0; w <= width; w++){
        for (var h = 0; h <= height; h++){
            var z = translatePoint(w, h);
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