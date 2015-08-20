var Model = require('../../src/Model.js'),
    Logger = require('../../src/Logger.js');

var AuthController = function (app) {
    var me = this,
        User = new Model('User');

    me.app = app;

    me.login = function (req, res) {
        User.find(function (saved) {
            Logger.log(saved);
            res.json(saved);
        });
    };

    return me;
};

module.exports = AuthController;