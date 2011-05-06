#--=>>>|:<

##What is artemia ?

Artemia is a clientside JSON document store like Lawnchair (in the way of CouchDb).

initially, it was designed to work with several adaptors :

- local storage (Webkit)
- session storage (Webkit)
- global storage (Firefox)
- sqlite storage (Webkit)

But you can find a userdata storage plug-in too (see artemia.userdata.storage.js)

It's very very (and very) inspired by Lawnchair (he copy many aspects, normal, i love Lawnchair)
but has some specific features :

- plug-in mode with module pattern
- **Only for local, session, global (and userdata) storages** :some reduce function with `query()` method : `sum()`, `product()`, `min()`, `max()`

##How to ?

###Install it

If you want to work with local storage, or/and session storage, or/and global storage :

~~~ html
    <script src="../js/artemia.js"></script>
    <script src="../js/adaptors.plugins/artemia.storage.js"></script>
~~~

If you want to work with sqlite storage :

~~~ html
    <script src="../js/artemia.js"></script>
    <script src="../js/adaptors.plugins/artemia.sqlite.js"></script>
~~~

###Init

~~~ js
    /* local storage */
    var localStore = artemia.getStore({type : 'local', base : 'myfirstbase'});

    /* session storage */
    var sessionStore = artemia.getStore({type : 'session', base : 'myotherbase'});

    /* global storage */
    var globalStore = artemia.getStore({
        type : 'global',
        base : 'mybase',
        domain : window.location.hostname
    });

    /* sqlite storage */
    var dbStorage = artemia.getStore({type : 'sqlite', base : 'myDataBase'});
~~~

**Remark :** with FF (global storage) you have to provide 'domain' parameter, see : [http://ejohn.org/blog/dom-storage/](http://ejohn.org/blog/dom-storage/) and [http://ejohn.org/blog/dom-storage-answers/](http://ejohn.org/blog/dom-storage-answers/) and your page has to be served by an http server (no 'file:///', but 'http://' way)

###Methods

**save(document, callback)** : insert or update a document

~~~ js
    var myBook = {
        key :"0001",
        title : "Hello",
        author : "Me",
        text : "this the doc one",
        price : 5
    }

    myStore.save(myBook, function(r) { /*callback function*/ });

    /*
        r return the object
        if you have not provided a key, artemia generates an unique key for you
        you can read it with r.key
    */
~~~

**get(key, callback)** : retrieve a document

~~~ js
    myStore.get("0001", function(r) {
        console.log(r.key, r.title);
    });
~~~

*Remark : if you want to update a document, you have to get it with `get()` before `save()` it*

**remove(key_or_object, callback)** : remove a document

~~~ js
    myStore.remove("0001", function(r) { /*callback function*/ });
    /* or if you have already get a document*/
    myStore.remove(document, function(r) { /*callback function*/ });
~~~

**all(callback)** : get all documents (return an array of objects)

~~~ js
    myStore.all(function(r){
        var i;
        for(i = 0; i < r.length; i += 1 ) {
            document.write(r[i].key + " " + r[i].title + " " + r[i].text + "<BR>");
        }
    });
~~~

**query(map, callback)** : return an array of objects, filtered by a "map" function

~~~ js
    /*i want all document written by "Me"*/
    var mapFunction = function(doc) {
      if (doc.author == "Me")
        return doc
    };

    myStore.query(mapFunction, function(r) {
        var i;
        for(i = 0; i < r.length; i += 1 ) {
            document.write(r[i].key + " " + r[i].title + " " + r[i].text + "<BR>");
        }
    });
~~~

**drop(callback)** : drop the store

~~~ js
    myStore.drop(function(r) { /*callback function*/ });
~~~


##Specific features : reduce functions (!!! not for sqlite storage)

~~~ js
    var mapFunction = function(doc){
        return doc.price;
    }

    var min = myStore.query(map).min();

    /* or */

    myStore.query(map).min(function(r) { /* r = min */ });

    /* or */

    myStore.query(map, function(r) { /* r = result set */ }).min(function(r) { /* r = min */ });

    /* and of course */

    var max = myStore.query(map).max();

    var sum = myStore.query(map).sum();

    var product = myStore.query(map).product();

~~~

###But ... If you want to do the same thing with sqlite storage :

You can do that (less pretty i know) :

~~~ js
    myStore.query(sumFunction,function(r){
        console.log("SUM : ", artemia.sum(r));
        console.log("PRODUCT : ", artemia.product(r));
        console.log("MIN : ", artemia.min(r));
        console.log("MAX : ", artemia.max(r));
    })
~~~

##Create an adaptor

Imagine you want to create a CoucDb adaptor you can call like this : `var couchDb = artemia.getStore({type : 'couchdb', base : 'mybase'});`

you have just to create a new js file like this

~~~ js
var artemia = (function (cyste) {

    function getCouchDBStore(baseName,storeType){

        return {
            storeType:storeType,
            storeName:baseName,
            isAvailable:function(){},
            get:function(){},
            remove:function(){},
            save:function(){},
            all:function(){},
            drop:function(){}
        };
    };

    /*the _UPPER_ is a convention*/
    cyste.get_COUCHDB_store = function(baseName,storeType){
        var store = getCouchDBStore(baseName,storeType);
        if(!store.isAvailable()){store=null;}
        return store;
    };

    return cyste;
}(artemia));
~~~

**Remark** : if type = "couchdb" you have to cretae a function named `cyste.get_COUCHDB_store` with "couchdb" **capitalized**, if type = "johndoe" : `cyste.get_JOHNDOE_store`, etc. ...

it's a convention (and type is always in lowercase), it allows you add plug-in **without** modify core artemia.js.

**Be careful** : it is mandatory to implement this :

~~~ js
    cyste.Interface = {
        storeType : '',
        storeName : '',
        isAvailable : function () {},
        get : function () {},
        remove : function () {},
        save : function () {},
        all : function () {},
        drop : function () {}
    };
~~~

##Add a functionality

Just do this (in an other js file) :

~~~ js
    var artemia = (function (cyste) {

        cyste.myFunction = function() { return null; }

        return cyste;
    }(artemia));
~~~

##Minified versions

You can find :

- artemia.min.js (Compiled Size : 1.38KB)
- artemia.storage.min.js (Compiled Size : 1.14KB)
- artemia.sqlite.storage.min.js (Compiled Size : 2.03KB)

- artemia.pkg.lite.min.js = artemia + artemia.storage (Compiled Size : 2.52KB)
- artemia.pkg.min.js = artemia + artemia.storage + artemia.sqlite.storage (Compiled Size : 4.55KB)

##TO DO

- Write real samples, mine are very creepy
- Improve my english (creepy too)
- a CouchDb adaptor ?
