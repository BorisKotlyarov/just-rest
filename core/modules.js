class Modules {

    constructor() {

        let defaultProperties = [
            {variableName: 'router', defineFunctionName: 'define'},
            {variableName: 'requestInterceptors', defineFunctionName: 'defineRequestInterceptor'},
            {variableName: 'responseInterceptors', defineFunctionName: 'defineResponseInterceptor'},
        ];

        let defaultValues = {
            GET: {},
            POST: {},
            PUT: {},
            DELETE: {},
            OPTIONS: {}
        };

        this.middlewares = [];

        defaultProperties.forEach((property) => {
            this[property.variableName] = JSON.parse(JSON.stringify(defaultValues));

            this[property.defineFunctionName] = (mod) => {
                let module = {};
                switch (typeof mod) {
                    case 'object':
                        module = mod;
                        break;

                    default:
                        module = require.main.require(mod);
                }

                for (let key in this[property.variableName]) {
                    if (!module.hasOwnProperty(key) && !module.hasOwnProperty('ANY')) {
                        continue;
                    }
                    this[property.variableName][key] = Object.assign(this[property.variableName][key], module[key] || module['ANY']);
                }
            }

        });

    }

    defineGlobalMiddleware(middleware) {

        switch (typeof middleware) {
            case 'function':
                this.middlewares.push(middleware);
                break;

            default:
                this.middlewares.push(require.main.require(middleware));
        }

    }

};

module.exports = new Modules();
