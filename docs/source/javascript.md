### 原理深入

  - new 实现

    思路：

    1. 创建一个新对象

    2. 将构造函数的prototype指向到新对象的原型链上

    3. 将构造函数中的this指向到新创建的对象

    4. 如果该构造函数返回的是对象那直接返回，若不是返回新创建对象

    ```js
      function createObject(constructor){
        const obj = {};
        let r = constructor.apply(obj, [].slice.call(arguments, 1));
        obj.__proto__ = constructor.prototype;
        return typeof r === 'object' ? r : obj;
      }
    ```

  - call/apply/bind

    call 方法思想 主要是为了完成函数中this对象的指向,改变函数执行的上下文，通过fn.call(context)

    ```js
      const call = Function.prototype.call = function (context) {
        context = context ? Object(context) : window;
        context.fn = this;
        const args = [];
        for(let i=1;i<arguments.length;i++){
          args.push('arguments[' + i + ']');
        }
        let r = eval('context.fn(' + args + ')');
        delete context.fn;
        return r;
      }

      const fn = function(){
        console.log('fn',arguments);
      }
      const fn1 = function(){
        console.log('fn1', arguments)
      }
      fn.call.call(fn1,23, 45);
    ```

    apply原理实现:

    ```js
      const apply = Function.prototype.apply = function (context, args) {
        context = context ? Object(context) : window;
        context.fn = this;
        let r = eval('context.fn(' + args + ')');
        delete context.fn;
        return r;
      }

      const fn = function(){
        console.log('fn',arguments);
      }
      const fn1 = function(){
        console.log('fn1', arguments)
      }
      fn.apply(fn1, [23, 45]);
    ```

    bind实现原理:

    ```js
      const bind = Function.prototype.bind = function (context) {
        context = context ? Object(context) : window;
        const bindArgs = [].slice.call(arguments, 1);
        const that = this;
        function fn(){}
        fn.prototype = this.prototype
        function bindFn(){
          const args = [].slice.call(arguments);
          return that.apply(this instanceof bindFn ? this : context, bindArgs.concat(args));
        }
        bindFn.prototype = new fn();
        return bindFn;
      }

      const fn = function(){
        console.log('fn',arguments);
      }
      fn.prototype.show = function(){console.log('fn show');}
      const fn1 = function(){
        console.log('fn1', arguments)
      }
      const fn2 = fn.bind({a:1}, 45,34);
      const c3 = new fn2();
      console.log(c3.show());
    ```

  - instanceOf 实现: 循环查询该实例链上是否有构造函数的原型

    ```js
      function createInstanceOf(A,B){
        let proto = A.__proto__;
        while(true){
          if (proto === null) {
            return false;
          }
          if (proto === B.prototype) {
            return true;
          }
          proto = proto.__proto__;
        }
      }
      function T(){
      }
      const a = new T();

      es6:实现方式
      class S {
        static [Symbol.hasInstance] = function(str){
          return typeof str;
        }
      }
      console.log('hello' instanceOf S);

      es5: 实现方式
      function S(){}
      Object.defineProperty(S, Symbol.hasInstance, {
        value: function(x){
          return typeof x;
        },
        configurable: true,
        enumerable: false,
        writable: true
      })
      'hello' instanceOf S   // true
      S[Symbol.hasInstance]('hello')

      createInstanceOf(a, Object)
    ```

  - 执行上下文，作用域链，this

  - 深度拷贝，浅度拷贝: 对象的深度拷贝一个新的，修改下不会影响到原先对象， ...,object.assign,Array.prototype.slice都为浅拷贝

    ```js
      function deepObject(obj, weakMap){
        if (obj == null) return obj;
        if (obj instanceof RegExp){
          return new RegExp(obj);
        }
        if (obj instanceof Date){
          return new Date(obj);
        }
        if (typeof obj !== 'object'){
          return obj;
        }
        const weakmap = weakMap || new WeakMap();
        if (weakmap.has(obj)) {
          return obj;
        }
        const constr = new obj.constructor();
        weakmap.set(obj, true);
        for(let key in obj){
          if(obj['hasOwnProperty'](key)){
            constr[key] = deepObject(obj[key], weakmap);
          }
        }
        return constr;
      }
      var obj = {a:'ni',b:{c:'h'}}
      obj.d = obj;
      var obj1 = deepObject(obj);
      console.log(obj1);
    ```

  - 原型链

    任何function上都有原型prototype, 任何对象上都有原型链__proto__,由于__proto__指向构造函数的prototype,而又由于prototype下有__proto__,因此形成了原型链，查找由自身是否具有到原型链上查找，直到找到根Object.prototype.__proto__ = null,这里有两个特殊的Function, Object,他们都是即有prototype,又有__proto__,所以Function.__proto__ === Function.prototype, Object.__proto__ === Function.prototype,因此 Function.__proto__ == Object.__proto__

  - 类型之间转换

    隐式转换(if, !, 类型之间的+,-,*,/,%等运算方式, 比较运算符/==, 单目运算)

    0, '', false, null, undefined为false

    单目运算转换 +

    显示转换(number,string,boolean,object等)

    转换分为原始类型之间，原始类型与引用类型

    原始类型之间：

        操作符为+，操作数优先做字符拼接，其他情况都会转换为数字来进行操作，null,undefined,nan

    原始类型与引用类型:

        先将对象转换为原始类型，再进行原始类型之间的转换规则，对于对象转换为原始类型，通过对象内部的toprimitive,valueof,tostring顺序来完成，toprimitive可以改写后两者的返回，顺序调用直到返回原始类型，否则以[object object]

    对于比较运算(>,<,==,<=,>=)等进行转为数字类型来比较

    特殊类型

      null/undefined/nan 与0相比都为false

      null == undefined true

      特殊例子： [] == ![] true

