module.exports = function(serviceLocator)
{
    var ws      = serviceLocator.get('ws');
    var fs      = serviceLocator.get('fs');
    var config  = serviceLocator.get('config');
    var Functions   = serviceLocator.get('functions');
    var funck       = new Functions();
    var logir       = serviceLocator.get('logir')('ws cервер');

    return  function()
    {
        this.start = function()
        {
            logir('запустился на порту '.yellow+config.__socketsPort,3);
        }
    }



}
