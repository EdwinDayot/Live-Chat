var HomeController = require('./controllers/HomeController.js'),
    express = require('express'),
    path = require('path');

var RouteProvider = function (app) {
    var me = this;

    me.app = app;

    me.app.get('/', HomeController);

    me.app.io.on('connection', function (socket) {
        socket.on('message', function (data) {
            console.log(data);
        });
    });

    return me;
};

module.exports = RouteProvider;