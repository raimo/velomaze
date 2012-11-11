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

Player.prototype.reset = function() {
  this.lives = 3;
}

Player.prototype.emit = function(msg) {
  this.socket.emit(msg);
}

Player.prototype.passBall = function() {
  console.log("Ball passed to " + this.id);
  this.emit("next");
}
