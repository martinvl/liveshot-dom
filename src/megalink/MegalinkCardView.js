var inherits = require('inherits');
var LiveShot = require('liveshot-core');
var CardView = require('../CardView');

function MegalinkCardView() {
    this.initialize();
}

module.exports = MegalinkCardView;
inherits(MegalinkCardView, CardView);

// --- Internal API ---
MegalinkCardView.prototype.initialize = function () {
    CardView.prototype.initialize.apply(this);

    this.style = {
        backgroundColor:'rgb(255, 255, 255)',
        fontColor:'rgb(0, 0, 0)'
    };

    this.canvas = document.createElement('canvas');

    this.shotRenderer = new LiveShot.ShotRenderer();
    this.shotRenderer.setStyle({
        gaugeColor:'rgb(0, 0, 0)',
        markerColor:'rgb(0, 255, 0)',
        lastMarkerColor:'rgb(255, 0, 0)'
    });

    this.triangleRenderer.setStyle({
        color:'rgb(248, 255, 0)',
        borderColor:'rgb(0, 0, 0)',
    });
};

MegalinkCardView.prototype.setTarget = function (targetID) {
    if (this.targetID == targetID) {
        return;
    }

    this.targetID = targetID;

    this.targetRenderer = LiveShot.targets.getRenderer(this.targetID);
    this.targetRenderer.setStyle({
        drawFullTarget:true
    });
    this.scaler = LiveShot.targets.getScaler(this.targetID);
};

MegalinkCardView.prototype.setShots = function (shots) {
    if (this.shots == shots) {
        return;
    }

    this.shots = shots;

    this.scaler.setShots(shots);
    this.shotRenderer.setShots(shots);
};

MegalinkCardView.prototype.setGaugeSize = function (gaugeSize) {
    if (this.gaugeSize == gaugeSize) {
        return;
    }

    this.gaugeSize = gaugeSize;
    this.shotRenderer.setStyle({gaugeSize:gaugeSize});
};

MegalinkCardView.prototype.updateScale = function () {
    var scale = this.scaler.getScale();

    this.targetRenderer.setScale(scale);
    this.shotRenderer.setScale(scale);
};

MegalinkCardView.prototype.render = function (ctx, rect) {
    this.renderTarget(ctx, rect);
    this.renderHeader(ctx, rect);
    this.renderShotList(ctx, rect);
    this.renderSums(ctx, rect);
};

MegalinkCardView.prototype.renderTarget = function (ctx, rect) {
    CardView.prototype.renderTarget.apply(this, [ctx, rect]);

    this.strokeFrame(ctx, MegalinkCardView.getTargetRect(rect));
};

MegalinkCardView.prototype.renderHeader = function (ctx, rect) {
    this.drawFrame(ctx, MegalinkCardView.getHeaderRect(rect));

    this.renderName(ctx, MegalinkCardView.getNameRect(rect));
    this.renderClub(ctx, MegalinkCardView.getClubRect(rect));
    this.renderClass(ctx, MegalinkCardView.getClassRect(rect));
    this.renderCategory(ctx, MegalinkCardView.getCategoryRect(rect));
};

MegalinkCardView.prototype.renderName = function (ctx, rect) {
    var name = this.card.shooter.name;

    this.setFont(ctx, name, rect.width, rect.height);
    ctx.textBaseline = "top";
    ctx.textAlign = "left";

    ctx.fillStyle = this.style.fontColor;
    ctx.fillText(name, rect.x, rect.y);
};

MegalinkCardView.prototype.renderClub = function (ctx, rect) {
    var club = this.card.shooter.club;

    this.setFont(ctx, club, rect.width, rect.height);
    ctx.textBaseline = "bottom";
    ctx.textAlign = "left";

    ctx.fillStyle = this.style.fontColor;
    ctx.fillText(club, rect.x, rect.y + rect.height);
};

MegalinkCardView.prototype.renderClass = function (ctx, rect) {
    var className = this.card.shooter.className;

    this.setFont(ctx, className, rect.width, rect.height);
    ctx.textBaseline = "bottom";
    ctx.textAlign = "right";

    ctx.fillStyle = this.style.fontColor;
    ctx.fillText(className, rect.x + rect.width, rect.y + rect.height);
};

