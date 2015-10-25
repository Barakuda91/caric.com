function getPath(dirInRoot)
{
    dirInRoot = dirInRoot||'';
    var rootDir =  process.cwd();
    var newPath = rootDir.split('/');
    newPath[newPath.length-1] = dirInRoot;
    return newPath.join('/');
}

var publicDir   = getPath('public');
var serverDir   = getPath('server');
var rootDir     = getPath();

// сделать хранение нектоторой конфигурационной информации в базе данных
module.exports = {
    __serverPort         : 1622,
    __socketsPort        : 1623,
    __mongoConnect: 'mongodb://localhost/caric',
    __publicDir: publicDir,
    __serverDir: serverDir,
    __rootDir: rootDir,
    __logirLevel: 4,
    __logir: true,
    __importentFiles: [
        'public/router.json',
        'public/css/index.css',
        'public/js/index.js',
        'public/templates/404.html',
        'public/moduls/index/pages/index.html',
        'server/include/htmltemplate.html'
    ],
    __startServerNoDependentFile: false,
    __default: {
        router: publicDir+'/router.json',
        pathToRouter: '',
        page404: publicDir+'/templates/404.html',
        htmlTemplate: serverDir+'/include/htmltemplate.html'
    }
}
