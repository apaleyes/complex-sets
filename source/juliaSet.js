window.onload = function (){
    var maxIter = 20;

    var c = new Complex(1/3, -1/2);
    function f(z) {
        return z.square().add(c);
    }
    var R = (1.0 + Math.sqrt(1 + 4 * c.abs())) / 2.0;

    var defaults = {
       x_min: -R,
       x_max: R,
       y_min: -R,
       y_max: R 
    };

    function checkJuliaPoint(z) {
        for (var i = 1; i <= maxIter; i++) {
            z = f(z);
            if (z.abs() > R) return false;
        }
        return true;
    }

    var canvasManager = new CanvasManager('main', defaults, checkJuliaPoint);
    canvasManager.drawSet();
}