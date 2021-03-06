const Loger = require('./loger');
const loger = new Loger('Helper');
const spawn = require('child_process').spawn;
/*
 * Helper error code 10****
 */
class Helper {
    static errorHandler(err)
    {
        if(err) {
            loger.log(err.code);
        }
    }

    static serverGetMultiImage (req, res) {
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
    }
}

module.exports = Helper;