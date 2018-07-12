const Modules                   = require('./core/modules');
const Server                    = require('./core/server');

module.exports = {
    Modules,
    Server
};
/*
Modules.define('main');
Modules.define('info');
Modules.define('cmd');

new Server({Modules, port: process.env.PORT || 8080});*/
