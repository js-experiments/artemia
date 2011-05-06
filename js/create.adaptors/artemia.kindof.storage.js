/*
    model of adaptor plugin
 */

var artemia = (function (cyste) {

    function getKindOfStore(baseName,storeType){

        return {
            storeType : storeType,
            storeName : baseName,
            useReduce : true,
            isAvailable : function(){},
            get : function(){},
            remove : function(){},
            save : function(){},
            all : function(){},
            drop : function(){}
        };
    };

    /*the _UPPER_ is a convention*/
    cyste.get_KINDOF_store = function(baseName,storeType){
        var store=getKindOfStore(baseName,storeType);
        if(!store.isAvailable()){store=null;}
        return store;
    };


    return cyste;
}(artemia));