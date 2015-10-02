var circleConnect;
var goToLeftSlide = $('#goToLeftSlide');
var goToRightSlide = $('#goToRightSlide');

goToLeftSlide.circleProgress({
    startAngle: -Math.PI / 4 * 3,
    value: 0,
    lineCap: 'round',
    animation: false,
    fill: { gradient: ['#FFFFFF', '#cfcfcf'] }
});

goToRightSlide.circleProgress({
    startAngle: -Math.PI / 4 * 3,
    value: 0,
    lineCap: 'round',
    animation: false,
    fill: { gradient: ['#FFFFFF', '#cfcfcf'] }
});

function createCircleConnect (){
    circleConnect = $('#circleConnection');

    circleConnect.circleProgress({
        startAngle: -Math.PI / 4 * 3,
        value: 0,
        lineCap: 'round',
        animation: false,
        fill: { gradient: ['#E2407B', '#C11047'] }
    });

}