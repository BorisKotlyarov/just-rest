let http                        = require('http');
const URL                       = require('url');
const setRequest                = require('./request');
const setResponse               = require('./response');

class Server {

    constructor({Modules, port}) {
        this.Modules    = Modules;
        this.port       = port;
        this.serve();
    }

    app(request, response) {
        
        setRequest(request);
        setResponse(response);
        let urlParse  = URL.parse(request.url);

        if(this.Modules.router[request.method].hasOwnProperty(urlParse.pathname)) {
            this.Modules.router[request.method][urlParse.pathname](request, response);
        } else {
            request.addListener('end', function () {
                response.resp({error: '404'});
            }).resume();
        }

    }

    serve(){
        http.createServer(this.app.bind(this)).listen(this.port);
        console.log(`server listening on http://localhost:${this.port}, Ctrl+C to stop`);
    }

}

module.exports = Server;