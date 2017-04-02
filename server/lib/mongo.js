class MongoDB {
    constructor (includer, resolve, reject) {
        const mongo_db  = includer.get('mongo_db');
        const config    = includer.get('config');
        const Loger     = includer.get('Loger');
        const url       = config.get('mongoDBUrl');

        this.status     = 'pending';
        this.loger          = new Loger('Mongo_Server');
        this.db             = null;
        this.collProxy      = null;
        this.collWorkers    = null;

        let _ = this;

        mongo_db.connect(url, function(err, db) {

            _.db = db;
            _.collProxy      = db.collection('proxy');
            _.collWorkers    = db.collection('workers');

            _.loger.log("Connected correctly to server");

            includer.set('MongoDB', _);

            _.status = 'ready';
            resolve()
            // db.close();
        });
    }

    insert (obj) {
        let _ = this;
        _.collProxy.insert(obj, function(err, result) {
            _.loger.log("Inserted 3 documents into the document collection");
        });
    }
}

module.exports = MongoDB;