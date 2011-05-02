
/* 04/30/11
    jslint
        white: true, onevar: true, browser: true, undef: true,
        nomen: true, regexp: true, plusplus: true,
        bitwise: true, newcap: true, maxerr: 50, indent: 4
*/

var artemia = (function (cyste) {

    /*===========================================
        Navigator : IE
    ===========================================*/

    function getUserDataStore(storeName, storeType) {

        /*
            from jsMag august 2010 article :
            "Web Storage Explained"
            by Jim Anderson

        */
        function getStorageEl() {
            var elName = storeName, el;
            /* We have to have a Dom element to operate on.
            If one already exists, we’ll use it. Otherwise,
            create it and attach the necessary behavior.*/

            el = document.getElementById(elName);
            if (!el) {
                el = document.createElement('div');
                el.id = elName;
                el.style.display = 'none';
                el.style.behavior = 'url(\'#default#userData\')';
                document.body.appendChild(el);
            }
            return el;
        }

        return {
            storeType : storeType,
            storeName : storeName,
            isAvailable : function () {
                try {
                    getStorageEl().load(this.storeName);
                    return true;
                } catch (err) {
                    //alert(err);
                    return false; /*not available*/
                }
            },

            get : function (key, callback) {
                /* '|, :, ' are forbidden with IE i use '__' instead */
                var obj, storageEl = getStorageEl();
                storageEl.load(this.storeName);
                obj = JSON.parse(storageEl.getAttribute(this.storeName + '__' + key));
                if (obj) {obj.key = key; callback(obj); } else { callback(null); }
            },

            remove : function (keyOrObject, callback) {
                /* '|, :, ' are forbidden with IE i use '__' instead */
                var key = this.storeName + '__' + (typeof keyOrObject === 'string' ? keyOrObject : keyOrObject.key),
                    storageEl = getStorageEl();
                /*TODO: have to verify if exists before delete*/
                storageEl.removeAttribute(key);
                storageEl.save(this.storeName);
                callback(key);
            },

            save : function (obj, callback) {
                /* '|, :, ' are forbidden with IE i use '__' instead */
                var id = this.storeName + '__' + (obj.key || cyste.guidGenerator()), storageEl;
                delete obj.key;
                try {
                    storageEl = getStorageEl();
                    storageEl.setAttribute(id, JSON.stringify(obj));
                    storageEl.save(this.storeName);

                    obj.key = id.split('__')[1];
                    callback(obj);
                } catch (err) { throw (err); }
            },

            all : function (callback) {
                var results = [], i,
                    store = getStorageEl().XMLDocument.firstChild.attributes,
                    l = store.length, id, obj;

                for (i = 0; i < l; i += 1) {
                    id = store[i];
                    obj = JSON.parse(id.nodeValue);
                    obj.key = id.nodeName.split('__').slice(1).join("__");
                    results.push(obj);
                }
                callback(results);
            },

            drop : function (callback) {
                var that = this;
                function something() {}
                this.all(function (r) {
                    var m;
                    for (m in r) {
                        if (r.hasOwnProperty(m)) {
                            that.remove(r[m].key, something());
                        }
                    }
                });
                callback();
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
                });
                if (callback) { callback(results); }

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

    /*the _UPPER_ is a convention*/
    cyste.get_USERDATA_store = function (baseName, storeType) {
        var store = getUserDataStore(baseName, storeType);
        cyste.interfaceIsImplemented(store);
        if (!store.isAvailable()) { store = null; }
        return store;
    };

    return cyste;
}(artemia));

