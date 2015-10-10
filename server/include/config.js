function getPath(dirInRoot)
{
    dirInRoot = dirInRoot||'';
    var rootDir =  process.cwd();
    var newPath = rootDir.split('/');
    newPath[newPath.length-1] = dirInRoot;
    return newPath.join('/');
}

module.exports = {
    __serverPort         : 1622,
    __socketsPort        : 1623,
    __mongoConnect: 'mongodb://localhost/caric',
    __publicDir: getPath('public'),
    __serverDir: getPath('server'),
    __rootDir: getPath(),
    __logirLevel: 3,
    __logir: true
}
