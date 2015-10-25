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
        'router.json',
        'css/index.css',
        'js/index.js',
        'templates/404.html',
        'moduls/index/pages/index.html'
    ],
    __startServerNoDependentFile: false,
    __default: {
        router: publicDir+'/router.json',
        page404: publicDir+'/templates/404.html',
    }
}
