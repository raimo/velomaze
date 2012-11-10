var domain = require('domain').create();
var express = require('express');
var app = express();
var server;

app.configure(function() {
     app.use(express.methodOverride());
     app.use(express.static(__dirname + '/public'));
});

server = app.listen(3000);

domain.add(server);
console.log('Listening on port 3000');

domain.on('error', function (e){
    console.log('Got', e);
    server.close();
});
