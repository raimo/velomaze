var http = require('http');
var domain = require('domain').create();
var server = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  xres.end('Hello World\n');
}).listen(8000);

/* Error handler inside domain*/
domain.add(server);
domain.on('error', function(err) {
    console.log('We got error (waiting for stuff to get fixed and closing, Nodejitsu will spawn new server)', err);
    server.close();
});
console.log('Server running at http://0.0.0.0:8000/');
