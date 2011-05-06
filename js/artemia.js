/**
 * Created by k33g_org.
 * User: k33g_org
 * Date: 4/27/11
 * Time: 5:31 PM
 * --=>>>|:<
 */

var artemia = (function () {

    var cyste = {};

    cyste.Interface = {
        storeType : '',
        storeName : '',
        useReduce : false,
        isAvailable : function () {},
        get : function () {},
        remove : function () {},
        save : function () {},
        all : function () {},
        drop : function () {}
    };

    cyste.interfaceIsImplemented = function (store) {
        var m;
        for (m in cyste.Interface) {
            if (cyste.Interface.hasOwnProperty(m)) {
                if (store[m]!=null) {
                    if (typeof cyste.Interface[m] !== typeof store[m]) {
                        throw ("artemia : " + store.storeType + " Storage : '" + m + "' (" + typeof store[m] + ")" + " : bad type");
                    }
                } else {
                    throw ("artemia : " + store.storeType + " Storage : '" + m + "' method is missing");
                }
            }
        }
    };

    /*===========================================
        HTML5 Storage :
            type="session"
            type="local"

        Global Storage :
            type="global"

        UserData Storage :
            type="userdata"

        SqLite Storage :
            type="sqlite"

    ===========================================*/

    cyste.getStore = function (params) {
        /*{type:'local',base:'myfirstbase'}*/
        var store = cyste['get_' + params.type.toUpperCase() + '_store'](params.base, params.type, params.domain);
        cyste.interfaceIsImplemented(store);

        store.query = function (map, callback) {
            var results = [], res;
            this.all(function (r) {
                var m;
                for (m in r) {
                    if (r.hasOwnProperty(m)) {
                        res = map(r[m]);
                        if (res) { results.push(res); }
                    }
                }
                if (callback) { callback(results); }
            });
            //if (callback) { callback(results); }
            if (this.useReduce) {
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
                    ,
                    product : function (callback) {
                        res = cyste.product(results);
                        if (callback) { callback(res); }
                        return res;
                    }
                };
            }else{
                return null;
            }

        }
        return store;
    };

    cyste.allDbs = function () {
        /*TODO*/
    };

    cyste.guidGenerator = function () {
        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    };

    cyste.sum = function (values) {
        var m, total = 0;
        for (m in values) {
            if (values.hasOwnProperty(m)) {
                total += values[m];
            }
        }
        return total;
    };

    cyste.product = function (values) {
        var m, total = 1;
        for (m in values) {
            if (values.hasOwnProperty(m)) {
                total = total * values[m];
            }
        }
        return total;
    };

    /*
        John Resig tips :
        http://ejohn.org/blog/fast-javascript-maxmin/
    */

    cyste.min = function (values) {
        return Math.min.apply(Math, values);
    };

    cyste.max = function (values) {
        return Math.max.apply(Math, values);
    };

    return cyste;

}());
