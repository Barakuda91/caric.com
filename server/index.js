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
serviceLocator.register('uploader', require('./include/uploader')(serviceLocator));



require('./server.js')(serviceLocator);
