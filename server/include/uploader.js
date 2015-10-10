module.exports = function(serviceLocator)
{
    var fs      = serviceLocator.get('fs');
    var config  = serviceLocator.get('config');
    var logir   = serviceLocator.get('functions').logir('Загрузчик');
    var colors  = serviceLocator.get('colors');
    var fileName;
    fs.readdir(config.__serverDir+'/modules/', function(err, res)
    {
        if (err) throw (err);

        if(res.length > 0)
        {
            logir('начинаю загрузку :)'.yellow,3);
            res.forEach(function(element)
            {
                var fileName = element.split('.');
                fileName[fileName.length-1] = '';
                fileName = fileName.join('.').slice(0, -1);
                logir('загружаю '.yellow+fileName.yellow,3);
                serviceLocator.register(fileName, require(config.__serverDir+'/modules/'+element));
            });
        }
        else
        {
            logir('не могу найти модули :('.yellow,3);
        }

    })
}
