function takeTurns({turn = [], args = [], instance}) {
    let index = 0;
    let response = [];

    return new Promise((resolve, reject) => {

        let process = async function () {

            if (index < turn.length) {
                try {
                    let doing = await turn[index++].call(instance, ...args);

                    response.push(doing);

                    process();
                } catch (error) {
                    reject(error);
                }

            } else {
                resolve(response);
            }
        }

        process();

    });
}

module.exports = takeTurns;
