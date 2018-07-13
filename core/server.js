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

        request._interceptors = [];
        response._interceptors = [];

        let urlParse = URL.parse(request.url);
        let router = this.Modules.router[request.method];
        let requestInterceptors = this.Modules.requestInterceptors[request.method];
        let responseInterceptors = this.Modules.responseInterceptors[request.method];
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

        Object.keys(requestInterceptors).forEach((path) => {
            let regExp = new RegExp(`^${path}$`);
            if (urlParse.pathname.match(regExp)) {
                request._interceptors.push(requestInterceptors[path]);
            }
        });

        Object.keys(responseInterceptors).forEach((path) => {
            let regExp = new RegExp(`^${path}$`);
            if (urlParse.pathname.match(regExp)) {
                response._interceptors.push(responseInterceptors[path]);
            }
        });

        setRequest(request);
        setResponse(response);

        if (hasRoute) {
            try {
                this.Modules.router[request.method][findRoute](request, response, matched);
            } catch (error) {
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