var uuid = require('node-uuid');

Player = function(socket) {
  this.id = uuid.v1();
  this.socket = socket;
  this.ball = undefined;
  this.game = undefined;

  this.pendingBalls  = [];
  this.finishedBalls = [];
}

Player.prototype.joinGame = function(game) {
  this.game = game;
}
