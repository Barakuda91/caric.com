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
/*----------------------------start---------------------------------------------
* метод старта http сервера, запускает preStartCheck() метод
*/
        this.start = function()
        {
            var _this = this;

            _this.preStartCheck(function()
            {
                http.createServer(_this.router).listen(config.__serverPort);
                logir('запустился на порту '.yellow+config.__serverPort,3);
            });

        };
//----------------------------конец-метода--------------------------------------

/*----------------------------preStartCheck-------------------------------------
* проверяет наличие файлов, нужных для корректрой работы сервера,
* в зависимости от настроек сервера, при обнаружении отсутствия
* одного из файлов запускает сервер, или выдаёт ошибку.
*/
        this.preStartCheck = function(callback)
        {
            var filesObj = {};
            var noFile = false; // тру если какого-то файла нет
            var filesCount = config.__importentFiles.length
            var currFileCount = 0;

            config.__importentFiles.forEach(function(currFile)
            {
                _.isFileExist(config.__publicDir+'/'+currFile, function(result)
                {
                    currFileCount++;
                    filesObj[currFile] = result;
                    if(!result && !noFile) noFile = true;
                    ifEnd();
                });
            });

            function ifEnd()
            {
                if(currFileCount >= filesCount)
                {
                    if(noFile)
                    { // отсутствует один или более зависимых файлов
                        if(config.__startServerNoDependentFile)
                        {
                            logir('отсутствует зависимый файл',2,filesObj);
                            callback();
                        }
                        else logir('сервер не запущен, так как отсутствует зависимый файл',2,filesObj);
                    }
                    else
                    { // все зависимые файлы присутствуют
                        callback();
                    }
                }
                else
                {
                    return false;
                }
            }

            // config.__startServerNoDependentFile
        };
//----------------------------конец-метода--------------------------------------

/*----------------------------page----------------------------------------------
* формирует html страницы, открывает запрошеный файл, отдаёт в браузер
* сформированый html, отдает в браузер содержимое открытого файла
*/
        this.page = function(modul, page, res)
        {
            var _this = this;

            options.filename = config.__publicDir + "/templates/404.html";

            var readStream = fs.createReadStream(options.filename);

            var html = '';

            readStream.on('open', function ()
            {
                res.writeHead(options.status, options.headers);
                res.write(html);

                readStream.pipe(res);


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

            readStream.on('error', function(err)
            {
                if(err)
                    logir('ошибка открытия файла '+options.filename);
                res.write('Ошибка открытия файла');
                res.end();
            });

        }
//----------------------------конец-метода--------------------------------------

/*----------------------------router--------------------------------------------
*
*/
        this.router = function(req, res)
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
//----------------------------конец-метода--------------------------------------

/*------------------------------------------------------------------------------
*
*/

    }
}
