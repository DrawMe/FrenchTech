/**COLOR TRACKING**/
var contextDrawing;
function loadColorDrawing() {

    //the maximum time before the drawing ends
    var timeDrawing = 5;


    var canvas = document.getElementById('canvas2');
    contextDrawing = canvas.getContext('2d');

    contextDrawing.lineWidth = 1;
    contextDrawing.lineJoin = contextDrawing.lineCap = 'round';

    var isDrawing, points = [];
    var tempX, tempY, cursorX, cursorY;
    var colorLine = 'rgba(255,255,255,0.3)';

    // Declare btn actions
    var buttonsInfos = [];

    //Get all the buttons
    var buttons = document.getElementsByClassName('btn');
    for (var i = 0; i < buttons.length; ++i) {
        var item = buttons[i];
        // Memorize each button infos
        getButton(item);
    }
    console.log(buttonsInfos);

    //Add red like new color tracking
    tracking.ColorTracker.registerColor('red', function (r, g, b) {
        if (r > 200 && g < 50 && b < 50) {
            return true;
        }
        return false;
    });

    //Initialize colors tracking
    var tracker = new tracking.ColorTracker(['cyan', 'red']);
    tracking.track('#video', tracker, {camera: true});

    //Manage color detection
    tracker.on('track', function (event) {
        if (event.data.length === 0) {
            if (isDrawing) {
                endDraw();
            }
			document.getElementById("cursor").className = "hide";
        }

        event.data.forEach(function (rect) {
            isSelected(rect);
			moveCursor(rect);
            if (rect.color === 'cyan') {
				document.getElementById("cursor").className = " ";
                if (!isDrawing) {
                    getPoint(rect);
                }
                else {
                    beginDraw(rect);
                }
            }
            else if (rect.color === 'red') {
                erase(rect);
				document.getElementById("cursor").className = "hide";
                if (isDrawing) {
                    endDraw();
                }
            }
        });
    });

    // Get first point with pen
    function getPoint(rect) {
        points = [];
        isDrawing = true;

        cursorX = rect.x + rect.width / 2;
        cursorY = rect.y + rect.height / 2;
        points.push({x: cursorX, y: cursorY});

    };

    // Draw the line
    function beginDraw(rect) {
        if (!isDrawing) return;

        cursorX = rect.x + rect.width / 2;
        cursorY = rect.y + rect.height / 2;
        points.push({x: cursorX, y: cursorY});

        contextDrawing.beginPath();
        contextDrawing.moveTo(points[points.length - 2].x, points[points.length - 2].y);
        contextDrawing.lineTo(points[points.length - 1].x, points[points.length - 1].y);
        contextDrawing.stroke();

        for (var i = 0, len = points.length; i < len; i++) {
            dx = points[i].x - points[points.length - 1].x;
            dy = points[i].y - points[points.length - 1].y;
            d = dx * dx + dy * dy;

            if (d < 1000) {
                contextDrawing.beginPath();
                contextDrawing.strokeStyle = colorLine;
                contextDrawing.moveTo(points[points.length - 1].x + (dx * 0.1), points[points.length - 1].y + (dy * 0.1));
                contextDrawing.lineTo(points[i].x - (dx * 0.1), points[i].y - (dy * 0.1));
                contextDrawing.stroke();
            }
        }
    };

    // Stop drawing
    function endDraw() {
        isDrawing = false;
        points.length = 0;
    };

    // Erase drawing
    function erase(rect) {
        contextDrawing.clearRect(rect.x, rect.y, rect.width, rect.height);
    }

    // Check if item selected
    function isSelected(rect) {
        //Center of rect
        var x = rect.x + rect.width / 2;
        var y = rect.y + rect.height / 2;

        for (var i = 0; i < buttonsInfos.length; i++) {
            var el = buttonsInfos[i];
            if (el.x1 <= x && x <= el.x2 && el.y1 <= y && y <= el.y2) {
                changeColor(el)
            }
        }

    }

	//Move cursor
	function moveCursor(rect) {
	  //Center of rect    
	  var x= rect.x + rect.width / 2;
	  var y= rect.y + rect.height / 2;

	  document.getElementById("cursor").style.top = y-5+"px";
	  document.getElementById("cursor").style.right = x-5 +"px";
	  document.getElementById("cursor").style.backgroundColor = colorLine;
	}
	
    function getButton(el) {
        var btn = {
            x1: el.offsetLeft,
            x2: el.offsetLeft + el.offsetWidth,
            y1: el.offsetTop,
            y2: el.offsetTop + el.offsetHeight,
            color: el.style.backgroundColor
        };
        buttonsInfos.push(btn);
    }

    function changeColor(el) {
        color = el.color;
        colorLine = color.replace(/rgb/i, "rgba");
        colorLine = colorLine.replace(/\)/i, ',0.3)');
    }


    function timerForEndDrawing() {
        var $timerText = $("#timer");

        $timerText.removeClass('hide');

        var i = timeDrawing;
        var timer = setInterval(function () {
            i--;
            console.log("timer" + i + " s");
            $timerText.html(i);
            if (i == 0) {
                //alert("this is the end of the drawing");

                $timerText.html('');
                $timerText.addClass('hide');

                generatePicture();
                clearInterval(timer);
            }
        }, 1000);
    }


    timerForEndDrawing();

}