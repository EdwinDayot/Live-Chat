var Builder = require('./Builder.js'),

    /**
     * Model Object
     *
     * @param name
     * @returns {Query}
     * @constructor
     */
    Query = function (name) {
        var self = this;

        /**
         * Format name to prevent coding errors.
         *
         * @type {string}
         */
        self.name = name.charAt(0).toUpperCase() + name.substr(1).toLowerCase();

        /**
         * Fields to select
         *
         * @type {{}}
         */
        self.fields = {};

        /**
         * Default limit.
         *
         * @type {number}
         */
        self.limitNumber = 1000;

        /**
         * Default skip.
         *
         * @type {number}
         */
        self.skipNumber = 0;

        /**
         * Documents relations
         *
         * @type {Array}
         */
        self.relations = [];

        /**
         * Sort By
         *
         * @type {{}}
         */
        self.sortBy = {};

        /**
         * Group By
         *
         * @type {{}}
         */
        self.groupBy = {};

        /**
         * Created At change
         *
         * @type {null}
         */
        self.createdAt = null;

        /**
         * Updated At change
         *
         * @type {null}
         */
        self.updatedAt = null;

        /**
         * Select specific field.
         *
         * @param select
         * @param deletion
         * @returns {Query}
         */
        self.select = function (select, deletion) {
            self.fields[select] = (deletion != undefined) ? deletion : true;

            return self;
        };

        /**
         * Limit results.
         *
         * @param limit
         * @returns {Query}
         */
        self.limit = function (limit) {
            self.limitNumber = limit;

            return self;
        };

        /**
         * Skip results.
         *
         * @param skip
         * @returns {Query}
         */
        self.skip = function (skip) {
            self.skipNumber = skip;

            return self;
        };

        /**
         * Include document
         *
         * @param relation
         * @returns {Query}
         */
        self.include = function (relation) {
            self.relations.push(relation);

            return self;
        };

        /**
         * Sort by field
         *
         * @param field
         * @param way
         * @returns {Query}
         */
        self.sort = function (field, way) {
            self.sortBy[field] = way;

            return self;
        };

        /**
         * Group by field
         *
         * @param groups
         * @returns {Query}
         */
        self.group = function (groups) {
            self.groupBy = groups;

            return self;
        };

        /**
         * Set the created at date
         *
         * @param date
         * @returns {Query}
         */
        self.setCreatedAt = function (date) {
            self.createdAt = date;

            return self;
        };

        /**
         * Set the updated at date
         *
         * @param date
         * @returns {Query}
         */
        self.setUpdatedAt = function (date) {
            self.updatedAt = date;

            return self;
        };

        /**
         * Find one document.
         *
         * @param conditions
         * @param successCallback
         * @param errorCallback
         * @returns {Query}
         */
        self.findOne = function (conditions, successCallback, errorCallback) {
            self.find(conditions, successCallback, errorCallback, true);

            return self;
        };

        /**
         * Find a document.
         *
         * @param conditions
         * @param successCallback
         * @param errorCallback
         * @param one
         */
        self.find = function (conditions, successCallback, errorCallback, one) {
            if (conditions != undefined) {
                successCallback = (typeof conditions == 'function') ? conditions : successCallback;
                conditions = (typeof conditions == 'function') ? null : conditions;
            }

            if (successCallback != undefined && conditions != undefined) {
                errorCallback = (typeof conditions == 'function') ? successCallback : errorCallback;
            }

            (function (groupBy, sortBy, fields, limit, skip, relations, conditions) {
                
                /**
                 * Empty variables to prevent conflicts of queries
                 */
                self.fields = {};
                self.sortBy = {};
                self.groupBy = {};
                self.limitNumber = 1000;
                self.skipNumber = 0;
                self.relations = [];

                Builder.collections(self.name, function (collection) {
                    if (conditions == null) {
                        conditions = {};
                    }

                    if (one) {
                        collection.findOne(conditions, fields, function (error, result) {
                            if (error) {
                                if (errorCallback != undefined) {
                                    errorCallback(result, error);
                                }

                                return false;
                            } else {
                                if (successCallback != undefined) {
                                    successCallback(result, error);
                                }

                                return true;
                            }
                        });

                        return true;
                    } else {
                        var find = null;

                        if (Object.keys(groupBy).length > 0) {
                            var aggregate = [];
                            if (Object.keys(conditions).length > 0) {
                                aggregate.push(conditions);
                            }
                            aggregate.push({ $group: groupBy });
                            find = collection.aggregate(aggregate, fields);
                        } else {
                            find = collection.find(conditions, fields);
                        }

                        if (Object.keys(sortBy).length > 0) {
                            find.sort(sortBy);
                        }

                        find.limit(limit)
                            .skip(skip)
                            .toArray(function (error, results) {
                                if (error) {
                                    if (errorCallback != undefined) {
                                        errorCallback(results, error);
                                    }

                                    return false;
                                } else {

                                    /**
                                     * No relations callback.
                                     */
                                    if (relations.length == 0) {
                                        if (successCallback != undefined) {
                                            successCallback(results, error);
                                        }

                                        return true;
                                    }

                                    /**
                                     * Relations
                                     */
                                    var outstanding = 0;

                                    for (var i in relations) {
                                        outstanding++;

                                        /**
                                         * Reformat Model name for plural.
                                         *
                                         * @type {string}
                                         */
                                        var modelName = '';

                                        if (relations[i].slice(-3) != 'ies') {
                                            if (relations[i].slice(-1) == 's') {
                                                modelName = relations[i].substr(0, relations[i].length - 1);
                                            } else {
                                                modelName = relations[i];
                                            }
                                        } else {
                                            modelName = relations[i].substr(0, relations[i].length - 3) + 'y';
                                        }

                                        /**
                                         * Related Model
                                         *
                                         * @type {Query}
                                         */
                                        var relation = new Query(modelName),

                                            /**
                                             * Conditions for the model
                                             *
                                             * @type {Array}
                                             */
                                            or = [];

                                        for (var j in results) {
                                            var condition = {},
                                                exists = false;

                                            /**
                                             * Is it an array of documents ?
                                             */
                                            if (relations[i].slice(-1) == 's') {
                                                for (var k in results[j][relations[i]]) {
                                                    condition = {};
                                                    exists = false;
                                                    condition['_id'] = results[j][relations[i]][k];

                                                    for (var l in or) {
                                                        if (or[l]._id.toString() == results[j][relations[i]][k].toString()) {
                                                            exists = true;
                                                        }
                                                    }

                                                    if (!exists) {
                                                        or.push(condition);
                                                    }
                                                }
                                            } else {
                                                condition = {};
                                                exists = false;
                                                condition['_id'] = results[j][relations[i]];

                                                for (var l in or) {
                                                    if (or[l]._id.toString() == condition['_id'].toString()) {
                                                        exists = true;
                                                    }
                                                }

                                                if (!exists) {
                                                    or.push(condition);
                                                }
                                            }
                                        }

                                        /**
                                         * Find the related documents.
                                         */
                                        (function (relationName) {
                                            relation.find({
                                                $or: or
                                            }, function (relationResults, error) {
                                                --outstanding;

                                                /**
                                                 * Bind documents on the associated keys.
                                                 */
                                                for (var j in results) {
                                                    if (relationName.slice(-1) == 's') {
                                                        for (var k in results[j][relationName]) {
                                                            for (var l in relationResults) {
                                                                if (relationResults[l]._id.toString() == results[j][relationName][k].toString()) {
                                                                    results[j][relationName][k] = relationResults[l];
                                                                }
                                                            }
                                                        }
                                                    } else {
                                                        for (var k in relationResults) {
                                                            if (relationResults[k]._id.toString() == results[j][relationName].toString()) {
                                                                results[j][relationName] = relationResults[k];
                                                            }
                                                        }
                                                    }
                                                }

                                                /**
                                                 * Prevent callback call if all the requests aren't processed yet.
                                                 */
                                                if (outstanding == 0) {
                                                    if (successCallback != undefined) {
                                                        successCallback(results, error);
                                                    }
                                                }
                                            }, function (result, error) {
                                                if (errorCallback != undefined) {
                                                    errorCallback(results, error);
                                                }
                                            });
                                        })(relations[i]);
                                    }

                                    return true;
                                }
                            });
                    }
                });
            })(self.groupBy, self.sortBy, self.fields, self.limitNumber, self.skipNumber, self.relations, conditions);

            return self;
        };

        /**
         * Count documents.
         *
         * @param conditions
         * @param successCallback
         * @param errorCallback
         * @returns {Query}
         */
        self.count = function (conditions, successCallback, errorCallback) {
            if (conditions != undefined) {
                successCallback = (typeof conditions == 'function') ? conditions : successCallback;
                conditions = (typeof conditions == 'function') ? null : conditions;
            }

            if (successCallback != undefined && conditions != undefined) {
                errorCallback = (typeof conditions == 'function') ? successCallback : errorCallback;
            }

            Builder.collections(self.name, function (collection) {
                if (conditions == undefined) {
                    conditions = {};
                }

                collection.count(conditions, function (error, result) {
                    if (error) {
                        if (errorCallback != undefined) {
                            errorCallback(result, error);
                        }

                        return false;
                    } else {
                        if (successCallback != undefined) {
                            successCallback(result, error);
                        }

                        return true;
                    }
                });
            });

            return self;
        };

        /**
         * Save a document.
         *
         * @param data
         * @param successCallback
         * @param errorCallback
         * @returns {Query}
         */
        self.save = function (data, successCallback, errorCallback) {
            if (data != undefined) {
                successCallback = (typeof data == 'function') ? data : successCallback;
                data = (typeof data == 'function') ? null : data;
            }

            if (successCallback != undefined && data != undefined) {
                errorCallback = (typeof data == 'function') ? successCallback : errorCallback;
            }

            (function (createdAt, updatedAt) {
                self.createdAt = null;
                self.updatedAt = null;
                Builder.collections(self.name, function (collection) {
                    if (data['_id'] != undefined) {
                        if (updatedAt == null) {
                            data['updatedAt'] = new Date();
                        } else {
                            data['updatedAt'] = updatedAt;
                        }

                        if (createdAt != null) {
                            data['createdAt'] = createdAt;
                        }

                        collection.findOneAndUpdate({ '_id': data['_id'] }, data, function (error, result) {
                            if (error) {
                                if (errorCallback != undefined) {
                                    errorCallback(result, error);
                                }

                                return false;
                            } else {
                                if (successCallback != undefined) {
                                    successCallback(data, error);
                                }

                                return true;
                            }
                        });
                    } else {
                        if (createdAt == null) {
                            data['createdAt'] = new Date();
                        } else {
                            data['createdAt'] = createdAt;
                        }

                        if (updatedAt == null) {
                            data['updatedAt'] = data['createdAt'];
                        } else {
                            data['updatedAt'] = updatedAt;
                        }

                        collection.createIndex({ createdAt: 1 });
                        collection.createIndex({ updatedAt: 1 });
                        collection.insert(data, function (error, result) {
                            if (error) {
                                if (errorCallback != undefined) {
                                    errorCallback(result, error);
                                }

                                return false;
                            } else {
                                if (successCallback != undefined) {
                                    successCallback(result.ops[0], error);
                                }

                                return true;
                            }
                        });
                    }

                    return true;
                });
            })(self.createdAt, self.updatedAt);

            return self;
        };

        /**
         * Remove one document.
         *
         * @param conditions
         * @param successCallback
         * @param errorCallback
         * @returns {Query}
         */
        self.removeOne = function (conditions, successCallback, errorCallback) {
            self.remove(conditions, successCallback, errorCallback, true);

            return self;
        };

        /**
         * Remove a document.
         *
         * @param conditions
         * @param successCallback
         * @param errorCallback
         * @param one
         * @returns {Query}
         */
        self.remove = function (conditions, successCallback, errorCallback, one) {
            if (conditions != undefined) {
                successCallback = (typeof conditions == 'function') ? conditions : successCallback;
                conditions = (typeof conditions == 'function') ? null : conditions;
            }

            if (successCallback != undefined && conditions != undefined) {
                errorCallback = (typeof conditions == 'function') ? successCallback : errorCallback;
            }

            Builder.collections(self.name, function (collection) {
                if (conditions == null) {
                    conditions = {};
                }

                collection.remove(conditions, one == true, function (error, result) {
                    if (error) {
                        if (errorCallback != undefined) {
                            errorCallback(result, error);
                        }

                        return false;
                    } else {
                        if (successCallback != undefined) {
                            successCallback(result, error);
                        }

                        return true;
                    }
                });
            });

            return self;
        };

        /**
         * For "Fluent" coding.
         */
        return self;
    };

module.exports = Query;