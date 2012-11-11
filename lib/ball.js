var uuid = require('node-uuid');

Ball = function() {
  this.id = uuid.v1();
  this.player = undefined;
}

Ball.prototype.passToPlayer = function(player) {
  this.player = player;
}

// Default ball properties
Ball.prototype.x = 0.5;
Ball.prototype.y = 5;
Ball.prototype.vx = 0;
Ball.prototype.vy = 0;
Ball.prototype.r = 0.5;
