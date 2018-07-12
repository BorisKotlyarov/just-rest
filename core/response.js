const CorsAllowHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Set-Cookies, Access-Token'
};

function setHeaders(response) {
    Object.keys(CorsAllowHeaders).forEach((item) => {
        response.setHeader(item, CorsAllowHeaders[item]);
    });
}

module.exports = function (response) {

    response.resp = function (data) {
        setHeaders(response);
        response.end(JSON.stringify(data));
    };

    response.error = function (statusCode, customMessage='') {
        let message = customMessage;

        if('' != customMessage) {
            let http = require('http');
            message = http.STATUS_CODES[statusCode];
        }

        response.statusCode = statusCode;
        response.resp({error: statusCode, message});
    };

};