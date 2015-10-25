var fs = require('fs');
fs.readFile('/home/alex/Work/caric.com/public/moduls/index/router.json', function(err, file)
{
    if(err)
    {
        if(err.errno = -2)
            console.log('Файл не найден');
    }else {
        try {
            var json = JSON.parse(file.toString());

            console.log(json.js);
        } catch (err) {
            console.log(err);
        }

    }
});
