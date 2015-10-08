module.exports = function(serviceLocator)
{
    var fs      = serviceLocator.get('fs');
    var rootDir = serviceLocator.get('config').__dir;
    var logir   = serviceLocator.get('functions').logir;
    var colors  = serviceLocator.get('colors');
    var name    = 'Загрузчик: ';

    fs.readdir(rootDir+'/modules/', function(err, res)
    {
        if (err) throw (err);

        if(res.length > 0)
        {
            logir(name.green+' начинаю загрузку :)'.yellow,3);
            res.forEach(function(element)
            {
                logir(name.green+' загружаю '.yellow+element.yellow,3);
            });
        }
        else
        {
            logir(name.green+' не могу найти модули :('.yellow,3);
        }

    })
}
