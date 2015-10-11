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
            function router(req, res)
            {
                var parsedUrl = url.parse(req.url);
                var query = _.queryParse(parsedUrl.query);
                var pathname = parsedUrl.pathname;
                var pathArray = _.clearEmpty(pathname.split('/'));
                var module = pathArray[0] || 'index';
                var page = pathArray[1] || 'index.html';

                fs.stat(config.__publicDir + "/moduls/" + module, function (err, stats)
                {
                    console.log(config.__publicDir + "/modules/" + module);
                    if(!err)
                    {
                        if(stats.isDirectory())
                        {
                            logir('запрошеный модуль найден'.cyan,4);
                        }
                        else
                        {
                            logir('запрошеный модуль оказался не каталогом, отдаю 404'.cyan,4);
                        }
                    }
                    else if(err.errno == -2)
                    {
                        logir('запрошеный модуль не найден, отдаю 404'.cyan,4);
                    }
                    else
                    {
                        logir('ошибка при открытии модуля',1);
                    }
                });
            }
            http.createServer(router).listen(config.__serverPort);
            logir('запустился на порту '.yellow+config.__serverPort,3);
        }
    }
}
