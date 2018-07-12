let http = require('http');
const URL = require('url');
const setRequest = require('./request');
const setResponse = require('./response');

class Server {

    constructor({Modules, port}) {
        this.Modules = Modules;
        this.port = port;
        this.serve();
    }

    app(request, response) {

        setRequest(request);
        setResponse(response);
        let urlParse = URL.parse(request.url);
        let router = this.Modules.router[request.method];
        let hasRoute = false;
        let findRoute = '/';
        let matched = null;

        Object.keys(router).forEach((path) => {
            let regExp = new RegExp(`^${path}$`);

            if (urlParse.pathname.match(regExp)) {
                hasRoute = true;
                findRoute = path;
                matched = urlParse.pathname.match(regExp);
            }

        });

        if (hasRoute) {
            try {
                this.Modules.router[request.method][findRoute](request, response, matched);
            } catch (error){
                console.error(error);
                response.error(500, error.message);
            }
        } else {
            request.addListener('end', function () {
                response.error(404, 'Not Found');
            }).resume();
        }

    }

    serve() {
        http.createServer(this.app.bind(this)).listen(this.port);
        console.log(`server listening on http://localhost:${this.port}, Ctrl+C to stop`);
    }

}

module.exports = Server;