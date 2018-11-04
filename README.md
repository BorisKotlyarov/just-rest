# Just REST #
«Just REST» is the NPM package that will help you make simple REST server.

## Table of contents ##
- [Install](#install)
- [Use](#use)
- [Props](#props)
    - [Use props](#use-props)
    - [Make props](#make-props)
- [Examples](#examples)
    - [Example app](https://github.com/BorisKotlyarov/just-rest-example)
    - [Example interceptor (external module)](https://github.com/BorisKotlyarov/just-rest-cookies)
    - [Use middleware](#middleware)
    - [Set url path](#set-url-path)


## Install ##

```bash 
npm i just-rest --save
```

## Use ##

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
                let body = request.body;
                response.resp(body);
            }
        }, 
    };
    ```
    save module as `./modules/process-info/index.js`

2) Make interceptor
    ```javascript
    module.exports = {
        ANY: { //All supported methods «GET, POST, PUT, DELETE, OPTIONS»
            '(.+?)': function(response){
    
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
    const {Modules, Server, Middlewares} = require('just-rest');
    
    Modules.defineResponseInterceptor('./interceptors/response/corsAllowHeaders.js');
    Modules.defineGlobalMiddleware(Middlewares.bodyJson); // body parser
 
    Modules.define('./modules/process-info/index.js');
    
    new Server({Modules, port: 3002});
    ```
    Run app
3) Open url `http://localhost:3002/process-info`

## Props ##

Props is any variable 

### Make props ##
```javascript
    const {Modules, Server} = require('just-rest');
    
    Modules.define('./modules/use-props/index.js');
   
    let props = {
        test: '123456qwerty',
        date: new Date(),
        func: function(){
            console.log(`cool`)
        }
    };
    
    new Server({Modules, port: 3002, props });
```

### Use props ###

make file: `./modules/use-props/index.js`
```javascript
module.exports = {

    GET: {
       '/use-props': function(request, response){
           //http://localhost:3002/use-props
           
           this.props.func();
           console.log(this.props.date);
           console.log(this.props.test);
           
           response.resp({});
       }
    }
};
```

## Examples ##

### Middleware ###

Use middleware in your module 
```javascript
const {Errors} = require('just-rest');

function user(request, response, match){
    let instance = this;

    //TODO get data from real database

    instance.user = {
        username: 'Guest',
        permissions: [],
        isAuthorized: false
    };

    let testDatabase = {
        'token1': {
            username: 'Boris',
            permissions: ['all'],
            isAuthorized: true
        },
        'token2': {
            username: 'User 2',
            permissions: ['read.me'],
            isAuthorized: true
        },
        'token3': {
            username: 'User 3',
            permissions: ['read.something'],
            isAuthorized: true
        },
    }

    if (request.headers.token && testDatabase.hasOwnProperty(request.headers.token)) {
        instance.user = testDatabase[request.headers.token];
    }

    return;
}

function isAuthorized() {
    if (!this.user.isAuthorized) {
        throw  new Errors(401)
    }
    return;
}

function readPermission() {
    if (!this.user.permissions.includes('read.me') && !this.user.permissions.includes('all')) {
        throw  new Errors(403)
    }
    return;
}

function controller(request, response, matched) {
    response.resp(this.user);
}

module.exports = {
    GET: {
        //use http://localhost:3002/profile/me
        '/profile/me': [
            user, // Using middleware. add user variable to instance
            isAuthorized, // Using middleware. check authorize
            readPermission, // Using middleware. check read permissions
            controller
        ]
    }
};

```

### Set url path ###

Static url path
```javascript
module.exports = {
    GET: {
        '/your-url-path-here': function (request, response) {
            //http://localhost:3002/your-url-path-here
            response.resp({success: 'ok'});
        }
    }
};
```

"Just Rest" supports RegExp expressions.
Dynamics url path using RegExp
```javascript
module.exports = {
    GET: {
        //([0-9]{1,}) = Any number 
        '/user/([0-9]{1,})': function (request, response, matched) {
            //http://localhost:3002/user/1
            let userId = matched[1];
            response.resp({userId});
        }
    }
};
```
