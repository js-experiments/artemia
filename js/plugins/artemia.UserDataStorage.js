/*

 */

var artemia = (function (cyste) {
    /*
        Navigator : IE
    */

    function getUserDataStore(baseName,storeType){

        return {
            storeType:storeType,
            baseName:baseName,
            isAvailable:function(){},
            get:function(){},
            remove:function(){},
            save:function(){},
            drop:function(){},
            query:function(){}
        };
    };

    /*the _UPPER_ is a convention*/
    cyste.get_USERDATA_store = function(baseName,storeType){
        var store=getUserDataStore(baseName,storeType);
        cyste.interfaceIsImplemented(store);
        if(!store.isAvailable()){store=null;}
        return store;
    };


    return cyste;
}(artemia));
