var MegalinkCardView = require('./MegalinkCardView');

function MegalinkRangeView() {
    this.initialize();
}

module.exports = MegalinkRangeView;

// --- External API ---
MegalinkRangeView.prototype.setRange = function (range) {
    this.range = range;

    while (this.cardViews.length < range.cards.length) {
        var cardView = new MegalinkCardView();
        cardView.canvas.style.marginBottom = '-4px';
        this.el.appendChild(cardView.canvas);

        this.cardViews.push(cardView);
    }

    while (this.cardViews.length > range.cards.length) {
        var cardView = this.cardViews.pop();
        this.el.removeChild(cardView.canvas);
    }

    var i = 0;
    for (var idx in range.cards) {
        var card = range.cards[idx];
        var cardView = this.cardViews[i++];

        cardView.setCard(card);
    }

    this.updateSize();
    this.draw();
};

// --- Internal API ---
MegalinkRangeView.HEADER_HEIGHT = 90;
MegalinkRangeView.HEADER_MARGIN = 8;
MegalinkRangeView.HEADER_FONT_COLOR = 'rgb(0, 0, 0)';

MegalinkRangeView.prototype.initialize = function () {
    this.el = document.createElement('div');

    this.header = document.createElement('canvas');
    this.el.appendChild(this.header);

    this.cardViews = [];
};

MegalinkRangeView.prototype.draw = function () {
    if (this.range) {
        this.drawHeader();
    }

    for (var idx in this.cardViews) {
        var cardView = this.cardViews[idx];

        cardView.draw();
    }
};

MegalinkRangeView.prototype.drawHeader = function () {
    var ctx = this.header.getContext('2d');
    var rect = {
        x:0,
        y:0,
        width:this.header.width,
        height:this.header.height
    };

    ctx.clearRect(rect.x, rect.y, rect.width, rect.height);

    this.renderHeader(ctx, rect);
};

MegalinkRangeView.prototype.renderHeader = function (ctx, rect) {
    this.renderHost(ctx, rect);
    this.renderRangeRelay(ctx, rect);
    this.renderLogo(ctx, rect);
};

MegalinkRangeView.prototype.renderHost = function (ctx, rect) {
    var hostRect = MegalinkRangeView.getHostRect(rect);
    var host = this.range.host;

    ctx.fillStyle = MegalinkRangeView.HEADER_FONT_COLOR;
    this.setFont(ctx, host, hostRect.width, hostRect.height);
    ctx.textAlign = 'center';
    ctx.fillText(host, hostRect.x + hostRect.width/2, hostRect.y + hostRect.height/2);
    ctx.textAlign = 'left';
};

MegalinkRangeView.prototype.renderRangeRelay = function (ctx, rect) {
    var rangeRelay = this.range.name + ' - Lag nr ' + this.range.relay;
    var rangeRelayRect = MegalinkRangeView.getRangeRelayRect(rect);

    ctx.fillStyle = MegalinkRangeView.HEADER_FONT_COLOR;
    this.setFont(ctx, rangeRelay, rangeRelayRect.width, rangeRelayRect.height);

    ctx.textBaseline = 'middle';
    ctx.fillText(rangeRelay, rangeRelayRect.x, rangeRelayRect.y + rangeRelayRect.height/2);
    ctx.textBaseline = 'alphabetic';
};

MegalinkRangeView.prototype.renderLogo = function (ctx, rect) {
    if (!this.logo || this.logo.width == 0) {
        this.logo = new Image();
        this.logo.src = 'images/mllogo.png';

        var self = this;
        this.logo.onload = function () {
            self.renderLogo(ctx, rect);
        };

        return;
    }

    var left = rect.width - MegalinkRangeView.HEADER_MARGIN - this.logo.width;
    var top = MegalinkRangeView.HEADER_MARGIN;

    ctx.drawImage(this.logo, left, top);
};

MegalinkRangeView.prototype.updateSize = function () {
    var width = this.el.clientWidth;
    var height = this.el.clientHeight - MegalinkRangeView.HEADER_HEIGHT;

    this.header.width = width;
    this.header.height = MegalinkRangeView.HEADER_HEIGHT;

    var N = this.cardViews.length;
    var minBadness = Number.MAX_VALUE;
    var bestM = 0;
    var bestN = 0;

    for (var m = 1; m <= N; ++m) {
        var n = Math.ceil(N / m);
        var cardWidth = width/n;
        var cardHeight = height/m;
        var targetRect = MegalinkCardView.getTargetRect({x:0, y:0, width:cardWidth, height:cardHeight});

        var aspectRatio = targetRect.width / targetRect.height;
        var optimalRatio = 1;
        var ratioBadness =  Math.abs(aspectRatio - optimalRatio) + Math.abs(1/aspectRatio - 1/optimalRatio);
        var cellCountBadness = Math.abs(n*m - N);
        var badness = ratioBadness + cellCountBadness;

        if (badness < minBadness) {
            minBadness = badness;
            bestM = m;
            bestN = n;
        }
    }

    var m = bestM;
    var n = bestN;

    var cardWidth = width/n;
    var cardHeight = height/m;

    for (var i = 0; i < m; ++i) {
        for (var j = 0; j < n; ++j) {
            var cardViewIdx = i*n + j;
            if (cardViewIdx >= this.cardViews.length) {
                break;
            }

            var cardView = this.cardViews[cardViewIdx];

            var leftEdge = Math.floor(j*cardWidth);
            var rightEdge = Math.floor((j + 1)*cardWidth);
            cardView.canvas.width = rightEdge - leftEdge;
            cardView.canvas.style.width = cardView.canvas.width + 'px';

            var topEdge = Math.floor(i*cardHeight);
            var bottomEdge = Math.floor((i + 1)*cardHeight);
            cardView.canvas.height = bottomEdge - topEdge;
            cardView.canvas.style.height = cardView.canvas.height + 'px';
        }
    }
};

MegalinkRangeView.prototype.setFont = function (ctx, text, width, height) {
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

MegalinkRangeView.getRangeRelayRect = function (rect) {
    return {
        x:rect.x + 3*MegalinkRangeView.HEADER_MARGIN,
        y:rect.y + MegalinkRangeView.HEADER_MARGIN,
        width:rect.width/5,
        height:rect.height - 2*MegalinkRangeView.HEADER_MARGIN
    };
};

MegalinkRangeView.getHostRect = function (rect) {
    return {
        x:rect.x + rect.width/4,
        y:rect.y + 2*rect.height/5,
        width:rect.width/2,
        height:rect.height/2
    };
};
