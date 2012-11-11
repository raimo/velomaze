require('./player');
require('./ball');

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

// Returns the player after the removedPlayer (if any)
Game.prototype.removePlayer = function(player) {
  for (var i = 0; i < this.players.length; i++) {
    if (this.players[i].id == player.id) {
      var player = this.players[i];

      // Take player out of queue
      this.players = this.players.splice(i, i);

      var nextPlayer = this.players[i] || this.players[0];
      if (nextPlayer != undefined) {
        nextPlayer.passBall();
      }

      return nextPlayer;
    }
  }

  return undefined;
}

Game.prototype.nextPlayer = function(player) {
  var nextPlayer = undefined;

  for (var i = 0; i < this.players.length; i++) {
    if (this.players[i].id == player.id) {
      nextPlayer = this.players[++i];
      break;
    }
  }

  // If nextPlayer is undefined, means we're at the end of the players
  // queue, or we have no players left. Either way, return first player
  // in queue.
  return nextPlayer || this.players[0];
}

Game.prototype.nextStage = function(player) {
  var nextPlayer = this.nextPlayer(player);

  console.log("Next stage!");

  if (nextPlayer != undefined) {
    nextPlayer.passBall();
  }
}

Game.prototype.isEmpty = function() {
  return this.players.length == 0;
}
