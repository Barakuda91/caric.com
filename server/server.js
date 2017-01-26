var serverPort  = 8888;
var socketPort  = 7788;

let Includer    = new require('./includer');
let includer = new Includer();
includer.set('http', require('http'));
includer.set('fs', require('fs'));
includer.set('gm', require('gm'));
includer.set('url', require('url'));
includer.set('mysql', require('mysql'));
let ws  = includer.set('ws', require('ws').Server);
let wss = includer.set('wss', new ws({ port: socketPort });

console.log(includer);
return;

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'db_caric_new'
});
connection.connect();

http.createServer(function(request, response) {
    var headers = request.headers;
    var method  = request.method;
    var uri     = url.parse(request.url);
    var reqType = uri.pathname;
    var reqQuery= uri.query;
    delete uri;

    switch (reqType) {
        case '/get_from_makes':
            var queryArray = reqQuery.split( /(?=(?:\d{3})+(?!\d))/ );
            var queryStr = '(';
            queryArray.forEach(function (el,i) {
                if(el[0] == 0 ) el = el[1]+el[2];
                if(el[0] == 0 ) el = el[1];
                queryArray[i] = el;
                queryStr += el+',';
            });

            queryStr = queryStr.substring(0, queryStr.length - 1);
            queryStr += ')';

            connection.query("SELECT `img_position`,`title` FROM `manufacture` WHERE `type` = 'car' AND `img_position` IN "+queryStr, function(err, rows, fields) {
                if (err) {
                    console.log('SQL ERROR');
                    throw err;
                    response.writeHead(200, {'Content-Type': 'image/png'});
                    // отдавать шаблом с нонеймом
                    return;
                }

                var img = gm();
                for (var i = 0; i < rows.length; i++) {
                    img.append('/var/www/caric.com/public/images/data/auto/'+queryArray[i]+'_'+rows[i].title+'.PNG', true);
                    console.log(queryArray[i]+'_'+rows[i].title+'.PNG');
                    if(i == rows.length - 1) {
                        response.writeHead(200, {'Content-Type': 'image/jpg'});
                        img.stream('jpg').pipe(response);
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