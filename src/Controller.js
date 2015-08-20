var Controller = function (name, app) {
    var self = this;

    self.app = app;

    return require('../app/Controllers/' + name + '.js')(self.app);
};

module.exports = Controller;