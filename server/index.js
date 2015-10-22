var serviceLocator = require('./include/serviceLocator')();

// сервер http
serviceLocator.register('http',     require('http'));

// WebSockets модуль
serviceLocator.register('ws',       require('ws'));

// роутинг
//serviceLocator.register('router',   require('node-simple-router'));

// https://nodejs.org/api/url.html
serviceLocator.register('url',      require('url'));

// https://nodejs.org/api/path.html
serviceLocator.register('path',     require('path'));

// модуль цветов для логира
serviceLocator.register('colors',   require('colors'));

// модуль для работы с mongoDB
serviceLocator.register('mongoose', require('mongoose'));

// модуль для работы файловой системой
serviceLocator.register('fs',       require('fs'));

// логир
serviceLocator.register('logir',   require('./include/logir'));

// конфигурационный файл
serviceLocator.register('config',   require('./include/config'));

// модуль пользовательских функций
serviceLocator.register('functions',require('./include/functions')(serviceLocator));

// загрузчик. загружает модули из ./moduls
require('./include/uploader')(serviceLocator, function()
{
    var Functions   = serviceLocator.get('functions');
    var _           = new Functions();
    var logir       = serviceLocator.get('logir')('Индекс');
    logir('начинаю работу'.yellow,3);

    var config  = serviceLocator.get('config');
    logir('порт сервера: '.cyan+config.__serverPort,4);
    logir('порт сокеттов: '.cyan+config.__socketsPort,4);
    logir('БД монго: '.cyan+config.__mongoConnect,4);
    logir('путь к папке public: '.cyan+config.__publicDir,4);
    logir('путь к папке server: '.cyan+config.__serverDir,4);
    logir('уровень логирования: '.cyan+config.__logirLevel,4);
    logir('логи включены: '.cyan+config.__logir,4);

    var HttpServer = serviceLocator.get('httpServer')(serviceLocator);
    var httpServer = new HttpServer();
    httpServer.start();

    var WsServer = serviceLocator.get('wsServer')(serviceLocator);
    var wsServer = new WsServer();
    wsServer.start();
});
