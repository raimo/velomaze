var maze;

function thresholded(n) {
    if (n > -0.005 && n < 0.005) {
        return 0;
    } else {
        return n;
    }
}

function checkBallHole(ball, hole, dropped) {
    var holeVector = $V([hole.x, hole.y]);
    var ballVector = $V([ball.x, ball.y]);
    //if (ball.vx != 0 || ball.vy != 0) {
    //     var closestPoint = Line.Segment.create(
    //       $V([ball.x,           ball.y          ]), 
    //       $V([ball.x + ball.vx, ball.y + ball.vy])).pointClosestTo(holeVector);
    //     if (closestPoint != null) {
    //         ballVector = closestPoint;
    //     }
    //}
    console.log(ball.x, ball.y, ballVector.distanceFrom(holeVector));
    if (ballVector.distanceFrom(holeVector) < hole.r) {
        dropped(ballVector);
    }
}

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
    },
    setElementPosition: function(element, x, y) {
        element.css('left', (x * maze.getSquareWidth() + 30 - element.width() / 2.0) + 'px');
        element.css('top',  (y * maze.getSquareHeigth() + 30 - element.height() / 2.0)+ 'px');
    },
    setElementPosition: function(element, x, y) {
        element.css('left', (x * maze.getSquareWidth() + 30 - element.width() / 2.0) + 'px');
        element.css('top',  (y * maze.getSquareHeigth() + 30 - element.height() / 2.0)+ 'px');
    },
    makeSpriteElement: function(jqstr, sprite) {
        var element = $(jqstr);
        sprite.element = element;
        sprite.width = (maze.getSquareWidth() * sprite.r * 2);
        sprite.height = (maze.getSquareHeigth() * sprite.r * 2);
        element.css('position', 'absolute');
        element.css('width', sprite.width + 'px');
        element.css('height', sprite.height + 'px');
        maze.setElementPosition(element, sprite.x, sprite.y);
        $('body').append(element);
        return element;
    }
  };
  var ball = {
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
    { x: 3.5, y: 1.5, r: 0.7 } 
  ];
  for (var i = 0; i < holes.length; i++) {
      maze.makeSpriteElement('<img src="/images/hole.png">', holes[i]);
  }
  var frame = 0;
  function update() {
    $('#status').html('Frame: ' + frame);
    if (!ball.dropped) {
        if (!ball.element) {
          ball.element = maze.makeSpriteElement('<div class="ball" />', ball);
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
                ball.element.animate({
                    width: ball.width/2 + 'px',
                    height: ball.height/2 + 'px',
                    'margin-top': ball.height/2 + 'px',
                    'margin-left': ball.width/2 + 'px',
                    opacity: 0,
                    left: holes[i].element.css('left'),
                    top: holes[i].element.css('top')
                }, 300);
            });
        }
        for (var i = 0; i < walls.length; i++) {
            /*
            checkBallWall(ball, walls[i], function(impact) {
                ball.vx += impact.e(1);
                ball.vy += impact.e(2);
            });
            */
        }
        ball.x += ball.vx;
        ball.y += ball.vy;
        maze.setElementPosition(ball.element, ball.x, ball.y);
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
