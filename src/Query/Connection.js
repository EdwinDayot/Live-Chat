var db = require('../../config/db.json'),
    MongoClient = require('mongodb').MongoClient,
    Connection = function () {
        var self = this;

        self.instance = null;

        self.getInstance = function (callback) {

            console.log(db);
            if (self.instance == null) {
                MongoClient.connect(db.host + '/' + db.dbname, function (error, database) {
                    if (db.auth) {
                        database.authenticate(db.user, db.pass, function (error, authed) {
                            if (error) {
                                throw new Error('Error while logging to MongoDB database.');
                            }

                            if (authed) {
                                self.instance = database;
                            } else {
                                throw new Error('Failed to authenticate.');
                            }

                            callback(self.instance);
                        });
                    } else {
                        callback(self.instance);
                    }
                });
            } else {
                callback(self.instance);
            }

            return self;
        };

        return self;
    };

module.exports = new Connection;