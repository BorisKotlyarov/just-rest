const takeTurns = require('./utils/takeTurns');

module.exports = function (instance, request, response, matched) {

    response.resp = function (data) {

        return takeTurns({
            turn: response._interceptors,
            args: [request, response, matched, data],
            instance
        }).then(() => {
            if(response.finished) return;
            return response.end(JSON.stringify(data));
        });

    };

    response.error = function (statusCode = 500, customMessage = '') {
        let message = customMessage;

        if ('' == customMessage) {
            let http = require('http');
            message = http.STATUS_CODES[statusCode];
        }

        response.statusCode = statusCode;
        response.resp({error: statusCode, message});
    };

};
