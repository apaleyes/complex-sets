function Complex(x, y){
    if (typeof(x) !== 'undefined') {
        this.x = x;
    } else {
        this.x = 0;
    }

    if (typeof(y) !== 'undefined') {
        this.y = y;
    } else {
        this.y = 0;
    }
}

Complex.prototype = {
    square: function() {
        var x = this.x*this.x - this.y*this.y;
        var y = 2.0 * this.x * this.y;
        return new Complex(x, y);
    },

    add: function(z) {
        if (typeof z === 'number') {
            return new Complex(this.x + z, this.y);
        } else if (z instanceof Complex) {
            return new Complex(this.x + z.x, this.y + z.y);
        } else {
            throw "Illegal summand: " + z;
        }
    },

    abs: function() {
        return Math.sqrt(this.x*this.x + this.y*this.y);
    },

    equals: function(z) {
        if (!(z instanceof Complex)) {
            return false;
        }

        return this.x == z.x && this.y == z.y;
    },

    norm: function() {
        return Math.sqrt(this.normSquared());
    },

    normSquared: function() {
        return this.x*this.x + this.y*this.y;
    }
}