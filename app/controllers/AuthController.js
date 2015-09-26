var Model = require('../../src/Model.js'),
    Logger = require('../../src/Logger.js'),
    bcrypt = require('bcrypt');

var AuthController = function (app) {
    var me = this,
        User = new Model('User');

    me.app = app;

    me.login = function (req, res) {

    };
    me.signup = function(req, res)
    {
        if(req.body.password == req.body.confirmation_password)
        {
            var hash = bcrypt.hashSync(req.body.password, 12);
            User.save({
                'username' : req.body.email,
                'password' : hash
            }, function(data){
                res.json(data);
            });
        }
    };

    return me;
};

module.exports = AuthController;