## express

  基于node实现的web应用框架，快速开发web应用；其本质通过利用node中的模块，以及扩展服务功能封装了一套node服务框架；支持静态服务，模板解析，路由控制，结合各种中间件实现需求更多扩展功能。

- 中间件

    本质是一个函数，通过将定义的函数进行订阅，在资源请求中根据中间件所属资源路径来进行对发起的请求进行各种处理，可以做到打印日志，传递数据，判断权限等；

    中间分为：功能中间件（主要完成要嵌入功能进行拦截处理），错误中间件（对错误的捕获处理）

    ```js
      // 间版 实现的中间件方法
      app.routes = [];
      app.use = function() {
        let handlers;
        let path;
        let args = Array.prototype.slice.apply(arguments);
        if (typeof args[0] !== 'string') {
          path = '/';
        } else {
          path = args.shift();
        }
        handlers = args;
        handlers.forEach((handler, i) => {
          app.routes.push({
            path,
            method: 'middle',
            handler
          });
        })
      }
      // 日志中间件简版本
      function logger() {
        return function (req, res, next) {
          console.log(req.host, req.method);
        }
      }
      app.use(logger());
    ```

- 路由

    通过建立请求路径，请求方法，处理函数之间的关系，当发起请求匹配对应的路径，对应的方法，最后执行对应处理函数

    ```js
      const http = require('http');
      const express = function () {
        const app = function(req, res) {
          const reqUrl = req.url;
          const method = req.method.toLocaleLowerCase();
          const { pathname } = url.parse(reqUrl);
          let i = 0;
          const next = function (err) {
            if (i >= app.routes.length) {
              return res.end(`CANNOT ${method} ${pathname}`);
            }
            const route = app.routes[i++];
            if (err) {
              if (route.method === 'middle' && route.handler.length === 4) {
                route.handler(req, res, next);
              } else {
                next();
              }
            } else {
              if (route.method === 'middle') {
                if (route.path === pathname || route.path === '/' || pathname.includes(route.path + '/')) {
                  route.handler(req, res, next);
                } else {
                  next();
                }
              } else {
                // 这里针对参数路径处理
                if (route.paramNames) {
                  const pathReg = new RegExp(route.path);
                  let matchers = pathname.match(pathReg);
                  if (matchers) {
                    const params = {};
                    for(let i=0;i<route.paramNames.length;i++){
                        params[route.paramNames[i]] = matchers[i+1];
                    }
                    req.params = params;
                    route.handler(req,res);
                  }else{
                      next();
                  }
                } else {
                  if ((route.path === pathname || route.path == "*") && (route.method === method) || method === 'all') {
                    return route.handler(req, res);
                  } else {
                      next();
                  }
                }
              }
            }
          }
          next();
        }
        app.listen = function() {
          const server = http.createServer(app);
          server.listen(...arguments);
        }
        return app;
      }
      const app = express();

      // 定义方法
      http.METHODS.forEach((method) => {
        method = method.toLocaleLowerCase();
        app[method] = function(path, handler){
          const route = {
            path,
            method,
            handler
          };
          if (path.includes(':')) {
            let paramNames = [];
            route.path = path.replace(/:([^\/]+)/g, function () {
              paramNames.push(arguments[1]);
              return '([^\/]+)';
            });
            route.paramNames = paramNames;
          }
          app.routes.push(route);
        }
      })
      app.get('/p', function(req, res){})
    ```

- 模板解析

    通过将模板列表中读取配置了的模板，利用模板解析库来完成解析

    ```js
      res.render = function (name, data) {
          var viewEngine = engine.viewEngineList[engine.viewType];
          if (viewEngine) {
              viewEngine(path.join(engine.viewsPath, name + '.' + engine.viewType), data, function (err, data) {
                  if (err) {
                      res.status(500).sendHeader().send('view engine failure' + err);
                  } else {
                      res.status(200).contentType('text/html').sendHeader().send(data);
                  }
              });
          } else {
              res.status(500).sendHeader().send('view engine failure');
          }
      }
    ```

