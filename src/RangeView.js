var CanvasView = require('./CanvasView');

function RangeView() {
    CanvasView.prototype.constructor.apply(this);
}

RangeView.prototype = new CanvasView();
RangeView.prototype.constructor = RangeView;
module.exports = RangeView;

// --- External API ---
RangeView.prototype.setRange = function (range) {
    this.draw();
};

// --- Internal API ---
RangeView.prototype.initialize = function () {
    CanvasView.prototype.initialize.apply(this);
};
