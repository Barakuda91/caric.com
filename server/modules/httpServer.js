module.exports = function(serviceLocator)
{
    var http        = serviceLocator.get('http');
    //var Router  = serviceLocator.get('router');
    var path        = serviceLocator.get('path');
    var url         = serviceLocator.get('url');
    var fs          = serviceLocator.get('fs');
    var config      = serviceLocator.get('config');
    var Functions   = serviceLocator.get('functions');
    var _           = new Functions();
    var logir       = serviceLocator.get('logir')('http cервер');


    return function()
    {
        this.start = function()
        {
            var _this = this;
            function router(req, res)
            {
                var parsedUrl = url.parse(req.url);
                var query = _.queryParse(parsedUrl.query);
                var pathname = parsedUrl.pathname;
                var pathArray = _.clearEmpty(pathname.split('/'));
                var module = pathArray[0] || 'index';
                var page = pathArray[1] || 'index.html';
                var requestFile;

                fs.stat(config.__publicDir + "/moduls/" + module, function (err, stats)
                {
                    console.log(config.__publicDir + "/moduls/" + module);
                    if(!err)
                    {
                        if(stats.isDirectory())
                        {
                            logir('запрошеный модуль найден'.cyan,4);
                            _this.page({
                                filename: config.__publicDir + "/moduls/"+module+"/pages/"+page,
                                headers: {"Content-Encoding": "UTF-8"}
                            }, res);
                        }
                        else
                        {
                            logir('запрошеный модуль оказался не каталогом, отдаю 404'.cyan,4);
                            _this.page(res);
                        }
                    }
                    else if(err.errno == -2)
                    {
                        logir('запрошеный модуль не найден, отдаю 404'.cyan,4);
                        _this.page(res);
                    }
                    else
                    {
                        logir('ошибка при открытии модуля',1);
                        _this.page(res);
                    }
                });
            }
            http.createServer(router).listen(config.__serverPort);
            logir('запустился на порту '.yellow+config.__serverPort,3);
        };
        this.page = function(options, res)
        {
            if(options.socket)
            {
                res = options;
                options = {}
            }

            if(!options.filename)
            {
                options.filename = config.__publicDir + "/templates/404.html";
                options.status = options.status || '404';
            }
            else
            {
                options.status = options.status || '200';
            }

            options.headers = options.headers || {};
            console.log(options);
            var readStream = fs.createReadStream(options.filename);
            var _this = this;
            readStream.on('open', function ()
            {
                res.writeHead(options.status, options.headers);
                res.write(
'<html>'+
'   <head>'+
'       <link href="css/index.css" rel="stylesheet">'+
'       <meta charset="utf-8">'+
'       <title>Страница </title>'+
'   </head>'+
'   <body>'+
'   <div class="content">'+
' Привет трамблёр!<br>'+
'   </div>'
                );

                readStream.pipe(res);


            });

            readStream.on('error', function(err)
            {
                if(err)
                logir('ошибка открытия файла '+options.filename);
                res.end();
            });

            readStream.on('end', function(err)
            {
                logir('передал файл '+options.filename);
                res.write(
'    </body>'+
'</html>'
                );

                res.end();
            });
        }
    }
}
