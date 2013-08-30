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
MegalinkRangeView.prototype.initialize = function () {
    this.el = document.createElement('div');
    this.cardViews = [];
};

MegalinkRangeView.prototype.draw = function () {
    for (var idx in this.cardViews) {
        var cardView = this.cardViews[idx];

        cardView.draw();
    }
};

MegalinkRangeView.prototype.updateSize = function () {
    var width = this.el.clientWidth;
    var height = this.el.clientHeight;

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
