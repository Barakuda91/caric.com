module.exports = function(serviceLocator)
{
    var colors  = serviceLocator.get('colors');
    var config  = serviceLocator.get('config');

    // вынести логир отдельным под приложением, и залить на гит
    return {
        logir: function(name)
        {
            return function(text, level)
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
                    }
                }else{return false;}
            }
        }
    }
}
