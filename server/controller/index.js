class IndexController {
    constructor (includer) {
        this.connection     = includer.get('connection');
        this.queryString    = includer.get('queryString');
        this.url            = includer.get('url');

    }
    getImage(req, res) {
        //let headers = req.headers;
        //let method  = req.method;
        let uri     = this.url.parse(req.url);
        //let reqType = uri.pathname;
        let reqQuery= uri.query;
        //delete uri;

        const parsed = this.queryString.parse(reqQuery);

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
                res.writeHead(200, {'Content-Type': 'image/png'});
                // отдавать шаблом с нонеймом
                return;
            }

            let img = gm();
            for (var i = 0; i < rows.length; i++) {
                img.append('/var/www/caric.com/public/images/data/auto/'+queryArray[i]+'_'+rows[i].title+'.PNG', true)

                console.log(queryArray[i]+'_'+rows[i].title+'.PNG');
                if(i == rows.length - 1) {
                    res.writeHead(200, {'Content-Type': 'image/png'});
                    img.stream('png').pipe(res);
                }
            }
         });
    }
}



module.exports = IndexController;