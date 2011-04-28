
/*
    Global storage needs http mode to run
    generates error if file mode (file:///)

    Error: uncaught exception:
    [Exception... "Security error"  code: "1000" nsresult: "0x805303e8 (NS_ERROR_DOM_SECURITY_ERR)"
    location: "file:///Users/k33g_org/Dropbox/projects/artemia/js/plugins/artemia.GlobalStorage.js Line: 12"]

 */


var artemia = (function (cyste) {
    /*
        Navigator : FireFox
    */

    /*the _UPPER_ is a convention*/
    cyste.get_GLOBAL_store = function(baseName,storeType){
        var store=this._getStore(window.globalStorage[window.location. hostname],baseName,storeType);
        cyste.interfaceIsImplemented(store);
        if(!store.isAvailable()){store=null;}
        return store;
    };


    return cyste;
}(artemia));
