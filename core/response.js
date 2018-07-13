module.exports = function (response) {

    response.resp = function (data) {

        response._interceptors.forEach((interceptor)=>{
            interceptor(response)
        });

        response.end(JSON.stringify(data));
    };

    response.error = function (statusCode, customMessage = '') {
        let message = customMessage;

        if ('' == customMessage) {
            let http = require('http');
            message = http.STATUS_CODES[statusCode];
        }

        response.statusCode = statusCode;
        response.resp({error: statusCode, message});
    };

};