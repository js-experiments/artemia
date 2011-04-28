
var artemia = (function (cyste) {
    /*
        Navigator : WebKit

        sessionStorage
        localStorage
    */

    /*the _UPPER_ is a convention*/
    cyste.get_SESSION_store = function(baseName,storeType){
        var store=this._getStore(window["sessionStorage"],baseName,storeType);
        cyste.interfaceIsImplemented(store);
        if(!store.isAvailable()){store=null;}
        return store;
    };

    /*the _UPPER_ is a convention*/
    cyste.get_LOCAL_store = function(baseName,storeType){
        var store=this._getStore(window["localStorage"],baseName,storeType);
        cyste.interfaceIsImplemented(store);
        if(!store.isAvailable()){store=null;}
        return store;
    };

    return cyste;
}(artemia));
