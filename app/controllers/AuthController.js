var Model = require('../../src/Model.js'),
    Logger = require('../../src/Logger.js'),
    bcrypt = require('bcrypt');

var AuthController = function (app) {
    var me = this,
        User = new Model('User');

    me.app = app;

    me.login = function (req, res) {
        var hash =  bcrypt.hashSync('password', 8);
        User.save({
            'username' : 'Roadirsh',
            'password' : hash
        }, function (user) {
            User.findOne({
                '_id' : user._id
            }, function (userFind) {
                res.json(bcrypt.compareSync('not_password', userFind.password ));
            });
        });
        User.find(function(users){
            res.json(users);
        });
    };

    return me;
};

module.exports = AuthController;