var LiveShot = require('../../index');
var CardBuilder = require('liveshot-protocol').CardBuilder;

var c = document.createElement('canvas');

var targetView = new LiveShot.TargetView();
document.body.appendChild(targetView.canvas);

var width = 400;
var height = 300;
var rect = {x:0, y:0, width:width, height:height};
targetView.canvas.width = rect.width;
targetView.canvas.height = rect.height;

var cardBuilder = new CardBuilder()
    .setRange('100m')
    .setRelay('1')
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
                 .setTotalSum(totalSum);

    targetView.setCard(cardBuilder.getCard());
}

setInterval(render, 500);
render();
