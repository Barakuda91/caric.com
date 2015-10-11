module.exports = function(serviceLocator)
{
    var ws      = serviceLocator.get('ws');
    var http    = serviceLocator.get('http');
    var fs      = serviceLocator.get('fs');
    var config  = serviceLocator.get('config');
    var Functions   = serviceLocator.get('functions');
    var funck       = new Functions();
    var logir       = serviceLocator.get('logir')('Cервер');
    http.createServer(function (req, res)
    {

        var filename = config.__publicDir+req.url;

        var readStream = fs.createReadStream(filename);

        readStream.on('open', function ()
        {
            readStream.pipe(res);
        });

        readStream.on('error', function(err)
        {
            res.end(err);
        });


    }).listen(config.__serverPort);
    logir('запустился на порту '.yellow+config.__serverPort,3);

}
