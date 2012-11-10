
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
        return maze.element.width() / maze.cols;
    },
    getSquareHeigth: function() {
        return maze.element.height() / maze.rows;
    }
  };
  ball = {
    x: 0.5,
    y: maze.rows/2.0,
    vx: 0,
    vy: 0
  };
  var walls = [
    {x: 0}
  ];
  var frame = 0;
  function update() {
    $('#status').html('Frame: ' + frame + ', width= ' + maze.getSquareWidth());
    if (!ball.element) {
      ball.element = $('<div class="ball" />');
      ball.element.css('width', (maze.getSquareWidth() / 2) + 'px');
      ball.element.css('height', (maze.getSquareHeigth() / 2) + 'px');
      $('body').append(ball.element);
    }
    ball.vx += thresolded(Math.sin(leftRightAngle)/10.0);
    ball.vy += thresolded(Math.sin(frontBackAngle)/10.0);
    ball.vx = thresolded(ball.vx * 0.85);
    ball.vy = thresolded(ball.vy * 0.85);
    ball.x += thresolded(ball.vx);
    ball.y += thresolded(ball.vy);
    ball.element.css('left', (ball.x * maze.getSquareWidth()) + 'px');
    ball.element.css('top', (ball.y * maze.getSquareHeigth()) + 'px');
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
