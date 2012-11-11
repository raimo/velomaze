var uuid = require('node-uuid');

Player = function(socket) {
  this.id = uuid.v1();
  this.socket = socket;
  this.ball = undefined;
  this.game = undefined;
  this.lives = 3;

  this.pendingBalls  = [];
  this.finishedBalls = [];
}

Player.prototype.joinGame = function(game) {
  this.game = game;
}

Player.prototype.isAlive = function() {
  return this.lives > 0;
}

Player.prototype.lose = function() {
  this.lives -= 1;
}
