var Model = require('../src/Model.js'),
    Controller = require('../src/Controller.js'),
    express = require('express'),
    path = require('path');

var RouteProvider = function (app) {
    var me = this,
        AuthController = new Controller('AuthController', app);

    me.app = app;

    me.app.get('/login', AuthController.login);
    me.app.post('/signup', AuthController.signup);

    me.app.io.on('connection', function (socket) {
        socket.on('message', function (data) {
            console.log(data);
        });
    });

    return me;
};

module.exports = RouteProvider;