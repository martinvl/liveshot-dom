var inherits = require('inherits');
var LiveShot = require('liveshot-core');
var CardView = require('../CardView');

// --- Constants ---
var MARGINH = 5;
var MARGINV = 3;

var MAX_SHOTS = 10;

var BACKGROUND_COLOR = 'rgb(255, 255, 255)';
var FONT_COLOR = 'rgb(0, 0, 0)';

var GAUGE_COLOR = 'rgb(0, 0, 0)';
var MARKER_COLOR = 'rgb(0, 255, 0)';
var LAST_MARKER_COLOR = 'rgb(255, 0, 0)';

var TRIANGLE_COLOR = 'rgb(200, 200, 200)';
var TRIANGLE_BORDER_COLOR = 'rgb(150, 150, 150)';

var LANE_NUMBER_BACK_COLOR = 'rgba(64, 64, 64, 0.7)';
var LANE_NUMBER_FRONT_COLOR = 'rgb(245, 245, 245)';

function MegalinkCardView() {
    this.initialize();
}

module.exports = MegalinkCardView;
inherits(MegalinkCardView, CardView);

// --- Internal API ---
MegalinkCardView.prototype.initialize = function () {
    CardView.prototype.initialize.apply(this);

    this.style = {
        backgroundColor:BACKGROUND_COLOR,
        fontColor:FONT_COLOR
    };

    this.canvas = document.createElement('canvas');

    this.shotRenderer = new LiveShot.ShotRenderer();
    this.shotRenderer.setStyle({
        gaugeColor:GAUGE_COLOR,
        markerColor:MARKER_COLOR,
        lastMarkerColor:LAST_MARKER_COLOR
    });

    this.triangleRenderer.setStyle({
        color:TRIANGLE_COLOR,
        borderColor:TRIANGLE_BORDER_COLOR
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
    this.renderLaneNumber(ctx, rect);
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
    this.renderSeriesName(ctx, MegalinkCardView.getSeriesNameRect(rect));
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

MegalinkCardView.prototype.renderSeriesName = function (ctx, rect) {
    var seriesName = this.card.result.seriesName;

    this.setFont(ctx, seriesName, rect.width, rect.height);
    ctx.textBaseline = "bottom";
    ctx.textAlign = "left";

    ctx.fillStyle = this.style.fontColor;
    ctx.fillText(seriesName, rect.x, rect.y + rect.height);
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

MegalinkCardView.prototype.renderLaneNumber = function (ctx, rect) {
    rect = MegalinkCardView.getLaneNumberRect(rect);
    var laneNumber = this.card.lane;

    ctx.fillStyle = LANE_NUMBER_BACK_COLOR;
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

    this.setFont(ctx, laneNumber, .8*rect.width, .8*rect.height);
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    ctx.fillStyle = LANE_NUMBER_FRONT_COLOR;
    ctx.fillText(laneNumber, rect.x + rect.width/2, rect.y + rect.height/2);
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
    var offset = Math.max(0, this.card.result.shots.length - MAX_SHOTS);
    var shots = this.card.result.shots.slice(-MAX_SHOTS);
    var shotNum = 1;

    for (var idx in shots) {
        var shot = shots[idx];
        var shotRect = this.getShotRect(shotNum, rect);

        this.renderShot(ctx, shotNum + offset, shot, shotRect);

        ++shotNum;
    }
};

MegalinkCardView.prototype.renderShot = function (ctx, shotNum, shot, rect) {
    this.setFont(ctx, '10:', .4*rect.width, .9*rect.height);
    ctx.textBaseline = 'middle';
    ctx.fillStyle = this.style.fontColor;

    // draw shot number
    ctx.textAlign = 'left';
    ctx.fillText(shotNum + ':', rect.x + 3, rect.y - rect.height/2);

    // draw shot value
    ctx.textAlign = 'right';
    ctx.fillText(shot.value, rect.x + rect.width - 5, rect.y - rect.height/2);
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

    var width = rect.width;
    var height = .55*rect.height;

    return {
        x:rect.x + MARGINH,
        y:rect.y + MARGINV,
        width:width - 2*MARGINH,
        height:height - 2*MARGINV
    };
};

MegalinkCardView.getClubRect = function (rect) {
    var rect = MegalinkCardView.getHeaderRect(rect);

    var width = .55*rect.width;
    var height = .45*rect.height;

    return {
        x:rect.x + MARGINH,
        y:rect.y + rect.height - height + MARGINV,
        width:width - 3/2*MARGINH,
        height:height - 2*MARGINV
    };
};

MegalinkCardView.getSeriesNameRect = function (rect) {
    var rect = MegalinkCardView.getHeaderRect(rect);

    var width = .25*rect.width;
    var height = .45*rect.height;

    return {
        x:rect.x + .55*rect.width + MARGINH/2,
        y:rect.y + rect.height - height + MARGINV,
        width:width - MARGINH,
        height:height - 2*MARGINV
    };
};

MegalinkCardView.getClassRect = function (rect) {
    var rect = MegalinkCardView.getHeaderRect(rect);

    var width = .13*rect.width;
    var height = .45*rect.height;

    return {
        x:rect.x + .8*rect.width + MARGINH/2,
        y:rect.y + rect.height - height + MARGINV,
        width:width - MARGINH,
        height:height - 2*MARGINV
    };
};

MegalinkCardView.getCategoryRect = function (rect) {
    var rect = MegalinkCardView.getHeaderRect(rect);

    var width = .07*rect.width;
    var height = .45*rect.height;

    return {
        x:rect.x + .93*rect.width + MARGINH/2,
        y:rect.y + rect.height - height + MARGINV,
        width:width - 3/2*MARGINH,
        height:height - 2*MARGINV
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

MegalinkCardView.getLaneNumberRect = function (rect) {
    var targetRect = MegalinkCardView.getTargetRect(rect);
    var size = Math.min(targetRect.width, targetRect.height) / 5;

    targetRect.width = size;
    targetRect.height = size;

    return targetRect;
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