<br/>

### 重点知识

  - this运行原理

    由于js引擎运行原理  通过预编译，运行两个阶段，在脚本语句定义后，通过对语句中变量的声明，以及变量内存分配，以及作用域的形成，此时变量并没有分配值，当处于运行阶段时，对变量赋值，完成脚本运行

    this为当前执行环境所属，即调用方法对象指向，全局作用域、对象调用、call/apply/bind转换对象作用域、箭头函数、new实例化，全局作用域分为普通模式与严格模式（'use struct'）,普通作用域指向window、global,严格模式指向undefined

    ```js
      function globalfun(){
        console.log(this); // window
      }

      function globalfun(){
        'use struct'
        console.log(this); // undefine
      }
    ```

    **对象调用方式，函数内部this指向所属对象**

    ```js
      var obj = {
        name:'this is name',
        fun: function () {
            console.log(this);  // obj
        }
      }
      obj.fun();
    ```

    **通过call,apply,bind显示转换this指向**

    ```js
      var obj1 = {
        name:'this is name1',
        fun: function () {
            console.log(this);  // obj2
        }
      }
      var obj2 = {
        name:'this is name2',
        fun: function () {
            console.log(this);
        }
      }
      obj1.fun.call(obj2)
    ```

    **箭头函数中不存在this，this所属与定义箭头函数上层函数**

    ```js
      function tt () {
        settimeout(function(){
            console.log(this);   // window
        })
        settimeout(()=>{
            console.log(this);   // obj
        })
      }
      obj.tt();
    ```

    **new实例化绑定this**

        new fun()

        new操作目的创建一个新对象，将构函数this对象指向新对象，实现对象的属性方法

        var obj = {}
        fun.call(obj)
        obj.__pro__ = fun.prototype

    **关于显式隐式优先级**

        隐式模式低于，call/apply/bind低于new;箭头函数不受内层决定，受上层环境影响决定

<br/>

  - 闭包（作用域，作用域链，执行上下文，内存管理）

    作用域一个变量的查找规则，当预编译时决定，作用域链是在执行阶段由编译阶段的变量对象转为活动对象包含了当前调用的作用域和上层可访问的活动对象,作用域链为作用域查找的扩展

    执行上下文，即语句执行环境，执行环境，当语句运行结束后，释放当前执行环境，也就是每一次执行都会创建一个执行环

    闭包主要为通过作用域链来实现外层访问内存变量，由于内层函数运行释放后，但由于外层引用了返回函数，返回函数引入内层函数变量，所以形成不能释放的变量，即闭包变量