MegalinkCardView.prototype.renderCategory = function (ctx, rect) {
    var category = this.card.shooter.category;

    this.setFont(ctx, category, rect.width, rect.height);
    ctx.textBaseline = "bottom";
    ctx.textAlign = "right";

    ctx.fillStyle = this.style.fontColor;
    ctx.fillText(category, rect.x + rect.width, rect.y + rect.height);
};

MegalinkCardView.prototype.renderShotList = function (ctx, rect) {
    this.drawFrame(ctx, MegalinkCardView.getShotListRect(rect));

    this.renderList(ctx, rect);
    this.renderShots(ctx, rect);
};

MegalinkCardView.prototype.renderList = function (ctx, rect) {
    var rect = MegalinkCardView.getShotListRect(rect);

    var numRows = this.getNumRows();
    var numColumns = this.getNumColumns();
    var rowHeight = rect.height / numRows;
    var columnWidth = rect.width / numColumns;

    ctx.strokeStyle = this.style.fontColor;
    ctx.beginPath();

    for (var i = 1; i < numRows; ++i) {
        var y = rect.y + i*rowHeight;

        ctx.moveTo(rect.x, y);
        ctx.lineTo(rect.x + rect.width, y);
    }

    for (var i = 1; i < numColumns; ++i) {
        var x = rect.x + i*columnWidth;

        ctx.moveTo(x, rect.y);
        ctx.lineTo(x, rect.y + rect.height);
    }

    ctx.stroke();
    ctx.closePath();
};

MegalinkCardView.prototype.renderShots = function (ctx, rect) {
    var shots = this.card.result.shots;

    var shotNum = 1;
    for (var idx in shots) {
        var shot = shots[idx];
        var shotRect = this.getShotRect(shotNum, rect);

        this.renderShot(ctx, shotNum, shot, shotRect);

        ++shotNum;
    }
};

MegalinkCardView.prototype.renderShot = function (ctx, shotNum, shot, rect) {
    this.setFont(ctx, '', rect.width, .9*rect.height);
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = this.style.fontColor;

    // draw shot number
    ctx.textAlign = 'right';
    ctx.fillText(shotNum + ':', rect.x + .3*rect.width, rect.y);

    // draw shot value
    ctx.textAlign = 'right';
    ctx.fillText(shot.value, rect.x + rect.width - 5, rect.y);
};

MegalinkCardView.prototype.getShotRect = function (shotNum, rect) {
    var numRows = this.getNumRows();
    var numColumns = this.getNumColumns();
    var rect = MegalinkCardView.getShotListRect(rect);

    var cellWidth = rect.width / numColumns;
    var cellHeight = rect.height / numRows;

    var j = Math.floor((shotNum - 1) / numRows);
    var i = shotNum - j*numRows;

    return {
        x:rect.x + j*cellWidth,
        y:rect.y + i*cellHeight,
        width:cellWidth,
        height:cellHeight
    };
};

MegalinkCardView.prototype.getNumRows = function () {
    return 5; // XXX set as style property?
};

MegalinkCardView.prototype.getNumColumns = function () {
    var numShots = 0;
    for (var idx in this.card.result.shots) ++numShots;

    return Math.min(2, Math.ceil(numShots / this.getNumRows()));
};

MegalinkCardView.prototype.renderSums = function (ctx, rect) {
    var rect = MegalinkCardView.getSumsRect(rect);

    this.drawFrame(ctx, rect);

    ctx.fillStyle = this.style.fontColor;
    ctx.fillRect(rect.x + .5*rect.width, rect.y, .5*rect.width, rect.height);

    // draw text
    var seriesSum = this.card.result.seriesSum;
    var totalSum = this.card.result.totalSum;

    this.setFont(ctx, totalSum, .6*rect.width, .6*rect.height);
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    ctx.fillStyle = this.style.fontColor;
    ctx.fillText(seriesSum, rect.x + .25*rect.width, rect.y + .5*rect.height);

    ctx.fillStyle = this.style.backgroundColor;
    ctx.fillText(totalSum, rect.x + .75*rect.width, rect.y + .5*rect.height);
};

