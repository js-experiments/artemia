/**
 * Created by k33g_org.
 * User: k33g_org
 * Date: 4/27/11
 * Time: 5:31 PM
 * --=>>>|:<
 */

var artemia = (function () {

    var cyste = {};

    cyste.interface = {
        storeType:'',
        baseName:'',
        isAvailable:function(){},
        get:function(){},
        remove:function(){},
        save:function(){},
        drop:function(){},
        query:function(){}
    };

    cyste.interfaceIsImplemented = function(store){
        var m;
        for(m in cyste.interface){
            if(store[m]){
                if(!(typeof cyste.interface[m] == typeof store[m])){
                    throw("artemia : "+store.storeType+" Storage : '"+m+"' ("+typeof store[m]+")"+" : bad type");
                }
            }else{
                throw("artemia : "+store.storeType+" Storage : '"+m+"' method is missing")
            }
        }
    };

    /*
        HTML5 Storage :
            type="session"
            type="local"

        Global Storage :
            type="global"

        UserData Storage :
            type="userdata"

    */
    cyste.getStore = function(params){
        /*{type:'local',base:'myfirstbase'}*/
        return cyste['get_'+params.type.toUpperCase()+'_store'](params.base,params.type);
    };

    cyste._getStore = function(kindOfStore,baseName,storeType){
        return {
            storeType:storeType,
            baseName:baseName,

            isAvailable:function(){
                try{
                    kindOfStore.setItem("testKey","testValue");
                    kindOfStore.removeItem("testKey");
                }catch(err){
                    return false;
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
                    obj.key = id.split('|')[1];
                    callback(obj);
                }catch(err){throw(e);}
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

    cyste.allDbs = function(){
        /*TODO*/
    };

    cyste.guidGenerator = function() {
        var S4 = function() {
           return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    };

    cyste.sum = function(values){
        var m,total=0;
        for(m in values){
            total+=values[m];
        }
        return total;
    };

    cyste.min = function(values){
        /*TODO*/
    };

    cyste.max = function(values){
        /*TODO*/
    };

    return cyste;

}());
