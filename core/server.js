let http = require('http');
const URL = require('url');
const takeTurns = require('./utils/takeTurns');
const setRequest = require('./request');
const setResponse = require('./response');

class Server {

    constructor({Modules, port, props = {}, autoStart = true}) {
        this.Modules = Modules;
        this.port = port;
        this.props = props;
        if (autoStart) {
            this.listen();
        }
    }

    async app(request, response) {

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
            let regExp = new RegExp(`^${path}(/)?$`, 'i');

            if (urlParse.pathname.match(regExp)) {
                hasRoute = true;
                findRoute = path;
                matched = urlParse.pathname.match(regExp);
            }

        });

        Object.keys(requestInterceptors).forEach((path) => {
            let regExp = new RegExp(`^${path}(/)?$`, 'i');
            if (urlParse.pathname.match(regExp)) {
                request._interceptors.push(requestInterceptors[path]);
            }
        });

        Object.keys(responseInterceptors).forEach((path) => {
            let regExp = new RegExp(`^${path}(\/)?$`, 'i');
            if (urlParse.pathname.match(regExp)) {
                response._interceptors.push(responseInterceptors[path]);
            }
        });

        await setRequest(this, request, response, matched);
        await setResponse(this, request, response, matched);

        if (hasRoute) {
            try {
                let turn = [];
                if (Array.isArray(this.Modules.router[request.method][findRoute])) {
                    turn = this.Modules.middlewares.concat(this.Modules.router[request.method][findRoute]);
                } else {
                    turn = [...this.Modules.middlewares, this.Modules.router[request.method][findRoute]];
                }

                return takeTurns({
                    turn,
                    args: [request, response, matched],
                    instance: this
                }).catch((error) => {
                    response.error(error.statusCode || 500, error.message);
                });

            } catch (error) {
                response.error(error.statusCode || 500, error.message);
            }
        } else {
            request.addListener('end', function () {
                response.error(404, 'Not Found');
            }).resume();
        }
    }

    listen() {
        http.createServer(this.app.bind(this)).listen(this.port);
        console.log(`server listening on http://localhost:${this.port}, Ctrl+C to stop`);
    }

}

module.exports = Server;
