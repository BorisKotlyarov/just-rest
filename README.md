# Just Rest #
sample REST server
[Example app](https://github.com/BorisKotlyarov/just-rest-example)

## Use

1) Make module
    ```javascript
    module.exports = {
    
        GET: {
            '/process-info': function(request, response){
                response.resp(process.env);
            }
        },
     
        POST: {
            '/process-info': async function(request, response){
                let body = await request.body;
                response.resp(body);
            }
        }, 
    };
    ```
    save module as `./modules/process-info/index.js`

2) Connect the module in your app
    ```javascript
    const {Modules, Server} = require('just-rest');
    
    Modules.define(__dirmane + './modules/process-info/index.js');
    
    new Server({Modules, port: 3002});
    ```
    Run app
3) Open url `http://localhost:3002/process-info`
