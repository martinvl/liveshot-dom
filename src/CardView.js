var inherits = require('inherits');
var LiveShot = require('liveshot-core');
var CanvasView = require('./CanvasView');

function CardView() {
    this.initialize();
}

module.exports = CardView;
inherits(CardView, CanvasView);

// --- External API ---
CardView.prototype.setCard = function (card) {
    this.setTarget(card.config.targetID);
    this.setGaugeSize(card.config.gaugeSize);
    this.setShots(card.result.shots);

    this.updateScale();
    this.draw();
};

// --- Internal API ---
CardView.prototype.initialize = function () {
    CanvasView.prototype.initialize.apply(this);

    this.shotRenderer = new LiveShot.ShotRenderer();
};

CardView.prototype.setTarget = function (targetID) {
    if (this.targetID == targetID) {
        return;
    }

    this.targetID = targetID;

    this.targetRenderer = LiveShot.targets.getRenderer(this.targetID);
    this.scaler = LiveShot.targets.getScaler(this.targetID);
};

CardView.prototype.setShots = function (shots) {
    if (this.shots == shots) {
        return;
    }

    this.shots = shots;

    this.scaler.setShots(shots);
    this.shotRenderer.setShots(shots);
};

CardView.prototype.setGaugeSize = function (gaugeSize) {
    if (this.gaugeSize == gaugeSize) {
        return;
    }

    this.gaugeSize = gaugeSize;
    this.shotRenderer.setStyle({gaugeSize:gaugeSize});
};

CardView.prototype.updateScale = function () {
    var scale = this.scaler.getScale();

    this.targetRenderer.setScale(scale);
    this.shotRenderer.setScale(scale);
};

CardView.prototype.render = function (ctx, rect) {
    this.renderTarget(ctx, rect);
};

CardView.prototype.renderTarget = function (ctx, rect) {
    if (this.targetRenderer == null) {
        return;
    }

    var targetRect = this.getTargetRect(rect);

    this.targetRenderer
        .setContext(ctx)
        .setRect(targetRect)
        .render();

    this.shotRenderer
        .setContext(ctx)
        .setRect(targetRect)
        .render();
};

CardView.prototype.getTargetRect = function (rect) {
    return rect;
};
