class Modules {

    constructor() {

        let defaultProperties = [
            { variableName: 'router', defineFunctionName: 'define'},
            { variableName: 'requestInterceptors', defineFunctionName: 'defineRequestInterceptor'},
            { variableName: 'responseInterceptors', defineFunctionName: 'defineResponseInterceptor'},
        ];

        let defaultValues = {
            GET: {},
            POST: {},
            PUT: {},
            DELETE: {},
            OPTIONS: {}
        };

        defaultProperties.forEach((property)=>{
            this[property.variableName] = JSON.parse(JSON.stringify(defaultValues));

            this[property.defineFunctionName] = (modulePath) => {

                let module = require(modulePath);

                Object.keys(this[property.variableName]).forEach((key) => {
                    if (module.hasOwnProperty(key)) {
                        this[property.variableName][key] = Object.assign(this[property.variableName][key], module[key]);
                    }
                    if (module.hasOwnProperty('ANY')){
                        this[property.variableName][key] = Object.assign(this[property.variableName][key], module['ANY']);
                    }
                });
            }
        });

    }

};

module.exports = new Modules();
