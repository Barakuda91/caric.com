module.exports = function(serviceLocator)
{
    var ws      = serviceLocator.get('ws');
    var fs      = serviceLocator.get('fs');
    var config  = serviceLocator.get('config');
    var logir   = serviceLocator.get('functions').logir('ws cервер');

    return {
        start: function()
        {

            logir('запустился на порту '.yellow+config.__socketsPort,3);

        }

    }



}
