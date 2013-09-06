function CanvasView() {
    this.initialize();
}

module.exports = CanvasView;

// --- Internal API ---
CanvasView.prototype.initialize = function () {
    this.canvas = document.createElement('canvas');

    try {
        G_vmlCanvasManager.initElement(this.canvas);
    } catch (err) {};
};

CanvasView.prototype.draw = function () {
    var rect = {
        x:0,
        y:0,
        width:this.canvas.width,
        height:this.canvas.height
    };

    var ctx = this.canvas.getContext('2d');

    ctx.clearRect(rect.x, rect.y, rect.width, rect.height);
    this.render(ctx, rect);
};

CanvasView.prototype.render = function (ctx, rect) {
    // to be overloaded
};
