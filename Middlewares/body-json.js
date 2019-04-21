const Errors = require('../core/Errors');

module.exports = function (request, response, match) {

    return new Promise((resolve, reject) => {
        let body = [];

        if(request.headers['content-type']!='application/json'){
            resolve()
            return;
        }

        request.on('error', error => {
            reject(error);
        });

        request.on('data', chunk => {
            body.push(chunk);
        });

        request.on('end', () => {
            request.body = Buffer.concat(body).toString();

            if (request.body == '') {
                resolve(this.body);
            }

            try {
                request.body = JSON.parse(request.body)
                resolve(request.body);
            } catch (error) {
                reject(new Errors(400, `JSON syntax error`))
            }

        });
    });
};
