module.exports = function(serviceLocator)
{
    var http    = serviceLocator.get('http');
    var fs      = serviceLocator.get('fs');
    var config  = serviceLocator.get('config');
    var logir   = serviceLocator.get('functions').logir('http cервер');

    var object =  {};
    object.openFile = function(filename, res, callback)
    {
        var readStream = fs.createReadStream(filename);
console.log(filename);
        readStream.on('open', function ()
        {
            readStream.pipe(res);
        });

        readStream.on('finish', function ()
        {
            callback(null, true);
        });

        readStream.on('error', function(err)
        {
            callback(err, false);
        });
    }

    object.start = function()
    {
        http.createServer(function (req, res)
        {
            var filename = config.__publicDir+req.url;
            fs.exists(filename, function (exists)
            {
                if(!exists) filename = config.__publicDir+'/templates/404.html';
                logir('запрошен файл '.yellow+filename, 3);

                fs.stat(filename,function(err, stats)
                {
                    if(stats.isDirectory())
                    {
                        var readStream = fs.createReadStream(filename+'index.html');

                        readStream.on('open', function ()
                        {
                            readStream.pipe(res);
                        });

                        readStream.on('finish', function ()
                        {
                            console.log('finish ');
                        });

                        readStream.on('error', function(err)
                        {
                            console.log('error');
                        });
                    }
                    else if(stats.isFile())
                    {
                        object.openFile(filename);
                    }
                    else
                    {

                    }
                });

            });
        }).listen(config.__serverPort);
        logir('запустился на порту '.yellow+config.__serverPort,3);
    }

    return object;
}
