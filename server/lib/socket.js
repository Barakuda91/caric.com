class Socket {
    constructor (includer) {
        const Loger     = includer.get('Loger');
        const config    = includer.get('config');
        this.WebSocket  = includer.get('ws');
        this.loger      = new Loger('Socket');
        this.ws         = null;
        const wss       = new this.WebSocket.Server({ port: config.get('mailSocketPort')});
        let THIS           = this;

        wss.on('connection', function connection(ws) {
            THIS.ws = ws;
            THIS.ws.on('message', (message) => {
                let data = JSON.parse(message);
                THIS.executeRequestMethod(data.method, data.data);
                THIS.loger.log('received: ', data.method);
            });
        });
    }
    /**/
    executeRequestMethod (method, data) {
        let THIS           = this;
        if (THIS[method]) {
            THIS[method](data, (data) => {
                THIS.ws.send(JSON.stringify({
                    method,
                    data
                }));
            });
        } else {
            THIS.ws.send(JSON.stringify({
                method,
                data: {type: 'error', mess: 'There is no such method'}
            }));
        }
    }
}

module.exports = Socket;