require('lib/player');
require('lib/ball');

var uuid = require('node-uuid');

Game = function() {
  this.id = uuid.v1();
  this.players = [];
  this.ball = new Ball();
  this.round = 0;
}

Game.prototype.addPlayer = function(player) {
  this.players.push(player);
  player.joinGame(this);
}

Game.prototype.removePlayer = function(player) {
  for (var i = 0; i < this.players.length; i++) {
    if (this.players[i].id == player.id) {
      this.players = this.players.splice(i, i);
    }
  }
}

Game.prototype.nextStage = function() {


  for (var i = 0; i < this.players.length; i++) {
    if (this.players[i].id == this.ball.player.id) {

    }
  }
}

Game.prototype.isEmpty = function() {
  return this.players.length == 0;
}
