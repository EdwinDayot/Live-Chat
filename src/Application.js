var RouteProvider = require('../app/RouteProvider.js'),
    bodyParser = require('body-parser');

/**
 * Application
 *
 * @returns {Application}
 * @constructor
 */
var Application = function (app) {
    var me = this;

    me.app = app;

    me.launch = function () {
        me.app
            .use(bodyParser.json())
            .use(function (err, req, res, next) {
                console.error(err.stack);
                res.status(500).send('Something broke!');
            });

        me.routes = new RouteProvider(me.app);
    };

    return me;
};

module.exports = Application;