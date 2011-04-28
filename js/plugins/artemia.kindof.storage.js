/*
    model of adaptor plugin
 */

var artemia = (function (cyste) {

    function getKindOfStore(baseName,storeType){

        return {
            storeType:storeType,
            baseName:baseName,
            isAvailable:function(){},
            get:function(){},
            remove:function(){},
            save:function(){},
            all:function(){},
            drop:function(){},
            query:function(){}
        };
    };

    /*the _UPPER_ is a convention*/
    cyste.get_KINDOF_store = function(baseName,storeType){
        var store=getKindOfStore(baseName,storeType);
        cyste.interfaceIsImplemented(store);
        if(!store.isAvailable()){store=null;}
        return store;
    };


    return cyste;
}(artemia));