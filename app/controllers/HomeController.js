var path = require('path');

var HomeController = function (req, res) {
    res.sendFile(path.resolve(__dirname + '/../../public/index.html'));
};

module.exports = HomeController;