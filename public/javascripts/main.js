var maze;
var socket;
var past_overlay = false;

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
var socket
$(function() {
  socket = io.connect(document.location.origin);

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
    setElementPosition: function(element, sprite) {
        sprite.width = (maze.getSquareWidth() * sprite.r * 2);
        sprite.height = (maze.getSquareHeigth() * sprite.r * 2);
        var x = sprite.x;
        var y = sprite.y;
        var newLeft = (x * maze.getSquareWidth()  - element.width() / 2.0);
        var newTop = (y * maze.getSquareHeigth()  - element.height() / 2.0);
        if (thresholded(element.css('left') - newLeft, 5) !== 0) {
            element.css('left', parseInt(newLeft) + 'px');
        }
        if (thresholded(element.css('top') - newTop, 5) !== 0) {
            element.css('top', parseInt(newTop) + 'px');
        }
        element.css('width', sprite.width + 'px');
        element.css('height', sprite.height + 'px');
        element.find('div').each(function () {
         $(this).css('width', sprite.width + 'px');
         $(this).css('height', sprite.height + 'px');
        });
        element.find('.location').html('('+parseInt(sprite.x*10)/10.0+','+parseInt(sprite.y*10)/10.0+')');
    },
    makeSpriteElement: function(jqstr, sprite) {
        var element = $(jqstr);
        sprite.element = element;
        element.css('position', 'absolute');
        element.append('<span class="location easter-egg"></span>');
        maze.element.append(element);
        maze.setElementPosition(element, sprite);
        return element;
    }
  };
  $('#maze').css('width', maze.cols * maze.getSquareWidth());
  $('#maze').css('height', maze.rows * maze.getSquareHeigth());

  window.onresize = function() {
    // recalculate ball and hole sizes
    var holeSprites = $("img[src='/images/hole.png']");
    for(var i = 0; i < holes.length; i++) {
      var hole = holes[i];
      maze.setElementPosition(hole.element, hole);
    };
    for(var i = 0; i < balls.length; i++) {
      var ball = balls[i];
      maze.setElementPosition(ball.element, ball);
    };
  }
  var walls = [
    { sx: 0, sy: 0, dx: 10, dy: 0 }, // top edge
    { sx: 0, sy: 10, dx: 10, dy: 10 }, // bottom edge
    { sx: 10, sy: 0, dx: 10, dy: 10 }, // right edge
    { sx: 0, sy: 0, dx: 0, dy: 10 }, // left edge
    // Custom edges
    { sx: 0, sy: 5, dx: 4, dy: 5 },
    { sx: 4, sy: 5, dx: 4, dy: 2 },
    { sx: 4, sy: 8, dx: 4, dy: 10 },
    { sx: 2, sy: 3, dx: 2, dy: 0 },
    { sx: 2, sy: 9, dx: 2, dy: 7 },
    { sx: 2, sy: 7, dx: 6, dy: 7 },
    { sx: 6, sy: 0, dx: 6, dy: 9 },
    { sx: 8, sy: 2, dx: 8, dy: 10 }
  ];
  var holes = [
    { x: 0.7, y: 4.4, r: 0.5 },
    { x: 0.7, y: 5.8, r: 0.6 },

    { x: 2, y: 4.6, r: 0.4 },
    { x: 1.45, y: 8, r: 0.5 },
    { x: 3.6, y: 9.4, r: 0.4 },

    { x: 3.3, y: 4.2, r: 0.5 },
    { x: 3.35, y: 1.35, r: 0.5 },
    { x: 3.35, y: 6.35, r: 0.5 },
    { x: 2.75, y: 8.05, r: 0.43 },

    { x: 5.3, y: 1.2, r: 0.5 },
    { x: 4.7, y: 4.2, r: 0.5 },
    { x: 5.35, y: 7.55, r: 0.5 },

    { x: 6.65, y: 5.35, r: 0.5 },
    { x: 6.85, y: 1.05, r: 0.7 },

    { x: 7.45, y: 3.35, r: 0.5 },
    { x: 7.45, y: 7.35, r: 0.5 },

    { x: 8.75, y: 3.35, r: 0.55 },
    { x: 9.35, y: 1.55, r: 0.55 },
    { x: 9.35, y: 5.35, r: 0.55 },
    { x: 9.35, y: 9.35, r: 0.5, goal: true },
  ];
  for (var i = 0; i < holes.length; i++) {
      maze.makeSpriteElement('<img src="/images/hole.png">', holes[i]);
      maze.setElementPosition(holes[i].element, holes[i]);
  }
  var frame = 0;
  var balls = [];
  $(window).keypress(function (e){
    if (e.which == 13) {
      e.preventDefault();
      $('.easter-egg').toggle();
    }
  });
  var setStatus = function(text, forever) {
      var span = $('<span class="notification">'+text+'</span>');
      span = span.appendTo('#status');
      if (!forever) {
          span.animate({ opacity: 0 }, 4000, null, function() {
              span.remove();
          });
      }
  };

  setStatus('Take balls to the lower right corner!');
  function update() {
    for (var i = 0; i < balls.length; i++) {
        var ball = balls[i];

        if (!ball.dropped) {
            if (!ball.element) {
              maze.makeSpriteElement('<div id="ball"><div id="logo"></div><div id="shadow"></div></div>​', ball);
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
                        /*
                        'margin-top': ball.height/2 + 'px',
                        'margin-left': ball.width/2 + 'px',
                        */
                        opacity: 0,
                        left: holes[i].element.css('left'),
                        top: holes[i].element.css('top')
                    }, 700);
                    if (holes[i].goal) {
                        setStatus('YEEEEEEEEEEEAAH!');
                        setStatus('Velociraptor loves you');
                        socket.emit("success");
                        // display success message, etc.
                    } else {
                        setStatus('Oh no! Dropped it!');
                        socket.emit("failure");
                        // display failure raptor
                    }
                });
            }
            for (var i = 0; i < walls.length; i++) {
                impactBallByWall(ball, walls[i]);
            }
            ball.x += thresholded(ball.vx);
            ball.y += thresholded(ball.vy);
            if (ball.x < ball.r) {
                ball.x = ball.r;
                ball.vx = 0.01;
            }
            if (ball.y < ball.r) {
                ball.y = ball.r;
                ball.vy = 0.01;
            }
            if (ball.y > 10-ball.r) {
                ball.y = 10-ball.r;
                ball.vy = -0.01;
            }
            if (ball.x > 10-ball.r) {
                ball.x = 10-ball.r;
                ball.vx = -0.01;
            }

            var distance = Math.sqrt(
              Math.pow(thresholded(ball.vx),2) +
              Math.pow(thresholded(ball.vy),2)
            );

            maze.setElementPosition(ball.element, ball);
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
    setStatus('Your device does not support orientation reading. Please use Android 4.0 or later, iOS (MBP laptop is fine) or similar platform.');
  }

  var makeBall = function () {
    var ball = { x: 1, y: 1, vx: 0, vy: 0, r: 0.5, };
    return ball;
  };

  socket.on("reset", function() {
    balls.push(makeBall());
  });

  socket.on("next", function() {
    if (past_overlay) {
      if (!this.beginning_gone) {
        setStatus("Seems like Your fellow completed a maze! The ball is all yours now.");
      }
      this.beginning_gone = true;
      balls.push(makeBall());
    }
  });

  socket.on("game_over", function() {
    setStatus("Game over!",true);
    setStatus("Velociraptor is sad.");
  });

  $("div.overlay-wrapper").on("click", function() {
    $("div.overlay-wrapper").css("display", "none");
    past_overlay = true;
    socket.emit("ready");
  });

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
