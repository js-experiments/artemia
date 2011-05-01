/**
 * Created by k33g_org.
 * User: k33g_org
 * Date: 4/27/11
 * Time: 5:31 PM
 * --=>>>|:<
 */


/*  04/30/11
    jslint
        white: true, onevar: true, undef: true, nomen: true,
        regexp: true, plusplus: true, bitwise: false, newcap: true,
        maxerr: 50, indent: 4
*/


var artemia = (function () {

    var cyste = {};

    cyste.Interface = {
        storeType : '',
        baseName : '',
        isAvailable : function () {},
        get : function () {},
        remove : function () {},
        save : function () {},
        all : function () {},
        drop : function () {},
        query : function () {}
    };

    cyste.interfaceIsImplemented = function (store) {
        var m;
        for (m in cyste.Interface) {
            if (cyste.Interface.hasOwnProperty(m)) {
                if (store[m]) {
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
        return cyste['get_' + params.type.toUpperCase() + '_store'](params.base, params.type);
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
