var maze;

function thresholded(n, threshold) {
    if (!thresholded) {
        threshold = 0.005
    }
    if (n > -threshold && n < threshold) {
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
    if (ballVector.distanceFrom(holeVector) < hole.r) {
        dropped(ballVector);
    }
}
function impactBallByWall(ball, wall) {
    var ballVector = $V([ball.x, ball.y]);
    var wallSegment = Line.Segment.create($V([wall.sx, wall.sy]), $V([wall.dx, wall.dy]));

    var collisionPoint = wallSegment.pointClosestTo(ballVector).to2D();
    var dist = collisionPoint.distanceFrom(ballVector);

    if (dist < ball.r) {
        var inverseMassSum = 1/100.0;
        var differenceVector = collisionPoint.subtract(ballVector);
        var collisionNormal = differenceVector.multiply(1.0/dist);
        var penetrationDistance = ball.r-dist;
        var separationVector = collisionNormal.multiply(penetrationDistance/(inverseMassSum));
        var collisionVelocity = $V([ball.vx, ball.vy]);

        var impactSpeed = collisionVelocity.dot(collisionNormal);

        if (impactSpeed >= 0) {
            var impulse = collisionNormal.multiply((-1.4)*impactSpeed/(inverseMassSum));
            var newBallVelocity = $V([ball.vx, ball.vy]).add(impulse.multiply(inverseMassSum));
            ball.vx = newBallVelocity.e(1);
            ball.vy = newBallVelocity.e(2);
        }
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
        var newLeft = (x * maze.getSquareWidth()  - element.width() / 2.0);
        var newTop = (y * maze.getSquareHeigth()  - element.height() / 2.0);
        if (thresholded(element.css('left') - newLeft, 5) !== 0) {
            element.css('left', parseInt(newLeft) + 'px');
        }
        if (thresholded(element.css('top') - newTop, 5) !== 0) {
            element.css('top', parseInt(newTop) + 'px');
        }
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
        maze.element.append(element);
        return element;
    }
  };
  var walls = [
    { sx: 0, sy: 0, dx: 10, dy: 0 }, // top edge
    { sx: 0, sy: 10, dx: 10, dy: 10 }, // bottom edge
    { sx: 10, sy: 0, dx: 10, dy: 10 }, // right edge
    { sx: 0, sy: 0, dx: 0, dy: 10 }, // left edge
    // Custom edges
    { sx: 0, sy: 5, dx: 4, dy: 5 },
    { sx: 4, sy: 5, dx: 4, dy: 2 },
    { sx: 2, sy: 3, dx: 2, dy: 0 },
    { sx: 2, sy: 9, dx: 2, dy: 7 },
    { sx: 2, sy: 7, dx: 6, dy: 7 },
    { sx: 6, sy: 0, dx: 6, dy: 9 },
    { sx: 8, sy: 2, dx: 8, dy: 10 }
  ];
  var holes = [
    { x: 3.5, y: 1.5, r: 0.5 },
    { x: 3.5, y: 6.5, r: 0.5 },
    { x: 5.5, y: 7.5, r: 0.5 },
    { x: 6.5, y: 5.5, r: 0.5 },
    { x: 9.5, y: 9.5, r: 0.5, goal: true },
  ];
  for (var i = 0; i < holes.length; i++) {
      maze.makeSpriteElement('<img src="/images/hole.png">', holes[i]);
  }
  var frame = 0;
  var balls = [];
  function update() {
    for (var i = 0; i < balls.length; i++) {
        var ball = balls[i];

        if (!ball.dropped) {
            if (!ball.element) {
              ball.element = maze.makeSpriteElement('<div class="ball" />', ball);
              $('#status').html('You got a ball! take it to the right lower corner!');
            }
            ball.vx += thresholded(Math.sin(leftRightAngle)/5.0);
            ball.vy += thresholded(Math.sin(frontBackAngle)/5.0);
            ball.vx = thresholded(ball.vx * 0.95);
            ball.vy = thresholded(ball.vy * 0.95);
            for (var i = 0; i < holes.length; i++) {
                checkBallHole(ball, holes[i], function(position) {
                    ball.dropped = true;
                    ball.x = position.e(1);
                    ball.y = position.e(2);
                    ball.element.animate({
                        width: '0',
                        height: '0',
                        'margin-top': ball.height/2 + 'px',
                        'margin-left': ball.width/2 + 'px',
                        opacity: 0,
                        left: holes[i].element.css('left'),
                        top: holes[i].element.css('top')
                    }, 1300);
                    if (holes[i].goal) {
                        $.post('/successes', function (data) {
                          $('#status').html('You did it!');
                        });
                    } else {
                        $.post('/failures', function (data) {
                          $('#status').html('You failed my friend. :(');
                        });
                    }
                });
            }
            for (var i = 0; i < walls.length; i++) {
                impactBallByWall(ball, walls[i]);
            }
            ball.x += thresholded(ball.vx);
            ball.y += thresholded(ball.vy);
            maze.setElementPosition(ball.element, ball.x, ball.y);
        }
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
/*  window.setInterval(function() {
    $.post('/gamestate', function (data) {
        if (data.ball) {
            balls.push(data.ball);
            console.log(data);
        }
    });
  }, 1000);
  */
});
