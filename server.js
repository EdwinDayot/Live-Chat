var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    Application = require('./src/Application.js'),
    logger = require('./src/Logger.js');

app.io = require('socket.io')(http);

app.use(express.static('./public'));

app.set('views', __dirname + '/views');


app.disable('x-powered-by');

Application = new Application(app).launch();

http.listen(42594, function () {
    logger.log('info', 'Web Server started, on port 42594');
});