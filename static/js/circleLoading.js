var circleLoad = $('#circleLoading');

circleLoad.circleProgress({
    startAngle: -Math.PI / 4 * 3,
    value: 0,
    lineCap: 'round',
    animation: false,
    fill: { gradient: ['#E2407B', '#C11047'] }
});