<br/>

  - 对于严格模式与非严格模式

      严格模式的出现为了解决早期一些JS不友好问题:

      1. 使之前的静默错误显示

      2. 提高了静态性分析，提示了js引擎的编译代码优化

      3. 为未来提供了一个过渡话的延伸

      对于设置了defineProperty属性定义不可写，没有读属性功能等提示错误，包括对属性的冻结，阻止扩展，密封

      在删除一些变量通过delete方法提示错误，对未定义变量全局话使用也会报错

      对arguments,fn.caller,fn.arguments,with提供了静态分析，以及取消关联

      对eval提供了独立的作用域，不会影响外层变量覆盖问题，对于this的管理，不支持动态改变this对象指向（通过apply,call,bind）

      对this的调用，一般函数返回均为对象，但严格模式下，全局中this为undefine,非对象通过apply,call,bind返回的原始值

      我们对开启严格模式，注意代码的统一，防止严格与非严格冲突，通常，我们可以针对需要的地方开始严格

<br/>

  - 关于跨域解决方案总结

    1. 与服务器之间的通信方式

        jsonp:

          由于javascript本身访问不受浏览器限制，可以与后端约定好请求返回提前我们定义的函数运行,后端返回拼写函数调用方式,这种方式只支持get方式，并且若返回的代码里有脚本，容易操作xss攻击
        ```js
          window.fn = function(data){};
          <script type="text/javascript" src="http://www.a.com?callback=fn"></script>
        ```


        cosr跨站请求:

          前端通过正常的方式请求，犹豫在非同源情况下会出现跨域（协议不同，端口不同，域名不同），我们需要配置后端,返回头信息，犹豫浏览器本身的拦截

        ```js
          setHeader('Acess-Control-Allow-Origin', 域名)  // 设置是否支持跨域的访问

          setHeader('Acess-Control-Allow-header', 'name') // 允许客服端可以访问getrequestheaders(name)

          setHeader('Acess-Control-Allow-Creadients')   // 在跨域情况下，需要设置是否同意带上COOKies请求

          setHeader('Acess-Control-Allow-Method', 'put')  // 设置支持的请求方法

          setHeader('Acess-Control-Allow-Max-Age', 6)   // 设置在出现需要options控制预检查请求的延迟
        ```

        nginx配置

          一种直接开启允许头信息来配置支持
          add_header

          一种通过路由转发跳转到支持的服务，最后返回到我们的访问的地址

        http proxy

          这中方式与nginx第二种基本模式相同，但由前端配置，通过发送前端方式的请求转发模式（可以再补充点资料）

    2. 标签页之间的通信

        iframe方式:

            1. 通过window.name方式，原理为由于窗口共享一个window.name标识，若a,c为同域，b为跨域,首先通过a iframe到b, b中设置了window.name值,当iframe加载完成，修改地址为c，同时控制加载不能重复运行,这样可以通过window.iframe[name].contentWindow.name取到值，由于同域了可以访问window.iframe[name].contentWindow

            2. 通过iframe嵌套hash传值，若a,c为同域，b为不同域,a 引入b将a中的值通过hash传入，b中可以通过值，将需要需要通知的消息放入通过引入c

            3. 通过设置document.domain方式，不过这种方式有显示的，当通信页面之间为部分同属一个域，这样只要分别设置两个页面的domain,指向他们的共享域地址

        postMessage:

            这种方式优势简单，并且不需要任何设置，但低版本不支持，高级版本均支持,通过iframe引入要交流的页面，本页面设置window.postMessage(message,targetOrigin),window.onmessage=function(event){event.data/event.origin },在通信页面下设置，window.onmessage=function(event){evet.data/event.source.postMessage(message, targetOrigin)}

        websocket:

            建立在tcp下的一个新的协议组成，ws/wss,本质支持跨域访问，且为双向通信，一般低版本不支持，可以通过socket.io兼容支持

            客户端正常请求，后端通过引入ws库

          ```js
            websocket = require('ws')
            const ws = new websocket.server({ port: 8080 })
            ws.on(connection,function(ws){
              ws.on('message', function incoming(message) {
                  console.log('received: %s', message);
              });

              ws.send('something');
            })

            server client
            let ws = new WebSocket('ws://localhost:8000/test');
            // 打开WebSocket连接后立刻发送一条消息:
            ws.on('open', function () {
                console.log(`[CLIENT] open()`);
                ws.send('Hello!');
            });
            // 响应收到的消息:
            ws.on('message', function (message) {
                console.log(`[CLIENT] Received: ${message}`);
            }

            前端：
            var ws = new WebSocket('ws://localhost:8000/test');
            ws.onmessage = function(msg) { console.log(msg); };
            ws.send('Hello!');
          ```

