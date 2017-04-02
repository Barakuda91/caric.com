const Loger = require('./loger');
const loger = new Loger('Helper');
const spawn = require('child_process').spawn;
/*
 * Helper error code 10****
 */
class Helper {
    static errorHandler(err)
    {
        if(err) {
            loger.log(err.code);
        }
    }
}

module.exports = Helper;