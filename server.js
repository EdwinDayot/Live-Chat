var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    Application = require('./src/Application.js');

app.io = require('socket.io')(http);

app.use(express.static('./public'));

app.disable('x-powered-by');

Application = new Application(app).launch();

http.listen(42594, function () {

});