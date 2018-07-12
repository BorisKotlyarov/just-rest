# Just Rest #
sample REST server

## Use

1) Make module
    ```javascript
    module.exports = {
    
        GET: {
            '/process-info': function(request, response){
                response.resp(process.env);
            }
        }
    
    };
    ```
    save module as `./modules/process-info/index.js`

2) Connect the module in your app
    ```javascript
    const {Modules, Server} = require('just-rest');
    
    Modules.define('./modules/process-info/index.js');
    
    new Server({Modules, port: 3001});
    ```
    Run app
3) Open url `http://localhost:3001/process-info`
