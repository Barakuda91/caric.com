module.exports = function(name)
{
    var colors  = require('colors');
    var config  = require('./config');

    return function(text, level, obj)
    {
        level = level || 3;
        // если логи включены
        if(config.__logir)
        {
            if(level <= config.__logirLevel)
            {
                var type;
                switch (level)
                {
                    // вывод ошибок
                    case 1:type = '('+'Ошибка  '.red+') ';      break;

                    // предупреждения
                    case 2:type = '('+'Внимание'.yellow+') ';   break;

                    // логирование действий
                    case 3:type = '('+'Лог     '.blue+') ';     break;

                    // информационное логирование
                    // значения переменных и так далее
                    case 4:type = '('+'Инфо    '.magenta+') ';  break;
                }
                console.log(type+name.green+': '+text);
                if(typeof obj === 'object') console.log(obj);
            }
        }else{return false;}
    }
}
