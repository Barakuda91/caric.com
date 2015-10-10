module.exports = function(serviceLocator)
{
    var ws      = serviceLocator.get('ws');
    var http    = serviceLocator.get('http');
    var fs      = serviceLocator.get('fs');
    var config  = serviceLocator.get('config');

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
    console.log('Oku');

}
