var serviceLocator = require('./include/serviceLocator')();

// сервер http
serviceLocator.register('http',     require('http'));
// WebSockets модуль
serviceLocator.register('ws',       require('ws'));
// роутинг
serviceLocator.register('router',   require('node-simple-router'));
//
serviceLocator.register('url',      require('url'));
//
serviceLocator.register('path',     require('path'));
// модуль цветов для логира
serviceLocator.register('colors',   require('colors'));
// модуль для работы с mongoDB
serviceLocator.register('mongoose', require('mongoose'));
// модуль для работы файловой системой
serviceLocator.register('fs',       require('fs'));
// конфигурационный файл
serviceLocator.register('config',   require('./include/config'));
// модуль пользовательских функций
serviceLocator.register('functions',require('./include/functions')(serviceLocator));
// загрузчик. загружает модули из ./moduls
require('./include/uploader')(serviceLocator, function()
{

    var logir   = serviceLocator.get('functions').logir('Индекс');
    logir('начинаю работу'.yellow,3);

    var config  = serviceLocator.get('config');
    logir('порт сервера: '.cyan+config.__serverPort,4);
    logir('порт сокеттов: '.cyan+config.__socketsPort,4);
    logir('БД монго: '.cyan+config.__mongoConnect,4);
    logir('путь к папке public: '.cyan+config.__publicDir,4);
    logir('путь к папке server: '.cyan+config.__serverDir,4);
    logir('уровень логирования: '.cyan+config.__logirLevel,4);
    logir('логи включены: '.cyan+config.__logir,4);


    //require('./server.js')(serviceLocator);

    var httpServer = serviceLocator.get('httpServer')(serviceLocator);
    httpServer.start();

    var wsServer = serviceLocator.get('wsServer')(serviceLocator);
    wsServer.start();
});
