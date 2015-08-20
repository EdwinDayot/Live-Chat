var Query = require('./Query/Query.js'),
    Logger = require('./Logger.js'),
    Model = function (name) {
        var model = null;

        try {
            model = require('../app/Models/' + name + '.js')
        } catch (e) {
            model = new Query(name);
            Logger.log('It is better to have a file for the Model, so you can add methods to the Model.');
        }

        return model;
    };

module.exports = Model;