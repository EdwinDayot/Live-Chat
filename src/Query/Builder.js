var Connection = require('./Connection.js'),
    collections = {},
    Builder = function () {
        var self = this;

        self.collections = function (name, callback) {
            if (collections[name] != undefined) {
                Connection.getInstance(function (db) {
                    callback(db.collection(name));
                });
            } else {
                Connection.getInstance(function (db) {
                    db.collections(function (err, results) {
                        for (var i in results) {
                            collections[results[i].collectionName] = results[i];
                        }

                        if (collections[name] != undefined) {
                            callback(db.collection(name));
                        } else {
                            db.createCollection(name, {}, function (newCollection) {
                                collections[name] = newCollection;

                                callback(db.collection(name));
                            });
                        }
                    });
                });
            }

            return self;
        };

        return self;
    };

module.exports = new Builder;