var express = require('express');
var app = express();
var server;
var index = 1;

app.configure(function() {
     app.use(express.methodOverride());
     app.use(express.static(__dirname + '/public'));
     app.use(express.cookieParser()); 
     app.use(express.session({ secret: 'y7SD56DGs68sdy89gsdg9ysdg' }));
});

server = app.listen(3000);
console.log('Listening at http://localhost:3000');

app.post('/successes', function(req, res) {
    console.log('BALL ', req.query.id, ' GOT FORWARD');
    return res.send();
});

app.post('/failures', function(req, res) {
    console.log('BALL ', req.query.id, ' WAS DROPPED!');
    return res.send();
});

app.post('/gamestate', function(req, res) {
    if (!req.session.userId) {
        console.log('user id ', index, ' joined the game');
        req.session.userId = ++index;
    }
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

