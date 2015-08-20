var Model = require('../../src/Model.js');

var UserController = function (app) {
    var me = this,
        User = new Model('User');

    me.app = app;

    me.index = function (req, res) {

    };

    return me;
};

module.exports = UserController;