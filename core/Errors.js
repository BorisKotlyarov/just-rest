const {STATUS_CODES} = require('http');

class Errors extends Error {
    constructor(statusCode = 500, message=null){
        super();
        this.statusCode = statusCode;
        this.message = message && message!='' ? message:STATUS_CODES[statusCode];
    }
}

module.exports = Errors;
