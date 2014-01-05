var LiveShot = require('../../index');
var Protocol = require('liveshot-protocol');

var CardBuilder = Protocol.CardBuilder;
var RangeBuilder = Protocol.RangeBuilder;

/*
var cardView = new LiveShot.CardView();
document.body.appendChild(cardView.canvas);

var mlCardView = new LiveShot.MegalinkCardView();
document.body.appendChild(mlCardView.canvas);
*/

var rangeView = new LiveShot.MegalinkRangeView();
document.body.appendChild(rangeView.el);

var width = 300;
var height = 400;
var rect = {x:0, y:0, width:width, height:height};

/*
cardView.canvas.width = rect.width;
cardView.canvas.height = rect.height;

mlCardView.canvas.width = rect.width;
mlCardView.canvas.height = rect.height;
*/

updateSize();
window.onresize = updateSize;

function updateSize() {
    var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    rangeView.el.style.width = width + 'px';
    rangeView.el.style.height = height + 'px';

    rangeView.updateSize();
    rangeView.draw();
}

var cardBuilder = new CardBuilder()
    .setLane('1')
    .setName('Martin V. Larsen')
    .setClub('Rygge')
    .setClassName('4')
    .setCategory('A')
    .setSeriesName('Ligg')
    .setSeriesSum('50')
    .setTotalSum('150')
.setGaugeSize(.0133)
    .setTargetID('NO_DFS_100M');

var rangeBuilder = new RangeBuilder()
    .setHost('Rygge SKL')
    .setName('100m')
    .setRelay('1');

    function render() {
        var r = Math.random();
        var value = Math.floor(Math.random() * 100)/10;
        var seriesSum = Math.floor(Math.random()*100);
        var totalSum = Math.floor(2.5*seriesSum);

        cardBuilder.resetShots()
            .addShotData(Math.random()*r - .1, Math.random()*r - .1, value)
            .addShotData(Math.random()*r - .1, Math.random()*r - .1, value)
            .addShotData(Math.random()*r - .1, Math.random()*r - .1, value)
            .addShotData(Math.random()*r - .1, Math.random()*r - .1, value)
            .addShotData(Math.random()*r - .1, Math.random()*r - .1, value)
            .addShotData(Math.random()*r - .1, Math.random()*r - .1, value)
            .addShotData(Math.random()*r - .1, Math.random()*r - .1, value)
            .setSeriesSum(seriesSum)
            .setTotalSum(totalSum)
            .setMarking(Math.random() < .5);

    /*
    cardView.setCard(cardBuilder.getCard());
    mlCardView.setCard(cardBuilder.getCard());
    */

    var cards = [];
    for (var i = 0; i < 10; ++i) {
        cards.push(cardBuilder.getCard());
    }

    rangeBuilder.setCards(cards);
    rangeView.setRange(rangeBuilder.getRange(), true);
}

setInterval(render, 500);
render();
