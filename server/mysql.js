module.exports = (includer) => {
    let MySQL   = includer.get('MySQL');
    let conf    = includer.get('config');
    return MySQL.createConnection({
        host     : conf.db.host,
        user     : conf.db.user,
        password : conf.db.password,
        database : conf.db.database
    });
//    connection.connect();
};
