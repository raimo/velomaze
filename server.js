var express = require('express');
var app = express();
var server;
var playerIndex = 1;
var ballIndex = 1;

app.configure(function() {
     app.use(express.methodOverride());
     app.use(express.static(__dirname + '/public'));
     app.use(express.cookieParser()); 
     app.use(express.session({ secret: 'y7SD56DGs68sdy89gsdg9ysdg' }));
});

server = app.listen(3000);
console.log('Listening at http://localhost:3000');

var players = {};
var current_user = function(req) {
    
    console.log(req.cookies["connect.sid"])
    if (!players[req.cookies["connect.sid"]]) {
        console.log('user id ', playerIndex, ' joined the game');
        var player = {
            pending: {}, // to be put in player's maze
            finished: {} // finished in player's maze
        };
        player.pending[ballIndex += 2] = { x: 0.5, y: 5, vx: 0, vy: 0, r: 0.5 };

        players[req.cookies["connect.sid"]] = player;
    }
    return players[req.cookies["connect.sid"]];
};
var transition = {};
for (var playerId in players) {
    if (players.hasOwnProperty(playerId)) {
        var player = players[playerId];
        for (var i in transition) {
            if (transition.hasOwnProperty(i)) {
                player.pending[i] = transition[i];
                delete transition[i];
            }
        }
        if (player.finished) {
            for (var i in player.finished) {
                if (player.finished.hasOwnProperty(i)) {
                    transition[i] = player.finished[i];
                    delete player.finished[i];
                }
            }
        }
    }
}

app.post('/gamestate', function(req, res) {
    var player = current_user(req);

    var ball = null;
    if (player && player.pending) {
        for (var i in player.pending) {
            ball = player.pending[i];
            delete player.pending[i];
            ball.id = i;
            break;
        }
    }
    return res.send({ ball: ball });
});

app.post('/successes', function(req, res) {
    console.log('BALL ', req.query.id, ' GOT FORWARD');
    return res.send();
});

app.post('/failures', function(req, res) {
    console.log('BALL ', req.query.id, ' WAS DROPPED!');
    return res.send();
});

try {
    var domain = require('domain').create();
    domain.add(server);
    domain.on('error', function (e){
        console.log('Got', e);
        server.close();
    });
} catch (e) {
    console.log('require("domain") failed');
}

