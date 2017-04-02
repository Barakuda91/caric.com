const colors = require('colors');
module.exports = class Loger{
    constructor (name, level) {
        this.name = name;
        this.messageLevel = level || 3;
        this.gefaultLevel = 3;
        this.time = true;
    }
    log (message, level) {
        level = level || this.gefaultLevel;
        if( level <= this.messageLevel) {
            let type = ' ';
            let time = '';
            let name = this.name.cyan;

            switch (level) {
                case 3:
                    type = '[info] '.green;
                break;
                case 2:
                    type = '[warn] '.yellow;
                break;
                case 1:
                    name = this.name.red;
                    type = '[error] '.red;
                break;
            }

            if ( this.time ) {
                time = this.getTime().red;
            }

            console.log(type + time + name + ': ' + message);
        }
    }

    /**
     * You can change the timeout setting
     * @param value (boolean)
     */
    setTimeWrite ( value ) {
        this.time = value;
    }
    getTime () {
        let time = new Date();
        return '[' + time.getHours() + ':' + time.getMinutes() + ' ' + time.getMilliseconds() + '] ';
    }
    setLevel (level) {
        this.messageLevel = level;
    }
    setDefaultLevel (level) {
        this.gefaultLevel = level;
    }
}