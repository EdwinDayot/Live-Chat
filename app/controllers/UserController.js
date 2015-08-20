var Model = require('../../src/Model.js');

var UserController = function (req, res) {
    var me = this,
        User = new Model('User');

    me.index = function (req, res) {

    };

    return me;
};

module.exports = UserController;