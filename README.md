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
- **Only for local, session, global (and userdata) storages ** :some reduce function with `query()` method : `sum()`, `product()`, `min()`, `max()`

##How to ?

###Install it

If you want to work with local storage, or/and session storage, or/and global storage :

~~~ html
    <script type="text/javascript" src="../js/artemia.js"></script>
    <script type="text/javascript" src="../js/adaptors.plugins/artemia.storage.js"></script>
~~~

If you want to work with sqlite storage :

~~~ html
    <script type="text/javascript" src="../js/artemia.js"></script>
    <script type="text/javascript" src="../js/adaptors.plugins/artemia.sqlite.js"></script>
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


##Create an adaptor

##Add a functionality

##TO DO

Write real samples, mine are very creepy