// --- Rendering utilities ---
MegalinkCardView.prototype.strokeFrame = function (ctx, rect) {
    ctx.strokeStyle = this.style.fontColor;
    ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
};

MegalinkCardView.prototype.drawFrame = function (ctx, rect) {
    ctx.fillStyle = this.style.backgroundColor;
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

    this.strokeFrame(ctx, rect);
};

MegalinkCardView.prototype.setFont = function (ctx, text, width, height) {
    var fontName = "arial";
    var refSize = 10;

    // get reference text width
    ctx.font = refSize + "px " + fontName;
    var refTextWidth = ctx.measureText(text).width;

    // calculate maximum textHeight
    var textHeight = Math.min(height, width/refTextWidth * refSize);

    // assemble font name
    ctx.font = textHeight + "px " + fontName;
};

// --- Rect stuff ---
MegalinkCardView.isPortrait = function (rect) {
    return rect.width / rect.height < 1;
};

MegalinkCardView.prototype.getTargetRect = function (rect) {
    return MegalinkCardView.getTargetRect(rect);
};

MegalinkCardView.getTargetRect = function (rect) {
    if (MegalinkCardView.isPortrait(rect)) {
        return {
            x:rect.x,
            y:rect.y + .125*rect.height,
            width:rect.width,
            height:.5*rect.height
        }
    } else {
        return {
            x:rect.x,
            y:rect.y + .25*rect.height,
            width:.6*rect.width,
            height:.75*rect.height
        };
    }
};

MegalinkCardView.getHeaderRect = function (rect) {
    if (MegalinkCardView.isPortrait(rect)) {
        return {
            x:rect.x,
            y:rect.y,
            width:rect.width,
            height:.125*rect.height
        };
    } else {
        return {
            x:rect.x,
            y:rect.y,
            width:rect.width,
            height:.25*rect.height
        };
    }
};

MegalinkCardView.getNameRect = function (rect) {
    var rect = MegalinkCardView.getHeaderRect(rect);

    return {
        x:rect.x + 5,
        y:rect.y + 3,
        width:rect.width - 10,
        height:.45*(rect.height - 6)
    };
};

MegalinkCardView.getClubRect = function (rect) {
    var rect = MegalinkCardView.getHeaderRect(rect);

    var width = .6*(rect.width - 10);
    var height = .35*(rect.height - 10);
    var marginH = 5;
    var marginV = 3;

    return {
        x:rect.x + 5,
        y:rect.y + rect.height - height - marginV,
        width:width,
        height:height
    };
};

MegalinkCardView.getClassRect = function (rect) {
    var rect = MegalinkCardView.getHeaderRect(rect);

    var width = 20;
    var height = .35*(rect.height - 10);
    var marginH = 5;
    var marginV = 3;

    return {
        x:this.getCategoryRect(rect).x - width - marginH,
        y:rect.y + rect.height - height - marginV,
        width:width,
        height:height
    };
};

MegalinkCardView.getCategoryRect = function (rect) {
    var rect = MegalinkCardView.getHeaderRect(rect);

    var width = 8;
    var height = .35*(rect.height - 10);
    var marginH = 5;
    var marginV = 3;

    return {
        x:rect.x + rect.width - width - marginH,
        y:rect.y + rect.height - height - marginV,
        width:width,
        height:height
    };
};

MegalinkCardView.getShotListRect = function (rect) {
    if (MegalinkCardView.isPortrait(rect)) {
        return {
            x:rect.x,
            y:rect.y + .625*rect.height,
            width:rect.width,
            height:.25*rect.height
        };
    } else {
        return {
            x:rect.x + .6*rect.width,
            y:rect.y + .25*rect.height,
            width:.4*rect.width,
            height:.55*rect.height
        };
    }
};

MegalinkCardView.getSumsRect = function (rect) {
    if (MegalinkCardView.isPortrait(rect)) {
        return {
            x:rect.x,
            y:rect.y + .875*rect.height,
            width:rect.width,
            height:.125*rect.height
        };
    } else {
        return {
            x:rect.x + .6*rect.width,
            y:rect.y + .80*rect.height,
            width:.4*rect.width,
            height:.20*rect.height
        };
    }
};
