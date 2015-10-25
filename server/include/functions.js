module.exports = function(serviceLocator)
{
    var logir   = serviceLocator.get('logir')('Functions');
    var fs      = serviceLocator.get('fs');

    // вынести логир отдельным под приложением, и залить на гит
    return function()
    {
        this.clearEmpty = function(arr)
        {
            if(typeof arr !== 'object') return false;
            var newArr = [];
            arr.forEach(function(element)
            {
                if(element !== '')
                    newArr.push(element);
            });
            return newArr;
        };
        this.queryParse = function(str)
        {
            if(typeof str !== 'string') return false;
            var newArr = [];
            var _this = this;
            var queryParsed = str.split('&');
            queryParsed.forEach(function(element)
            {
                var parsedElement = element.split('=');
                newArr.push({k: parsedElement[0], v: parsedElement[1]});
            });
            return newArr;
        };
        this.isFileExist = function(path, callback)
        {
            fs.stat(path, function(err, stats)
            {
                if(err)
                {
                    if(err.errno-2) callback(false);
                }
                else
                {
                    callback(stats.isFile())
                }
            })
        }
    }
}
