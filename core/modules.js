class Modules {

    constructor() {
        this.router = {
            GET     : {},
            POST    : {},
            PUT     : {},
            DELETE  : {},
            OPTIONS : {}
        };
    }

    define(modulePath){

        let module = require(modulePath);

        Object.keys(this.router).forEach((key) => {
            if(module.hasOwnProperty(key)){
                this.router[key] = Object.assign(this.router[key], module[key]);
            }
        });
    }

};

module.exports = new Modules();
