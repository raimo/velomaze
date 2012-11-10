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
