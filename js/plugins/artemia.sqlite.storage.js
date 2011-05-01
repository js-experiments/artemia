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

    function getSqLiteStore(baseName, storeType) {
        return {
            storeType : storeType,
            baseName : baseName,
            dataBase : null,

            isAvailable : function () {
                var s_create, s_index;

                function nothingToDoHandler() { /*nothing to do*/ }

                function errorHandlerWhenCreateTable(error) {
                    throw ('CREATE TABLE WARNING.  Error was ' + error.message + ' (Code ' + error.code + ')');
                }

                function errorHandlerWhenCreateIndex(error) {
                    throw ('CREATE INDEX WARNING.  Error was ' + error.message + ' (Code ' + error.code + ')');
                }

                try {
                    this.dataBase = window.openDatabase(this.baseName, '1.0', 'ARTEMIADB', 65536);
                    s_create = "CREATE TABLE IF NOT EXISTS  OBJECTS(UniqueId TEXT UNIQUE PRIMARY KEY,SerializedObject TEXT)";
                    //s_index  = "CREATE INDEX IF NOT EXISTS idxObjects ON OBJECTS (UniqueId,SerializedObject)";
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
                var update, insert, db = this.dataBase;

                //console.log(this.dataBase);

                update = function (obj, callback) {
                    var qstring;
                    function errorHandler(error) {
                        throw ('WARNING.  [' + error.message + '] [' + error.code + ']');
                    }
                    qstring = "UPDATE OBJECTS SET SerializedObject='" + JSON.stringify(obj) + "' WHERE UniqueId='" + obj.key + "';";

                    //console.log(that.database);

	                execQuery(db, qstring, callback, errorHandler);
                };

                insert = function (obj, callback) {
                    var qstring;
                    //var id = obj.key || cyste.guidGenerator()
                    //obj.key = id;
                    obj.key = obj.key || cyste.guidGenerator();
                    //var id = (obj.key == undefined) ? that.uuid() : obj.key;
                    //delete obj.key;
                    function errorHandler(error) {
                        throw ('WARNING.  [' + error.message + '] [' + error.code + ']');
                    }

                    qstring = "INSERT INTO OBJECTS (UniqueId, SerializedObject) VALUES ('" + obj.key + "','" + JSON.stringify(obj) + "');";

                    //console.log(that.database);

                    execQuery(db, qstring, callback, errorHandler);
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

                function errorHandler(error) {
                    throw ('WARNING.  [' + error.message + '] [' + error.code + ']');
                }

                this.dataBase.transaction(
                    function (transaction) {
                        transaction.executeSql(
                            "SELECT SerializedObject FROM OBJECTS WHERE UniqueId='" + key + "';",
                            [],
                            function (transaction, dataSet) {
                                var obj = {};
                                if (dataSet.rows.length > 0) {
                                    obj = JSON.parse(dataSet.rows.item(0).SerializedObject);
                                } else { obj = null; }
                                callback(obj);
                            },
                            errorHandler
                        );
                    }
                );
            },

            remove : function (keyOrObject, callback) {
                var key = typeof keyOrObject === 'string' ? keyOrObject : keyOrObject.key, qstring, db = this.dataBase;
                /*TODO: have to verify if exists before delete*/

                function afterDelete() {
                    callback(key);
                }

                function errorHandler(error) {
                    throw ('WARNING.  [' + error.message + '] [' + error.code + ']');
                }
                qstring = "DELETE FROM OBJECTS WHERE UniqueId='" + key + "';";
                execQuery(db, qstring, afterDelete, errorHandler);

            },

            all : function (callback) {

                function errorHandler(error) {
                    throw ('WARNING.  [' + error.message + '] [' + error.code + ']');
                }

                this.dataBase.transaction(
                    function (transaction) {

                        transaction.executeSql(
                            "SELECT * FROM OBJECTS;",
                            [],
                            function (transaction, dataSet) {
                                var results = [], obj = {}, i, row;

                                for (i = 0; i < dataSet.rows.length; i += 1) {
                                    row = dataSet.rows.item(i);
                                    //obj = JSON.parse(row['SerializedObject']);
                                    obj = JSON.parse(row.SerializedObject);
                                    results.push(obj);
                                }
                                //if (obj) {obj.key = key; callback(obj); } else { callback(null); }
                                callback(results);

                            },
                            errorHandler
                        );
                    }
                );

            },

            drop : function (callback) {

                var qstring, db = this.dataBase;

                function afterDrop() {
                    callback();
                }

                function errorHandler(error) {
                    throw ('WARNING.  [' + error.message + '] [' + error.code + ']');
                }
                qstring = "DROP TABLE OBJECTS;";
                execQuery(db, qstring, afterDrop, errorHandler);
                
            },

            nuke : this.drop,

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
