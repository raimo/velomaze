
var ball;
var maze;

$(function() {
  var frontBackAngle = 0;
  var leftRightAngle = 0;
  maze = {
    element: $('#maze'),
    rows: 10,
    cols: 10,
    getSquareWidth: function() {
        return Math.min(maze.element.width(), maze.element.height()) / maze.cols;
    },
    getSquareHeigth: function() {
        return Math.min(maze.element.width(), maze.element.height()) / maze.rows;
    }
  };
  ball = {
    x: 0.5,
    y: 0.5,
    vx: 0,
    vy: 0,
    r: 0.5
  };
  var walls = [
    { sx: 0, sy: 0, dx: 10, dy: 0 }, // top edge
    { sx: 0, sy: 10, dx: 10, dy: 10 }, // bottom edge
    { sx: 10, sy: 0, dx: 10, dy: 10 }, // right edge
    { sx: 0, sy: 0, dx: 0, dy: 10 } // left edge
  ];
  var holes = [
    { x: 3.5, y: 1.5, r: 0.5 } 
  ];
  var frame = 0;
  function update() {
    $('#status').html('Frame: ' + frame + ', width= ' + maze.getSquareWidth());
    if (!ball.dropped) {
        if (!ball.element) {
          ball.element = $('<div class="ball" />');
          ball.width = (maze.getSquareWidth() * ball.r);
          ball.height = (maze.getSquareHeigth() * ball.r);
          ball.element.css('width', ball.width + 'px');
          ball.element.css('height', ball.height + 'px');
          $('body').append(ball.element);
        }
        ball.vx += thresholded(Math.sin(leftRightAngle)/10.0);
        ball.vy += thresholded(Math.sin(frontBackAngle)/10.0);
        ball.vx = thresholded(ball.vx * 0.85);
        ball.vy = thresholded(ball.vy * 0.85);
        for (var i = 0; i < holes.length; i++) {
            checkBallHole(ball, holes[i], function(position) {
                ball.dropped = true;
                ball.x = position.e(1);
                ball.y = position.e(2);
                ball.element.fadeOut(function () {
                    alert('You friggin\' dropped it!');
                });
            });
        }
        ball.x += ball.vx;
        ball.y += ball.vy;
        ball.element.css('left', (ball.x * maze.getSquareWidth() + 30 - ball.width / 2.0) + 'px');
        ball.element.css('top', (ball.y * maze.getSquareHeigth() + 30 - ball.height / 2.0) + 'px');
    }
    frame++;
  };

  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', function(eventData) {
        leftRightAngle = eventData.gamma /90.0*Math.PI/2;
        frontBackAngle = eventData.beta /90.0*Math.PI/2;
    }, false);
  } else if (window.OrientationEvent) {
    window.addEventListener('MozOrientation', function(eventData) {
        leftRightAngle = eventData.x * Math.PI/2
        frontBackAngle = eventData.y * Math.PI/2;
    }, false);
  } else {
    $('#status').html('Your device does not support orientation reading. Please use Android 4.0 or later, iOS (MBP laptop is fine) or similar platform.');
  }

  window.setInterval(function() { update(); }, 100);
});
