module.exports = function(serviceLocator)
{
    var http        = serviceLocator.get('http');
    var path        = serviceLocator.get('path');
    var url         = serviceLocator.get('url');
    var fs          = serviceLocator.get('fs');
    var config      = serviceLocator.get('config');
    var Functions   = serviceLocator.get('functions');
    var _           = new Functions();
    var logir       = serviceLocator.get('logir')('http cервер');


    return function()
    {
        var _this = this;
/*----------------------------раздел-переменных-------------------------------*/
        this.htmlFileTemplateArray = []; // массив строк файла-шаблона
/*----------------------------конец-раздела-----------------------------------*/

/*----------------------------start---------------------------------------------
* метод старта http сервера, запускает preStartCheck() метод
*/
        this.start = function()
        {
            _this.createVariables();
            _this.preStartCheck(function()
            {
                http.createServer(_this.router).listen(config.__serverPort);
                logir('запустился на порту '.yellow+config.__serverPort,3);
            });

        };
//----------------------------конец-метода--------------------------------------

/*----------------------------createVariables-----------------------------------
* наполняет все переменные, которые нужны для работы сервера
*/
        this.createVariables = function()
        {
            fs.readFile(config.__default.htmlTemplate, function(err, data)
            {
                if(err) throw err;
                _this.htmlFileTemplateArray = data.toString().split("\n");
            });
        }
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
                _.isFileExist(config.__rootDir+'/'+currFile, function(result)
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
        };
//----------------------------конец-метода--------------------------------------

/*----------------------------page----------------------------------------------
* если файл есть, формирует html страницы, открывает запрошеный файл,
* отдаёт в браузер html, отдает в браузер содержимое открытого файла
* если файла нет проделывает тоже самое с шаблоном 404
*/
        this.openPage = function(modul, page, res)
        {
            var routerPath      = config.__publicDir+'/moduls/'+modul+'/router.json';
            var pathToRouter    = '/moduls/'+modul;
            var filePath        = config.__publicDir+'/moduls/'+modul+'/pages/'+page;

            _.isFileExist(filePath,function(result)
            {
                if(!result)
                { // файл не найден, ставим дефаулт
                    filePath = config.__default.page404;
                }

                _.isFileExist(routerPath,function(result)
                {
                    if(!result)
                    { // роутер не найден, ставим дефаулт
                        routerPath = config.__default.router;
                        pathToRouter = config.__default.pathToRouter;
                    }
                    readRouter(openAndPipe);
                });
            });

            function readRouter(callback)
            {
                fs.readFile(routerPath, function(err, file)
                {
                    if(err)
                    {
                        logir('ошибка открытия роутера ', 1,err);
                    }
                    else
                    {
                        try {
                            var json = JSON.parse(file.toString());
                            callback(json);
                        } catch (err) {
                            logir('роутер должен соответствовать формату json ', 1,err)
                        }

                    }
                });
            }

            function openAndPipe(router)
            {
                var htmlHead = '';
                var htmlFoot = '';
                var currHtmlVar = htmlHead;

                _.foreach(_this.htmlFileTemplateArray, function(element, next)
                {
                    switch(element.trim())
                    {
                        case'title':
                            res.write("<title>"+router.title+"</title>\n");
                            next();
                        break;

                        case'style':
                            writeElement('css', next);
                        break;

                        case'content':
                            piping(next);
                        break;

                        case'script':
                            writeElement('js', next);
                        break;

                        default:
                            res.write(element+"\n");
                            next();
                        break;
                    }
                },
                function(){
                    logir('закончил формировать страничку ',3);
                    res.end();
                });

                function writeElement(type,next)
                {
                    var allFiles = router[type].length;
                    var currFile = 0;
                    var html = '';

                    router[type].forEach(function(element)
                    {
                        var path = pathToRouter+"/"+type+"/"+element+"."+type;
                        console.log(path);
                        currFile++;
                        if(type == 'css')
                        {
                            html += "<link rel=\"stylesheet\" href=\""+path+"\">\n";
                        }
                        else if(type == 'js')
                        {
                            html += "<script src=\""+path+"\"></script>\n";
                        }
                        check();
                    });

                    function check()
                    {
                        if(currFile >= allFiles)
                        {
                            res.write(html);
                            next();
                        }
                    }
                }

                function piping(next)
                {
                    var readStream = fs.createReadStream(filePath);
                    readStream.on('open', function ()
                    {
                        readStream.pipe(res);
                    });

                    readStream.on('end', function(err)
                    {
                        logir('передал файл '+filePath);
                        next();
                    });

                    readStream.on('error', function(err)
                    {
                        if(err)
                            logir('ошибка открытия файла '+filePath);
                        res.write('Ошибка открытия файла');
                        res.end();
                    });
                }
            }
        }
//----------------------------конец-метода--------------------------------------

/*----------------------------openFile------------------------------------------
* проверяет наличие, и отдаёт в браузер запрошеный файл
*/
        this.openFile = function(filename,mimeType,res)
        {
            var readStream = fs.createReadStream(config.__publicDir+filename);
            readStream.on('open', function ()
            {
                res.writeHead(200, {'Content-Type': mimeType});
                readStream.pipe(res);
            });

            readStream.on('end', function(err)
            {
                logir('передал файл '+filename);
                res.end();
            });

            readStream.on('error', function(err)
            {
                if(err)
                    logir('ошибка открытия файла '+filename);
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
            var mimeTypes = {
                "jpeg": "image/jpeg",
                "jpg": "image/jpeg",
                "png": "image/png",
                "js": "text/javascript",
                "css": "text/css"};

            var mimeType = path.extname(pathname).split(".")[1];
            if (mimeType in mimeTypes)
            {
                console.log('открываю файл типа '+mimeType);
                _this.openFile(pathname,mimeTypes[mimeType],res);
            }
            else
            {
                console.log('открываю страницу');
                fs.stat(config.__publicDir + "/moduls/" + module, function (err, stats)
                {
                    if(!err)
                    {
                        if(stats.isDirectory())
                        {
                            logir('запрошеный модуль найден'.cyan,4);
                            _this.openPage(module, page, res);
                        }
                        else
                        {
                            logir('запрошеный модуль оказался не каталогом, отдаю 404'.cyan,4);
                            _this.openPage(res);
                        }
                    }
                    else if(err.errno == -2)
                    {
                        logir('запрошеный модуль не найден, отдаю 404'.cyan,4);
                        _this.openPage(res);
                    }
                    else
                    {
                        logir('ошибка при открытии модуля',1);
                        _this.openPage(res);
                    }
                });
            }
        }
//----------------------------конец-метода--------------------------------------

/*------------------------------------------------------------------------------
*
*/

    }
}
