# Just REST #
«Just REST» is the NPM package that will help you make simple REST server.
See [Example app](https://github.com/BorisKotlyarov/just-rest-example)

## Install

```bash 
npm i just-rest
```

## Use

1) Make module
    ```javascript
    module.exports = {
    
        GET: {
           '/process-info': function(request, response){
               //http://localhost:3002/process-info
               response.resp(process.env);
           },
           
           '/process-info/([0-9]{1,})': function(request, response, matched){
               //http://localhost:3002/process-info/1234
               response.resp(matched);
           },
           
           '/process-info/error': function(request, response){
               //http://localhost:3002/process-info/error
               throw new Error('Internal Server Error');
               response.resp({});
           },
           
           '/process-info/error-401': function(request, response){
               //http://localhost:3002/process-info/error-401
               response.error(401);
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

2) Make interceptor
    ```javascript
    module.exports = {
        ANY: { //All supported request types «GET, POST, PUT, DELETE, OPTIONS»
            '/(.+?)': function(response){
    
                const CorsAllowHeaders = {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Set-Cookies, Access-Token'
                };
    
                Object.keys(CorsAllowHeaders).forEach((item) => {
                    response.setHeader(item, CorsAllowHeaders[item]);
                });
            }
        }
    };
    ```
    save interceptor as `./interceptors/response/corsAllowHeaders.js`

2) Connect modules and interceptors to your app
    ```javascript
    const {Modules, Server} = require('just-rest');
    
    Modules.defineResponseInterceptor(__dirname + '/interceptors/response/corsAllowHeaders.js');
    Modules.define(__dirmane + '/modules/process-info/index.js');
    
    new Server({Modules, port: 3002});
    ```
    Run app
3) Open url `http://localhost:3002/process-info`
