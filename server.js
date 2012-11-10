var domain = require('domain').create();

var express = require('express');
var app = express();
var server;

app.configure(function() {
     app.use(express.methodOverride());
     app.use(express.static(__dirname + '/public'));
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

if (domain) {
    domain.add(server);
    domain.on('error', function (e){
        console.log('Got', e);
        server.close();
    });
}