- 静态服务

    静态服务针对一些静态资源(css,js,image)等，在发起请求这些资源的时候指定到指定位置读取内容响应给客户端

    ```js
      express.static = function (p) {
        return function (req, res, next) {
          const staticPath = path.join(p, req.path);
          var exists = fs.existsSync(staticPath);
          if (exists) {
              res.sendFile(staticPath);
          } else {
              next();
          }
        }
      }
      app.use(express.static(path.join(__dirname,'public')))
    ```


- 其他

  - send方法

    ```js
      res.send = function(msg){
          let type = typeof msg;
          if(type == 'object'){
              res.setHeader('Content-Type','application/json');
              msg = JSON.stringify(msg);
          }else if(type == 'number'){
              res.setHeader('Content-Type','application/plain');
              res.status(msg);
              res.end(http.STATUS_CODES[msg]);
          }else{
              res.setHeader('Content-Type','application/html');
              res.end(msg);
          }
      }
    ```

  - bodyParser

    ```js
      function bodyParser () {
        return function (req,res,next) {
          var result = '';
          req.on('data', function (data) {
              result+=data;
          });
          req.on('end', function () {
              try{
                req.body = JSON.parse(result);
              }catch(e){
                req.body = require('querystring').parse(result);
              }
              next();
          })
        }
      };
    ```

  - 重定向

    通过设置头标识Location来实现跳转

    ```js
      res.redirect = function (url) {
        res.status(302);
        res.headers('Location', url || '/');
        res.sendHeader();
        res.end();
      };
    ```


- 简版实现代码

  ```js
    const http = require('http');
    const url = require('url');
    const express = function() {
      const app = function(req, res) {
        const reqUrl = req.url;
        const method = req.method.toLocaleLowerCase();
        const { pathname } = url.parse(reqUrl);
        let i = 0;
        const next = function (err) {
          if (i >= app.routes.length) {
            return res.end(`CANNOT ${method} ${pathname}`);
          }
          const route = app.routes[i++];
          if (err) {
            if (route.method === 'middle' && route.handler.length === 4) {
              route.handler(err, req, res, next);
            } else {
              next(err);
            }
          } else {
            if (route.method === 'middle') {
              if (route.path === pathname || route.path === '/' || pathname.includes(route.path + '/')) {
                route.handler(req, res, next);
              } else {
                next();
              }
            } else {
              if (route.paramNames) {
                const pathReg = new RegExp(route.path);
                let matchers = pathname.match(pathReg);
                if (matchers) {
                  const params = {};
                  for(let i=0;i<route.paramNames.length;i++){
                      params[route.paramNames[i]] = matchers[i+1];
                  }
                  req.params = params;
                  route.handler(req,res);
                }else{
                    next();
                }
              } else {
                if ((route.path === pathname || route.path == "*") && (route.method === method) || method === 'all') {
                  return route.handler(req, res);
                } else {
                    next();
                }
              }
            }
          }
        }
        next();
      };
      app.routes = [];
      app.use = function() {
        let handlers;
        let path;
        let args = Array.prototype.slice.apply(arguments);
        if (typeof args[0] !== 'string') {
          path = '/';
        } else {
          path = args.shift();
        }
        handlers = args;
        handlers.forEach((handler, i) => {
          app.routes.push({
            path,
            method: 'middle',
            handler
          });
        })
      }
      http.METHODS.forEach((method) => {
        method = method.toLocaleLowerCase();
        app[method] = function(path, handler){
          const route = {
            path,
            method,
            handler
          };
          if (path.includes(':')) {
            let paramNames = [];
            route.path = path.replace(/:([^\/]+)/g, function () {
              paramNames.push(arguments[1]);
              return '([^\/]+)';
            });
            route.paramNames = paramNames;
          }
          app.routes.push(route);
        }
      })
      app.listen = function() {
        const server = http.createServer(app);
        server.listen(...arguments);
      }
      return app;
    }

    const app = express();
    app.use(function(){});
    app.listen(8080, '127.0.01', function(){})
  ```