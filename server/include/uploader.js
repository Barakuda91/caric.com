module.exports = function(serviceLocator, callback)
{
    var fs          = serviceLocator.get('fs');
    var config      = serviceLocator.get('config');
    var Functions   = serviceLocator.get('functions');
    var funck       = new Functions();
    var logir       = serviceLocator.get('logir')('Загрузчик');
    var colors      = serviceLocator.get('colors');
    var fileName;
    
    fs.readdir(config.__serverDir+'/modules/', function(err, res)
    {
        if (err) throw (err);

        if(res.length > 0)
        {
            logir('начинаю загрузку :)'.yellow,3);
            var modulesCount = res.length;
            res.forEach(function(element)
            {
                var fileName = element.split('.');
                fileName[fileName.length-1] = '';
                fileName = fileName.join('.').slice(0, -1);
                logir('загружаю '.yellow+fileName.yellow,3);
                serviceLocator.register(fileName, require(config.__serverDir+'/modules/'+element));
                modulesCount--;
                if(modulesCount <= 0)
                    callback();
            });
        }
        else
        {
            logir('не могу найти модули :('.yellow,3);
        }

    })
}
