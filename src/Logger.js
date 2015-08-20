var moment = require('moment'),

    Logger = function () {
        var self = this;

        moment.locale('en-gb');

        self.log = function () {
            var logs = [];

            logs.push(moment().format('DD MMM HH:mm:ss') + ' -');

            for (var i in arguments) {
                if (typeof arguments[i] == 'object') {
                    logs.push(JSON.stringify(arguments[i]));
                } else {
                    logs.push(arguments[i]);
                }
            }

            console.log(logs.join(' '));
        };

        return self;
    };

module.exports = new Logger();