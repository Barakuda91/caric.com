module.exports = function(serviceLocator)
{
    var colors  = serviceLocator.get('colors');
    var config  = serviceLocator.get('config');

    return {
        logir: function(text, level)
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
                        case 1:type = '('+'Ошибка  '.red+') ';      break;
                        case 2:type = '('+'Внимание'.yellow+') ';   break;
                        case 3:type = '('+'Лог     '.blue+') ';     break;
                    }
                    console.log(type+text);
                }
            }else{return false;}
        }
    }
}
