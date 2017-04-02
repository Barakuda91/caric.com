const includer      = require('./lib/includer');
const Helper        = require('./lib/helper');
const Loger         = require('./lib/loger');
const Mongo         = require('./lib/mongo');
const config        = require('config');
const http          = require('http');
const fs            = require('fs');
const gm            = require('gm');
const url           = require('url');
const route         = require('router');
const ws            = require('ws').Server;
const mysql         = require('promise-mysql');
const queryString   = require('query-string');

const serverPort    = config.get('ports.serverPort');
const socketPort    = config.get('ports.socketPort');
const host          = config.get('access.mysql.host');
const user          = config.get('access.mysql.user');
const password      = config.get('access.mysql.password');
const database      = 'fdhskjhjfkj';//config.get('access.mysql.database');
const wss           = new ws({ port: socketPort });
const loger         = new Loger('Start');
let connection
mysql.createConnection({host, user, password, database})
    .then(function(conn){
        if (conn) {
            loger.log('Connect to Mysql');
        }
        connection = conn;

    }).catch(Helper.errorHandler);








http.createServer(function(request, response) {
    let headers = request.headers;
    let method  = request.method;
    let uri     = url.parse(request.url);
    let reqType = uri.pathname;
    let reqQuery= uri.query;
    delete uri;

    switch (reqType) {
        case '/get_from_makes':
            const parsed = queryString.parse(reqQuery);

            if ( ['car', 'wheel'].indexOf(parsed.type) < 0 ) parsed.type = 'car';

            let queryArray = parsed.q.split( /(?=(?:\d{3})+(?!\d))/ );
            let queryStr = '(';

            queryArray.forEach(function (el,i) {
                if(el[0] == 0 ) el = el[1]+el[2];
                if(el[0] == 0 ) el = el[1];
                queryArray[i] = el;
                queryStr += el+',';
            });

            queryStr = queryStr.substring(0, queryStr.length - 1);
            queryStr += ')';

            connection.query("SELECT `img_position`,`title` FROM `manufacture` WHERE `type` = '" + parsed.type + "' AND `img_position` IN "+queryStr, function(err, rows, fields) {
                if (err) {
                    console.log('SQL ERROR');
                    throw err;
                    response.writeHead(200, {'Content-Type': 'image/png'});
                    // отдавать шаблом с нонеймом
                    return;
                }

                let img = gm();
                for (var i = 0; i < rows.length; i++) {
                    img.append('/var/www/caric.com/public/images/data/auto/'+queryArray[i]+'_'+rows[i].title+'.PNG', true)

                    console.log(queryArray[i]+'_'+rows[i].title+'.PNG');
                    if(i == rows.length - 1) {
                        response.writeHead(200, {'Content-Type': 'image/png'});
                        img.stream('png').pipe(response);
                    }
                }

            });
        break;
    }




    // response.writeHead(200, {'Content-Type': 'image/png'});
    // gm('../public/images/avto_makes.png')
    //     .stream('png')
    //     .pipe(response);

    // var g = gm('../public/images/avto_makes.png')
    //     .quality(100)
    //     .fuzz('20%')
    //     .fill('white')
    //     .quality(100)
    //     .transparent('white')
    //     //.trim()
    //     .resize('300','200');

}).listen(serverPort);

wss.on('connection', function connection(ws) {
    console.log(ws.upgradeReq.headers.host);
        ws.on('message', function incoming(message) {
        console.log('received: %s', message);

        ws.send(message);
        ws.send('something');
    });
});
console.log('Server http start on port: '+serverPort);
console.log('WS start on port: '+socketPort);