<br/>

  - es6常考虑点

    1. let,const,var作用域

    2. 解构（数组，对象，字符串）

        spread or reset

        对象合并问题（深度，浅度）拷贝

    3. Object.defineProperty

        默认定义的方式不可修改

        ```js
        Object.defineProperty(obj, 'kk', {
          enumerable:true,
          writeable:true,
          value:111,
          configurable:true,
          get(){console.log('dd')},
          set(val){}
        })
        ```

        writable/value/get/set不能共存

    4. 对象（es5/es6）定义实例继承

        实例继承  parent.apply/call(this, args)

        原型继承

        ```js
          sub.prototype.__proto__ = parent.prototype

          sub.prototype = object.create(parent.prototype)

          sub.prototype.constructor = sub;

          object.setprototype(sub.prototype, parent.prototype);
        ```

        静态继承

        ```js
          sub.__proto__ = parent

          object.setprototype(sub, parent);
        ```

        es5中原型方法可以遍历，在利用es5实现es6方法，注意这点，重新定义类上的原型方法和静态方法,检查调用是否为实例化调用，对返回的是否为其他对象，若为其他则返回，否则返回当前this

    5. 装饰器

    6. 一些方法运用

        reduce/symbol简单了解/set(交并差级)/map完成

<br/>

  - xss/csrf安全

    xss

    1. base dom

       在DOM节点上做一些因为未解析而导致代码运行，例如在img标签上挂上onerror发起请求

    2. 反射

       通过在地址栏中参数中有脚本，当后端返回后，在页面中加载了

       encodeUrlComponent 进行编码

    3. 数据库存储

       这种主要针对表单提交，在提交中有脚本内容，但后端直接存储到数据库中，当后端返回直接插入到页面导致，需要前后端都过滤< > " '等符号

<br/>

  - 断点续传

    通过对头信息的范围控制来完成
    client
    headers{Range: bytes=start-end, Accept-Bytes:bytes}
    server
    headers{Content-Range: start-end/total}

<br/>

  - 正向代理，反向代理

    代理服务: 主要是协助真是服务完成一些操作

    正向代理: 主要是相对服务器而言客户端为透明的，
            代理服务器协助客户端完成发送操作
            例如：VPN

    反向代理: 主要是相对客户端服务端是透明的，
           代理协助服务端完成操作
           例如：负载，CDN, 转发请求

<br/>

  - 多包语言

    (1). 通过两版本页面，访问不同地址

    (2). 通过前端语言包库，在渲染时完成对应传入，例如vue-il18

    (3). 通过服务端提供语言包，在头信息中带入accept-language,后端处理返回对应信息

<br/>

  - 防盗链

    由于自己服务器上的资源在被其他服务器上的页面引用时，通过访问方式而占据了原本服务的资源流量等，所以通过防止其他外站引用资源防护。在本服务器中通过验证请求资源所携带的referer与请求头host是否为同一个服务器，如果是可以正常访问，如果不是则打连接到其他资源，某些时候，我们是可以跳过防盗链防护的

    有以下方式：

        资源被引入的外站页面头部添加
        <meta name="referrer" content="no-referrer">

        资源img标签上添加
        <img src="pic" referrerpolicy="no-referrer">

        设置响应头
        res.setHeader('Referrer-Policy','no-referrer')

        通过代理服务，访问自身假资源，在服务端处理代理转发

<br/>

  - 压缩，解压

    目前支持压缩gzip,deflate,br,通过头信息accept-encoding,
    content-encoding来完成