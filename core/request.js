const takeTurns = require('./utils/takeTurns');

const requestPrototype = {
    get query() {
        let url = require('url');
        let url_parts = url.parse(this.url, true);
        return url_parts.query
    }
};

module.exports = function (instance, request, response, matched) {
    Object.getOwnPropertyNames(requestPrototype).forEach(function (propertyName) {
        Object.defineProperty(request.__proto__, propertyName, Object.getOwnPropertyDescriptor(requestPrototype, propertyName));
    });

    return takeTurns({
        turn: request._interceptors,
        args: [request, response, matched],
        instance
    })
};
