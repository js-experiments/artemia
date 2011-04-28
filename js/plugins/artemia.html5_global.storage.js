
var artemia = (function (cyste) {

    function getHtml5OrGlobalStore(kindOfStore,baseName,storeType){
        return {
            storeType:storeType,
            baseName:baseName,

            isAvailable:function(){
                try{
                    kindOfStore.setItem("testKey","testValue");
                    kindOfStore.removeItem("testKey");
                }catch(err){
                    return false; /*not available*/
                }
                return true;
            },

            get:function(key,callback){
                var obj = JSON.parse(kindOfStore.getItem(this.baseName+'|'+key));
                if(obj){obj.key=key;callback(obj);}else{callback(null);}
            },

            remove:function(keyOrObject,callback){
                var key = this.baseName + '|' + (typeof keyOrObject === 'string' ? keyOrObject : keyOrObject.key);
                /*TODO: have to verify if exists before delete*/
                kindOfStore.removeItem(key);
                callback(key);
            },

            save:function(obj,callback){
                var id = this.baseName+'|'+(obj.key || cyste.guidGenerator());
                delete obj.key;
                try{
                    kindOfStore.setItem(id,JSON.stringify(obj));

                    //console.log(JSON.stringify(obj));

                    obj.key = id.split('|')[1];
                    callback(obj);
                }catch(err){throw(err);}
            },

            all:function(callback){
                var results = [],i,store=kindOfStore,l=store.length,id,key,baseName,obj;
                for (i = 0 ; i < l; ++i){
                    id=store.key(i);
                    baseName = id.split('|')[0];
                    key = id.split('|').slice(1).join("|");
                    if(baseName==this.baseName){
                        obj = JSON.parse(kindOfStore.getItem(id));
                        obj.key = key;
                        results.push(obj);
                    }
                }
                callback(results);
            },

            drop:function(callback){
                var m,that=this;
                this.all(function(r){
                    for(m in r){
                        that.remove(r[m].key,function(){});
                    }
                });
                callback();
            },

            query:function(map,callback){
                var results = [],res,m;
                this.all(function(r){
                    for(m in r){
                        res = map(r[m]);
                        if(res){results.push(res);}
                    }
                });
                if(callback){callback(results);}

                return {
                    sum:function(callback){
                        res=cyste.sum(results);
                        if(callback){callback(res);}
                        return res;
                    },
                    min:function(callback){
                        res=cyste.min(results);
                        if(callback){callback(res);}
                        return res;
                    },
                    max:function(callback){
                        res=cyste.max(results);
                        if(callback){callback(res);}
                        return res;
                    }
                }

            }

        };
    };

    /*===========================================
        Navigator : WebKit

        sessionStorage
        localStorage
    ===========================================*/

    /*the _UPPER_ is a convention*/
    cyste.get_SESSION_store = function(baseName,storeType){
        var store=getHtml5OrGlobalStore(window["sessionStorage"],baseName,storeType);
        cyste.interfaceIsImplemented(store);
        if(!store.isAvailable()){store=null;}
        return store;
    };

    /*the _UPPER_ is a convention*/
    cyste.get_LOCAL_store = function(baseName,storeType){
        var store=getHtml5OrGlobalStore(window["localStorage"],baseName,storeType);
        cyste.interfaceIsImplemented(store);
        if(!store.isAvailable()){store=null;}
        return store;
    };

    /*===========================================
        Navigator : FireFox

        globalStorage
    ===========================================*/

    /*
        Global storage needs http mode to run
        generates error if file mode (file:///)

        Error: uncaught exception:
        [Exception... "Security error"  code: "1000" nsresult: "0x805303e8 (NS_ERROR_DOM_SECURITY_ERR)"
        location: "file:///Users/k33g_org/Dropbox/projects/artemia/js/plugins/artemia.GlobalStorage.js Line: 12"]

    */

    /*the _UPPER_ is a convention*/
    cyste.get_GLOBAL_store = function(baseName,storeType){
        var store=getHtml5OrGlobalStore(window.globalStorage[window.location. hostname],baseName,storeType);
        cyste.interfaceIsImplemented(store);
        if(!store.isAvailable()){store=null;}
        return store;
    };

    return cyste;
}(artemia));
