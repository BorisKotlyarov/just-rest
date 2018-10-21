const takeTurns = require('./utils/takeTurns');

const requestPrototype = {

    get body() {

        return new Promise((resolve, reject) => {
            let body = [];

            this.on('error', error => {
                reject(error);
            })
                .on('data', chunk => {
                    body.push(chunk);
                })
                .on('end', () => {
                    body = Buffer.concat(body).toString();

                    if (body == '') {
                        resolve(body);
                    }

                    switch (this.headers['content-type']) {

                        case "application/json":
                            try {
                                resolve(JSONBodyParser(body, this));
                            } catch (error) {
                                reject(error);
                            }
                            break;

                        default:
                            reject("Incorrect request. Content-type 'application/json' expected.");
                    }

                });
        });

    },

    get query() {
        let url = require('url');
        let url_parts = url.parse(this.url, true);
        return url_parts.query
    }
};

function JSONBodyParser(body, messageRequest) {
    try {
        return messageRequest.body = JSON.parse(body);
    }
    catch (error) {
        throw error;
    }
}

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