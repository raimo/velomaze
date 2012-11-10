var express = require('express');
var app = express();

app.configure(function() {
     app.use(express.methodOverride());
     app.use(express.static(__dirname + '/public'));
});

app.listen(3000);
console.log('Listening on port 3000');
