function takeTurns({turn = [], args = [], instance}) {
    let index = 0;
    let response = [];

    return new Promise((resolve) => {

        let process = function () {

            if (index < turn.length) {
                let doing = turn[index++].call(instance, ...args);

                if (!doing || typeof doing.then !== 'function') {
                    doing = Promise.resolve(doing);
                }

                return doing.then((_response) => {
                    if (_response) {
                        response.push(_response);
                    }
                    return _response;
                }).then(process);

            } else {
                resolve(response);
            }
        }

        process();
    });
}

module.exports = takeTurns;
