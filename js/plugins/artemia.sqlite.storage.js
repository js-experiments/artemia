/**
 * Created by k33g_org.
 * User: k33g_org
 * Date: 5/1/11
 * --=>>>|:<
 */

/* 05/01/11
    jslint
        white: true, onevar: true, browser: true, undef: true,
        nomen: true, regexp: true, plusplus: true, bitwise: true,
        newcap: true, maxerr: 50, indent: 4

        Unused variable: transaction 140 "qstring", transaction 195 "SELECT * FROM OBJECTS;"

*/

var artemia = (function (cyste) {


    function execQuery(db, sqlQuery, dataHandler, errorHandler) {
        var self = this;
        db.transaction(
            function (transaction) {
                transaction.executeSql(sqlQuery, [],
                    function (dataSet) {
                        dataHandler.call(self, dataSet);
                    },
                    function (error) {
                        errorHandler.call(self, error);
                    });
            }
        );
    }

    function getSqLiteStore(storeName, storeType) {
        return {
            storeType : storeType,
            storeName : storeName,
            dataBase : null,

            isAvailable : function () {
                var s_create;
                /* var s_create, s_index; */

                function nothingToDoHandler() { /*nothing to do*/ }

                function errorHandlerWhenCreateTable(error) {
                    //throw (error);
                    //throw ('CREATE TABLE WARNING.  Error was ' + error.message + ' (Code ' + error.code + ')');
                }

                function errorHandlerWhenCreateIndex(error) {
                    //throw (error);
                    //throw ('CREATE INDEX WARNING.  Error was ' + error.message + ' (Code ' + error.code + ')');
                }


                try {
                    // instantiate the store only once time
                    if(!artemia[storeName]) artemia[storeName] = window.openDatabase('Artemia', '1.0', 'ARTEMIADB', 65536);
                    this.dataBase = artemia[storeName];


                    s_create = "CREATE TABLE IF NOT EXISTS  " + this.storeName + "(UniqueId TEXT UNIQUE PRIMARY KEY,SerializedObject TEXT)";
                    //s_create = "CREATE TABLE IF NOT EXISTS  " + this.baseName + "(UniqueId TEXT ,SerializedObject TEXT)";
                    //s_index  = "CREATE INDEX IF NOT EXISTS idxObjects ON "+this.storeName+" (UniqueId,SerializedObject)";
                    execQuery(this.dataBase, s_create, nothingToDoHandler, errorHandlerWhenCreateTable);
                    //execQuery(this.dataBase, s_index, nothingToDoHandler, errorHandlerWhenCreateIndex);
                    /*TODO: test with index for query*/
                    
                } catch (err) {
                    if (err === 2) {
                        // Version number mismatch.
                        throw ("Invalid database version");

                    } else {
                        return false; /*not available*/
                        //throw ("Unknown error " + err);
                    }

                }
                return true;
            },

            save : function (obj, callback) {
                var update, insert, db = this.dataBase, storeName = this.storeName ;

                update = function (obj, callback) {
                    var qString = "UPDATE " + storeName + " SET SerializedObject = '" + JSON.stringify(obj) + "' WHERE UniqueId = '" + obj.key + "';";
	                //execQuery(db, qString, callback, errorHandler);
                    db.transaction(function(tx) {
                        var resultsHandler = function () {
                            callback(obj);
                        };
                        tx.executeSql(qString, [], resultsHandler, function(){});
                    });
                };

                insert = function (obj, callback) {
                    var qString;
                    obj.key = obj.key || cyste.guidGenerator();
                    qString = "INSERT INTO " + storeName + " (UniqueId, SerializedObject) VALUES ('" + obj.key + "','" + JSON.stringify(obj) + "');";
                    //execQuery(db, qString, callback, errorHandler);
                    db.transaction(function(tx) {
                        var resultsHandler = function () {
                            callback(obj);
                        };
                        tx.executeSql(qString, [], resultsHandler, function(){});
                    });
                };

                if (obj.key === undefined) {
                    /* --- insert --- */
                    insert(obj, callback);

                } else {
                    /* --- insert or update --- */
                    this.get(obj.key, function (r) {
                        if (r === null) {
                            /* --- insert --- */
                            insert(obj, callback);
                        } else {
                            /* --- update --- */
                            update(obj, callback);
                        }
                    });
                }
            },

            get : function (key, callback) {
                var qString = "SELECT SerializedObject FROM " + this.storeName + " WHERE UniqueId='" + key + "';", db = this.dataBase;

                db.transaction(function(tx) {
                    var resultsHandler = function (tx, recs) {
                        var obj = {};
                        if (recs.rows.length > 0) {
                            obj = JSON.parse(recs.rows.item(0).SerializedObject);
                        } else { obj = null; }
                        callback(obj);
                    };
                    tx.executeSql(qString, [], resultsHandler, function(){});
                });                                                
            },

            remove : function (keyOrObject, callback) {
                var
                        key = typeof keyOrObject === 'string' ? keyOrObject : keyOrObject.key,
                        qString = "DELETE FROM " + this.storeName + " WHERE UniqueId='" + key + "';",
                        db = this.dataBase;

                /*TODO: have to verify if exists before delete*/
                //execQuery(db, qString, afterDelete, errorHandler);
                db.transaction(function(tx) {
                    var resultsHandler = function (tx) {
                        callback(key);
                    };
                    tx.executeSql(qString, [], resultsHandler, function(){});
                });
            },

            all : function (callback) {
                var qString = "SELECT * FROM " + this.storeName + ";", db = this.dataBase;

                db.transaction(function(tx) {
                    var resultsHandler = function (tx, recs) {
                        var results = [], obj = {}, i, row;

                        //for (i = 0; i < recs.rows.length; i += 1) {
                        for(i = recs.rows.length; i--;) {
                            row = recs.rows.item(i);
                            //obj = JSON.parse(row['SerializedObject']);
                            obj = JSON.parse(row.SerializedObject);
                            results.push(obj);
                        }
                        //if (obj) {obj.key = key; callback(obj); } else { callback(null); }
                        callback(results);
                    };
                    tx.executeSql(qString, [], resultsHandler, function(){});
                });
            },

            nuke : function (callback) {

                var qString, db = this.dataBase;

                qString = "DELETE FROM " + this.storeName + ";";
                //execQuery(db, qString, afterDrop, errorHandler);
                //console.log(qString);
                db.transaction(function(tx) {
                    var resultsHandler = function () {
                        callback();
                    };

                    tx.executeSql(qString, [], resultsHandler, function(){});
                });
                
            },

            drop : function (callback) {
                /* TODO: DROP ... */
            },


            query : function (map, callback) {
                var results = [], res;
                this.all(function (r) {
                    var m;
                    for (m in r) {
                        if (r.hasOwnProperty(m)) {
                            res = map(r[m]);
                            if (res) { results.push(res); }
                        }

                    }
                    callback(results);
                });
                //if (callback) { callback(results); }

                return {
                    sum : function (callback) {
                        res = cyste.sum(results);
                        if (callback) { callback(res); }
                        return res;
                    },
                    min : function (callback) {
                        res = cyste.min(results);
                        if (callback) { callback(res); }
                        return res;
                    },
                    max : function (callback) {
                        res = cyste.max(results);
                        if (callback) { callback(res); }
                        return res;
                    }
                };

            }

        };
    }

    /*===========================================
        Navigator : WebKit

        sqLiteStorage
    ===========================================*/

    /*the _UPPER_ is a convention*/
    cyste.get_SQLITE_store = function (baseName, storeType) {
        var store = getSqLiteStore(baseName, storeType);
        cyste.interfaceIsImplemented(store);
        if (!store.isAvailable()) { store = null; }
        return store;
    };

    return cyste;
}(artemia));
