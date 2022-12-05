## koa
- koa是一款基于nodejs的开发的轻量级MVC框架，提供了简单的操作

- koa与express相同点，都是基于nodejs为基础的开发框架；不同点koa更加轻量，只提供了一些nodejs服务封装，不集成其他中间件，语法基于高级版本的es6语法，处理异步通过await/async编程方式来完成编写；express js语法为es5,处理异步通过回调函数方式完成，内部集成了一些中间件，集成了路由，模板处理；

   - 基于nodejs为主进行封装方法

   - 结构更清晰化，中间件功能独立化，框架更加轻

   - 内部集成了promise处理中间件流程方式，更好的结合了es6语法async,await


## koa分解

context, request, response,每一次服务器访问均生产新的对象，防止共享导致问题；通过当前实例的context来访问内部方法对象

- application

应用实例，主要对外提供给开发的主入口；提供挂载中间件方法，use,提供监听函数listen

- request

包装koa下request对象下请求可访问的属性器，request内部模块提供了对各方法对头信息，内容类型等http信息进行设置

- response
包装了koa下response对象下响应可访问属性器，response内部模块提供了各方法对头信息，状态码，状态信息，内容类型，内容长度等进行设置


- context

上下文，通过内部自行封装了一套koa处理方式，包装了nodejs内部对象方法，通过封装简化了操作，例如ctx.request.req = res.req ，简化了管理；每一次请求发起都产生一个新的上下文


## koa内部原理

- 中间件

内部实现基于发布订阅方式，以队列数据结构存储；通过异步迭代来交给用户控制执行流程（next方法）

- promise

挂载的中间件会包装在promise中，以捕获到当中间件中执行的成功状态，成功状态下，将最终处理得到ctx；首个promise对象状态变为成功停止其他中间件继续执行

- async/await

实现异步代码的同步化编写，不管中间件内部是否有异步方式，均执行返回promise方式

- 异步迭代

通过异步迭代，控制中间件的执行，传出的函数next手动控制

```js
 function compose(middleWare) {
    let index = -1
    // 最终
    return (context, next) => {
      const dispatch = (i) => {
        if (i<=index) {
          console.log('多次调用next方法导致触发');
          return
        }
        index = i;
        // 注册的中间件,以队列方式执行
        const fn = middleWare[i]
        if (!fn) {
          return Promise.resolve();
        }
        return Promise.resolve(fn(context, dispatch.bind(null, i+1)));
      }
      // 每一次调用执行返回的promise对象
      // 首个中间件函数执行成功后将交给首个promise
      return dispatch(0);
   }
 }
 // middleWare -> 通过app.use定义的中间件数组
 const fn = compose(middleWare);
 // dispatch(0)
 // ctx 为传入处理生成好的上下文对象
 fn(ctx).then(handlerRequest).catch(handlerError);
 // handlerRequest 对ctx处理，主要还是对最中内部绑定的body属性处理，通过调用了nodejs内部res.end完成响应
 // handlerError 捕获错误
```

## koa中间的编写

中间件都为一个函数，通过返回一个函数，接收传入的cxt, next

## 应用到的npm

- http-errors http 错误处理

- http-assert http断言

- delegate 添加代理到，proto.xx = proto.response.xx

```js
delegate(proto, 'response')
```

- statuses http 状态信息（状态码，状态消息）工具

- cookies

- only 返回一个配置对象的白名单列表

- accepts 获媒accept头信息内容

- content-type

- parseurl 解析url地址信息以对象模式展示

- type-is 推测content-type类型

- fresh 通过检查last-modified, if-modified-since/ etag, if-none-match进行头信息比对，返回内容缓存是否过期，true未过期，false过期

```js

  const http = require('http');
  const { Stream } = require('stream');
  const app = {
    ctx: {},
    middles: [],
    use: function(fn) {
      this.middles.push(fn);
    },
    handler: function(req, res) {
      const ctx = this.createContext(req, res);
      const handlerResult = () => this.handlerResult(ctx)
      this.fnMiddles(ctx).then(handlerResult).catch((e) => {console.error(e);});
    },
    createContext: function(req, res) {
      const ctx = Object.create(this.ctx);
      ctx.req = req;
      ctx.res = res;
      ctx.app = this;
      return ctx;
    },
    fnMiddles: function (ctx) {
      let middles = this.middles;
      const next = function(i) {
        let fn = middles[i];
        if (!fn) {return Promise.resolve()}
        return Promise.resolve(fn(ctx, () => next(i+1)));
      }
      return next(0);
    },
    handlerResult: function(ctx) {
      // 对请求体处理
      let res = ctx.res;
      let body = ctx.body;
      if (null == body) return res.end();
      ctx.length = Buffer.byteLength(body);
      if (Buffer.isBuffer(body)) return res.end(body);
      if (typeof body === 'string') return res.end(body);
      if (body instanceof Stream) return body.pipe(res);
      body = JSON.stringify(body);
      res.end(body);
    },
    listen: function() {
      const server = http.createServer(this.handler.bind(this));
      server.listen(...arguments)
    }
  };

  app.use(async function(ctx, next) {
    console.log(1);
    ctx.body = 'body';
    next();
    console.log('1 back');
    ctx.body = 'new body';
  })
  app.use(async function(ctx, next) {
    console.log(2);
    console.log('2 back');
    //next();
  })

  app.listen(8000, function(){
    console.log('start');
  })
```
