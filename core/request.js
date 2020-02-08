const takeTurns = require('./utils/takeTurns');

const requestPrototype = {
    get query() {
        let url = require('url');
        let url_parts = url.parse(this.url, true);

        const {query} = url_parts;
        const result = {};
        Object.keys(query).forEach((key) => {

            let regExp = new RegExp('^(.+?)\\[(.+?)?\\]$');
            let match = key.match(regExp);

            if (match) {
                let parentKeyName = match[1];
                let childKeyName = match[2];

                if (childKeyName) {
                    if (result.hasOwnProperty(parentKeyName)) {
                        result[parentKeyName] = {...result[parentKeyName], [childKeyName]: query[key]};
                    } else {
                        result[parentKeyName] = {[childKeyName]: query[key]};
                    }
                    return
                } else {
                    result[parentKeyName] = query[key];
                    return
                }
            }
            result[key] = query[key];
        });

        return result;
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
