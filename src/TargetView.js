var LiveShot = require('liveshot-core');
var CanvasView = require('./CanvasView');

function TargetView() {
    this.shotRenderer = new LiveShot.ShotRenderer();
}

TargetView.prototype = new CanvasView();
TargetView.prototype.constructor = TargetView;
module.exports = TargetView;

// --- External API ---
TargetView.prototype.setCard = function (card) {
    this.setTarget(card.config.targetID);
    this.setGaugeSize(card.config.gaugeSize);
    this.setShots(card.result.shots);

    this.updateScale();
    this.draw();
};

// --- Internal API ---
TargetView.prototype.setTarget = function (targetID) {
    if (this.targetID == targetID) {
        return;
    }

    this.targetID = targetID;

    this.targetRenderer = LiveShot.targets.getRenderer(this.targetID);
    this.scaler = LiveShot.targets.getScaler(this.targetID);
};

TargetView.prototype.setShots = function (shots) {
    if (this.shots == shots) {
        return;
    }

    this.shots = shots;

    this.scaler.setShots(shots);
    this.shotRenderer.setShots(shots);
};

TargetView.prototype.setGaugeSize = function (gaugeSize) {
    if (this.gaugeSize == gaugeSize) {
        return;
    }

    this.gaugeSize = gaugeSize;
    this.shotRenderer.setStyle({gaugeSize:gaugeSize});
};

TargetView.prototype.updateScale = function () {
    var scale = this.scaler.getScale();

    this.targetRenderer.setScale(scale);
    this.shotRenderer.setScale(scale);
};

TargetView.prototype.render = function (ctx, rect) {
    if (this.targetRenderer == null) {
        return;
    }

    this.targetRenderer
        .setContext(ctx)
        .setRect(rect)
        .render();

    this.shotRenderer
        .setContext(ctx)
        .setRect(rect)
        .render();
};
