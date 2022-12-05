## js组成

- **语法标准**

  es5标准

  es6标准

- **dom(文档对象模型)**

  文档对象模型，html中标签最终在浏览器中都可以理解为一个节点，节点间形成dom树,dom中提供了可操作各节点的方法和属性

- **bom(浏览器对象模型)**

  浏览器对象模型，针对浏览器环境所形成的浏览器相关的属性集合对象，可以通过访问该对象操作浏览器一些对象进行操作

js中提供了基本的语法结构和标准库，由于运行依赖的环境不同，会有相对宿主环境提供的对象，js可以与宿主环境中对象进行交流

## js理解

- **从编译原理**

  解释型语言，即程序为解释一条，执行一条, 解释型语言为动态语言；编译型，即将源码编译完成后再执行，编译型语言为静态语言，静态语言的好处是在执行前可以对需求的变量，资源进行分配空间，提完完成资源的合理分配，这样在执行情况下可以更快的对资源获取，操作；动态语言在执行阶段才能对语句分析，这样对于分配需要多余时间来完成，程序性能上不如静态语言快；

  js为动态语言，解释型语言，为什么js是动态语言，静态语言需要提供编程程序的处理，对js运行的环境其实并不需要过于复杂的环境，解释型状态反而使得脚本更快呈现效果；

- **从类型分类**

  在js中对象类型由基本类型，引用类型；基本类型（String, Number, Boolean三种原始类型与null, undefined, symbol）;引用类型即Object

- **从对象模式**

  在js中，对象可以为宿主对象，内置对象；宿主对象由所依赖的环境所提供的；内置对象则是脚本内部自行提供的方式；对于内置对象可以分为：普通的对象即通过脚本中提供的方法来创建对象，固有对象即不需要通过new就可以使用的对象，原始对象即需要通过new方式来体现

- **从语句来说**

  声明语句与执行语句：

  声明语句：var,const,let,class,function

  执行语句：条件语句，判断语句，赋值语句等

## js知识点

- **js中的严格模式**

  什么是严格模式，早期Js脚本有很多不良好不恰当的地方，通过提出严格模式来开启严格解析，严格模式的目的是为了完善脚本的漏洞问题，避免不安全性，提高错误提示，为后期过渡到高版本一个过渡；老浏览器由于有依赖问题，而不能推翻早期错误，通过次方式修补，在低级浏览器中会将模式标识忽略，高级版本浏览器中将识别开启；开启方式在第一个有效脚本语句之前添加 'use strict'; 严格模式作用范围有两种，全局和函数

  从几方面来考虑严格：

  1. 静态化，js脚本是动态语言，有很多动态性改变执行环境，比如函数调用中this会根据情况不同而不同；with方法的运用，作用上下文不同内部执行也是有差异的，严格模式下禁止了with的使用

  2. 在对对象的属性对象设置Object.preventExtensions, Object.seal, Object.free方法完成对属性的防扩展，密封，冻结；操作情况下提示错误

  3. 对于函数中禁用fn.callee, fn.caller, fn.arguments, argument.callee, argument.caller, 取消函数参数与argument的绑定, 静止函数中使用相同参数

  4. eval作用域的管理，常规模式下eval作用域属于所属作用域(全局，函数)，在这种情况下可以动态声明变量，编译阶段无法识别，只能在运行阶段识别；严格模式下通过为eval开启独立的作用域，也就是说在eval内声明的变量只属于当下eval执行环境中

  5. 对于为声明变量赋值相当于全局对象属性，严格模式禁止此方式；delete操作符只能对对象的属性操作，不能删除变量；对于定义了取值属性的对象，操作存值操作不允许

- **js中遍历**

  对象的遍历：for in, Object.entries, Object.keys, Object.values

  数组的遍历：对象遍历方式, for of, 数组内部提供的方法(forEach, map)

- **js中原型操作**

  obj.__proto__  针对浏览提所提供的方法
  obj.constructor.prototype 通过构造函数得到原型
  Object.getPrototypeOf 更合理的获取原型的方法

  Object.setPrototypeOf 给对象设置原型

  Object.create  创建对象方式
  new Constructor 创建对象
  obj = {}        字面量方式创建

  检测是否是实例化对象
  this instanceOf Constructor
  new.target
  使用严格模式防止非实例化调用函数，this无效

- **继承**

  js继承通过建立对象间的引用来形成，由于在js中对象（除null）拥有__proto__属性，指向所实例化构造函数的prototype对象，而构造函数的prototype属性指向的也是一个对象同样具有__proto__属性，同样形成指向所来源构造函数的prototype，所以形成多个对象之间通过__proto__形成的链条，__proto__的建立完成了对象之间的关联，在对象查找方法属性时，会通过从自身查到作用域链上查找，所以当一个对象需要引用到另一个对象的方法和属性时，即只要该对象的原型链上具有需求对象的原型对象，即通过对的__proto__可查找到

- **作用域，作用域链，执行上下文，执行栈，词法作用域，词法环境**

  作用域即作用范围，在js中定位到所使用变量等的作用范围；

  作用域链，变量作用范围所形成的集合；在形成的作用范围集合中获取到参量的值，多个作用域所形成的查找环境

  执行上下文，在代码运行启动，会形成该代码执行的执行环境；

  执行栈，代码执行的时候会产生对应的执行上下文即执行环境，在全局环境执行的代码会产生全局执行上下文；当函数调用产生函数调用所产生执行上下文，执行栈是为了管理执行环境所提供的一种数据结构，用来以栈的模式来管理各执行环境的执行，执行开始入栈，执行结束则出栈

  词法作用域也可以叫做作用域，当声明变量或者函数时，执行开启后产生了对应的上下文环境在代码运行之前，对当前上下文中的所声明的变量或者函数进行分析，并通过建立变量环境（变量对象），词法环境，执行上下文所属的上下文的环境记录引用，变量环境（变量对象）针对于(var, function, arguments)，词法环境针对于es6中的新声明方式(let, const), 而通过out指向外层上下文引用，并将该执行上下文推入到栈中，当执行结束再出栈，这个过程中词法环境，变量环境的形成决定了在代码开始执行时查询相应变量的记录，词法作用域则标识了执行上下文所属的上层执行上下文，这样词法作用域链形成了多个上下文词法作用域的集合，建立其了一个查找参量的链式范围。



- **事件循环**

  事件循环是一种调用任务进入主线程执行的策略方式，在js基于浏览器或者Node环境中都是以单线程作为主线程来执行任务，对于异步任务，通过其他相关api或者模块来完成，一方面通过建立异步任务来提高执行效率，异步任务的产生不会阻塞主线程执行后续任务，那么当异步任务执行完成后如何将执行结果继续返回到主线程，这里需要明白的是，在异步任务执行开始后会通过事件驱动通知任务是否已经完成，并将完成任务事件推入到事件队列，在主线程执行完相关同步任务后，事件循环机制会不断的轮询事件队列，将已经准备的任务回调再推入到主线程，主线程开始执行相关。

  对于浏览器与Node环境，所提供的环境有差别的，浏览器利用了浏览器自身提供，node环境事件循环依赖于libuv库提供的引擎，并且所形成的事件队列也是不相同的，浏览器通过提供了两种队列模式，宏任务队列，微任务队列，分别存放不同的异步任务类型，node环境中提供了更为丰富的事件队列，定时器队列，i/o回调，idle, prepare内部队列,poll轮询队列，check对象，close事件触发队列等，对于清空队列执行的方式也不同，浏览器优先完成微任务清空，之后宏任务；node环境则提供了一套自身清空模式，poll,（check/setTimeout），close callbacks,（若存在nextTick任务），i/o回调

  外部输入数据-->轮询阶段(poll)-->检查阶段(check)-->关闭事件回调阶段(close callback)-->定时器检测阶段(timer)-->I/O事件回调阶段(I/O callbacks)-->闲置阶段(idle, prepare)-->轮询阶段...

  <a href="https://zhuanlan.zhihu.com/p/33058983">https://zhuanlan.zhihu.com/p/33058983</a>

- **V8垃圾回收**

  V8是提供js运行的引擎，浏览器与node都是基于v8作为js运行引擎；js本身是解释性语言，轻量级高级语言，代码的执行都会为其分配一定的内存，当代码执行结束后释放内存，部分语言提供了内存的分配和释放管理通过手动调用一些方法来完成，对于js本身内部并没有提供，V8引擎则为脚本的运行提供了内存管理中的释放即垃圾回收（内存管理：内存的分配，内存的使用，内存的释放），js对于内存的分配和释放都是自动执行的，分配产生在定义一些参量时，释放则通过一定的算法来针对不同情况来完成。垃圾回收是自动触发完成。

  新生代

    短暂生命周期的对象会存储在新生代，在每次通过from区移动到to区的过程中，会将活动状态的对象移入，非活动状态会释放，操作完一次并切换两个区，待下一次

  老生代

    存储长期存在的对象，老生代不采用新生代的回收策略，而是通过标记和清除的方式来完成，标记完成当通过在回收器建立了根对象，并查找所有能访问到的对象进行标记，查询结束后将没有标记的对象是否回收，但这个过程中会产生释放内存形成的碎片化，这样又通过清除方式来整理内存，将碎片化的内存合并为一块连续的内存。提高下次内存的利用率


  新生代中的对象转为老生代中的对象

    当新生代触发回收时，会对移动的对象地址判断是否已经产生过一次移动，若没有，并to区空间大于25%，则移入新生代to区，若小于25%则移入到老生代区，若移动过一次到新生代to区则移动入老生代区，这个过程叫晋升

  对于编写代码注意：减少全局性的存储；对不再使用的对象，变量等要主动置null；减少爆栈式分配

  <a href="https://juejin.cn/post/6844904016325902344">https://juejin.cn/post/6844904016325902344</a>

## js中基本编程

- **js中参数合并**

  ```js
    // [...a, ...b]
    // Object.assign(a, b)
    const obj = {a: 1, b: 2}
    const obj1 = {c: 1};
    const hasOwnProper = Object.prototype.hasOwnProperty;
    for (let a in obj) {
      // 这里可以通过hasOwnProperty判断只将自身对象合并
      if (!(a in obj1) && hasOwnProper.call(obj, a)) {
        obj1[a] = obj[a];
      }
    }
  ```

- **js中对象拷贝**

  对象的拷贝分为两部分实例属性的拷贝和原型的拷贝

  ```js
    function copyObject(obj) {
      let attrs = Object.getOwnPropertyNames(obj);
      let proper = {};
      attrs.forEach((key)=>{
        proper[key] = Object.getOwnPropertyDescriptor(obj, key);
      })
      return Object.create(Object.getPrototypeOf(obj), proper)
    }
    const obj1 = copyObject(obj);
  ```

- **js中new操作实现**

   new 操作服务完成了创建实例对象，实例对象有两部分组成，实例对象与原型对象

   实例对象通过将构造函数中的this指向所创建对象，原型对象即构造函数的prototype属性

  ```js
   function _new(Constructor) {
     let obj = Object.create(Constructor.prototype); // 这里也可以直接obj = {}
     let result = Constructor.call(obj);
     return (typeOf result === 'object' && result != null) ? result : obj;
   }

   // Object.create方法的实现
   function create() {
     if (Object.create) return Object.create;
     Object.create = function(obj, objOptions) {
       function F(){
       }
       F.prototype = obj;
       let o = new F();
       Object.keys(objOptions).forEach((attr) => {
        Object.defineProperty(o, attr, objOptions[attr]);
       })
       return o;
     }
   }
  ```

- **js中instanceOf实现**

  instanceOf原理是验证对象是否是某构造函数的实例，构造函数的原型是否在对象的原型链上

  ```js
    function _instanceOf() {
      // if (instanceOf) return instanceOf;
      const instanceOf = function(obj, Constructor) {
        let flg = false;
        let _prototype = Constructor.prototype;
        if (!_prototype || !obj) return flg;
        while(obj) {
          let objPro = Object.getPrototypeOf(obj);
          if (objPro === _prototype) {
            flg = true;
            break;
          }
          obj = objPro;
        }
        return flg;
      }
      return instanceOf;
    }

  ```

- **bind实现**

  ```js

    function fn() {
      console.log(this);
    }
    Function.prototype.bind = function () {
      const fn = this;
      const args = Array.prototype.slice.call(arguments);
      let context = args.shift();
      const bfn = function() {
        const self = this;
        args = args.concat(Object.prototype.slice(arguments));
        return fn.apply(self instanceof btn ? self : context || null, args);
      }
      const fun = function(){};
      //或者bfn.prototype = Object.create(fn.prototype)
      fun.prototype = fn.prototype;
      bfn.prototype = new fun();
      return bfn;
    }
    const obj = {};
    const f = fn.bind(obj, 'bind');
    // const f = fn.bind(obj, 'bind');
    // const b = new f();
  ```

- **call方法**

  ```js

    function fn(a,b) {
      console.log('-----',a,b);
    }
    Function.prototype.calls = function() {
      const fn = this;
      const result = [];
      Object.keys(arguments).forEach((a) => {
          result.push(arguments[a]);
      })
      const args = result;
      let context = args.shift();
      // TODO 这里如何不利用变化为数组方式而直接利用arguments对象
      const f = new Function('context', 'context.fn('+JSON.stringify(args).slice(1,-1)+');delete context.fn;');
      context.fn = fn;
      f(context);
    }
    const obj = {a: 1};
    fn.calls(obj, 's1', 's2');

  ```


- **apply方法**

  ```js
    function fn() {
      console.log(this);
    }
    Function.prototype.apply = function() {
      const fn = this;
      const args = Array.prototype.slice.call(arguments);
      const context = args.shift();
      return context.fn(...args)
    }
    const obj = {a: 1};
    fn.apply(obj)
  ```


- **js中清除定时器**

  ```js
    // 清除除轮询外的其他定时器
    const gid = setInterval(clearAll, 0);
    function clearAll() {
      let id = setTimeOut(()=>{}, 0);
      while(id > 0){
        if (id !== gid) {
          clearTimeout(id);
        }
        id--;
      }
    }
  ```

- **串行与并行运用**

  并行开启多个任务执行，串行控制结束后添加任务

  ```js
    function run() {
      let arr = [2,1,5,4,7,9,5];
      const l = arr.length;
      let limit = 3;
      let max = limit;
      let total = 0;

      function asyncFun(print) {
        asyncTask(print);
      }

      function asyncTask(print) {
        setTimeout(() => {
          if (total >= l) return;
          if (max < limit) {
            if (max < 0) {
              max = 0;
            }
            start(max);
          }
          total+=1;
          max--;
          print(arr.shift());
        })
      }
      function print(n) {
        console.log('print:', n);
      }
      function start(m) {
        for(let i=m; i<limit; i++) {
          asyncFun(print);
        }
      }
      start(0);
    }
    run();
  ```

- **reduce实现**

  ```js
    const arr = [2,1,4];
    Array.prototype.reduce = function() {
      let self = this;
      if (!Array.isArray(self)) return;
      let fn;
      let initValue;
      let currentIndex = 0;
      fn = arguments[0];
      if (arguments.length === 2) {
        initValue = arguments[1];
      } else {
        currentIndex = currentIndex+1;
      }
      self.forEach((item, index) => {
        initValue = initValue ? (initValue) : (item);
        index = currentIndex + index;
        let nextValue = self[index];
        self[index] && (initValue = fn(initValue, nextValue, index, self))
      })
    }
    arr.reduce((a,b, i, arrs) => {
      console.log(a,b,i);
      a.push(b);
      return a;
    }, [])
  ```

- **事件代理**

  ```js

   function addEvt(dom, evtType, handler) {
     dom.cacheEvt = dom.cacheEvt || {};
     dom.cacheEvt[evtType] = dom.cacheEvt[evtType] || [];
     dom.cacheEvt[evtType].push(handler);
     disPath(dom, evtType, handler);
   }

   addEvt(document.querySelector('.div'), 'click', function() {
     console.log('111');
   });

   function disPath(dom,evtType) {
     // 这里可以通过映射记录document上已绑定的的事件来去除重复绑定
     document.addEventListener(evType, function(ev) {
      let target = ev.target;
      let handlers;
        while(target) {
          if (target['cacheEvt'][evType]) {
            handlers = target['cacheEvt'][evType];
            break;
          }
          target = target.parentNode;
        }
        if (handlers) {
          handlers.forEach((handler) => {
            handler && handler.call(target);
          })
        }
      }, false)
    }
  ```

## js中异步性

js引擎为JS提供了执行环境，js引擎由多个线程组成，各自完成需求任务，主线程提供了JS中同步任务的执行，异步任务由对应的异步线程来完成，单线程更多是指主线程的唯一性，而并非只有一个线程

- **异步性原因**

对于JS执行依赖的宿主环境浏览器，面对于用户，在多个任务执行中如果存在同时两个执行JS的线程会操作操作优先级，操作不明确，加锁复杂程度，对于浏览器来说必然是很复杂的，异步性也是为了解决所面对运行环境的复杂程度而严，浏览器环境并不适合过于复杂的管理，复杂化会影响到用户体验，用户的管理

- **异步性优点**

在执行的任务中可以分为，i/o任务与CPU密集性任务，对于I/O任务大量化，如果堵塞后续任务执行，导致CPU空闲，显然是浪费系统资源，异步性也是了提升资源的利用性，在异步任务执行过程中不会堵塞后续任务执行，在任务完成后再继续执行后续操作；提高了整体的执行效率

- **异步性编程运用**

  1. callback

    通过回调函数方式来传递通知当任务执行完成后执行后续任务；这种方式理解简单，但回调函数唯一性，只能有一个，在流程复杂时会出现控制失控，产生过多的嵌套控制，使得程序之间耦合严重。

    ```js
      // fn1执行完后通知f2执行
      function fn1(callback) {
        console.log('fn1 is running')
        setTimeOut(() => {
          callback()
        }, 1000)
      }
      function f2() {
        console.log('fn2 is running')
      }
      fn1(f2)
    ```

  2. 事件监听

    这种方式通过对执行任务绑定事件方式建立，在该任务执行结束后，通过触发绑定事件来通知后续任务执行；这种模式优点是逻辑解耦良好，并可以产生多个事件监听，同一个事件绑定多个订阅函数，不会产生大量代码耦合，但由于依赖事件，导致流程控制并不良好，绑定和触发流程不能清晰的了解。

    ```js
    function fn1(){
      console.log('fn1 is running')
      setTimeOut(() => {
        f1.trigger('done');
      }, 1000)
    }
    function fn2(){
      console.log('fn2 is running')
    }
    f1.on('done', f2)；
  ```

  3. 发布订阅

    这种方式思想方式和事件监听是一样的，但比较良好的是提供了一个消息中心，对于所订阅事件和发布事件有一个管理；订阅与发布都以信号的方式向管理中心通报，对于清晰化流程很好

    ```js
   // 模拟管理中心
   let msgMiddle = {
     events: {},
     subscribe: function(eventName, fn) {
       if (!eventName || !fn) return;
       this.events[eventName] = this.events[eventName] || [];
       this.events[eventName].push(fn);
     },
     publish: function(eventName){
       if (!eventName) {
         return;
       }
       this.events[eventName] && this.events[eventName].forEach((item)=>{
         item();
       });
     }
   }
   function fn1() {
     console.log('fn1');
     msgMiddle.publish('start');
   };
   function fn2() {
     console.log('fn2');
   }
   msgMiddle.subscribe('start', fn2);
  ```

  4. promise

    内部原理依赖基于回调函数，对于回调函数的管理，通过发布订阅方式来管理，通过then方法存入了订阅函数，当调用resolve或者reject变更当前promise对象状态，根据状态不同调用订阅执行的队列，进行队列函数按序执行，每一个对象状态变化结束后都是不可修改，并通过then方法完成对应订阅函数的执行，将执行结果作为下一个订阅函数的参数传入，每一个then方法都产生一个新的promise对象，这也是为什么可以链式调用的原因；这种方式摆脱了回调嵌套，使逻辑扁平化，由于promise是微任务，具有异步性，提高了任务的执行效率，不会堵塞后续同步任务；缺点是过于依赖于模式下的then方式，导致逻辑执行依赖于promise流程执行顺序，不能脱离模式，再次就是由于每一个promise都是一个新对象，状态的变化发生后不可能停止阻断，也就是promise执行后无法阻断执行，只能丢下结果不做处理，对于编写上来说也不能更融入同步化的编程模式

    ```js
    // 简版流程
    function promise(exFn){
      this.success = [];
      this.fail = [];
      this.status = 'pending';
      this.value = '';
      this.reason = '';

      const queue = function(value) {
        let fn;
        if (this.status === 'resolve') {
          this.success.length > 0 && this.success.forEach((fn) => {
            fn(value);
          })
        } else if (this.status === 'reject') {
          this.fail.length > 0 && this.fail.forEach((fn) => {
            fn(value);
          })
        }
      }
      const resolve = function(value){
        if (this.status === 'pending') {
          this.status = 'resolve';
          this.value = value;
          queue(value);
        }
      };
      const reject = function(error){
        if (this.status === 'pending') {
          this.status = 'reject';
          this.reason = error;
          queue(error);
        }
      };
      try{
        exFn(resolve, reject);
      }catch(e){
        reject(e);
      }
    }
    promise.prototype.then = function(success, fail){
      let p2 = new promise((resolve, reject) => {
        if (this.status === 'pending') {
          this.success.push((v) => {
            try {
              let value = success(v);
              resolve(value);
            }catch(e){
              reject(e);
            }
          })
          this.fail.push((v) => {
            try {
              let value = fail(v);
              resolve(value);
            }catch(e){
              reject(e);
            }
          })
        } else if (this.status === 'resolve') {
          setTimeOut(() => {
            try {
              let value = success(this.value);
              resolve(value);
            }catch(e){
              reject(e);
            }
          })
        } else if (this.status === 'reject') {
          setTimeOut(() => {
            try {
              let value = fail(this.reason);
              resolve(value);
            }catch(e){
              reject(e);
            }
          })
        }
      })
      return p2;
    }
    const p1 = new promise((resolve, reject) => {
      resolve('success');
    });
    p1.then((value) => {
      console.log('resolve后执行', value);
    }, (error) => {
      console.log('reject后执行', error);
    })
  ```

  5. async,await

    基于promise+generator原理实现同步编写更加良好；promise完成对执行值的处理，generator对执行控制流程的控制

    ```js
      async function fun1(){
        const v = await fun2();
        console.log('fun1', v);
      }
      async function fun2() {
        return 'fun2'
      }
      fun1();

      // 相当于fun1执行
      Promise.resolve(fun2()).then((v)=>{console.log('fun1', v);})
    ```

## 重点知识点

- **类型转换**

  数据类型：String(空字符与非空字符), Number(有理数,Infinity,NaN), Boolean(true,false), Symbol(描述符), null, undefined, Object

  基本类型：String, Number, Boolean

  引用类型：Object, Array, Function

  1. 类型转换分为基本类型间转换与基本类型与引用类型间转换

      基本类型间转换：例如 '123' 转换为 123 -> +'123' 隐式转换

      基本类型与引用类型：['a', '1'] 转为基本类型  -> +['a', '1'] 结果为NaN 隐式转换

  2. 类型转换方式显示与隐式转换

      显示转换则为调用库函数方式完成；隐式转换则为通过操作符来隐式界定转换

      显示转换方法：String, Number, Boolean以及三者的实例化对象调用valueOf,toString; parseInt, parseFloat

      隐式转换方法：基本运算符(+,-,*,/), 逻辑非(!), 比较运算符, ==, 条件中的表达式

  **转换规则**：

      基本类型之间，可通过各类型的显示与隐式方法直接完成

      基本类型与引入类型，引入类型先转换为基本类型，再转为对应的原始类型

      字符串转为数字： '123' -> 123    Number('123')/new Number('123').valueOf()/+'123'

      字符串转为布尔： '123' -> true   Boolean('123')/new Boolean('123').valueOf()/!!'123' 即非空字符串都为true

      数字转换为字符串：123 -> '123'   String(123)/new String(123).valueOf()/new String(123).toString()/123+''

      数字转换为布尔: 123 -> true   Boolean(123)/new Boolean(123).valueOf()/!!123 即非NaN都为true

      对象转为数字，字符串，布尔：
      对象中转换优先级以toPrimitive, valueOf, toString, 对象通过顺序调用当执行结果为非基本类型，则继续调用后面，若以得到基本类型，基本类型转换为对应原始类型；要注意的是操作符以及代码的解析方式都会影响到转换结果; toPrimitive有三种模式字符串，数字，默认值

      分析：由于解析将{a:1}识别为语句块执行，所以最后相当与+1,即为1
      {a:1} + 1 -> 1

      分析：由于操作符为+，{a:1}会调用valueOf方法，但结果仍为对象，继续调用toString转换为'[object Object]', 由于有字符串格式，则做字符串拼接，即为'1[object Object]'
      1 + {a:1} -> '1[object Object]'

      分析：由于['a']调用了toString方法，为数组自身复写对象toString方法后方法，转为了'a', 最终按字符串拼接完成，即'1a'
      '1' + ['a'] -> '1a'

      基本类型转为对象：通过调用基本类型的包装对象来完成

    总结: 操作数都为基本类型时，+操作，若至少有一个操作数为字符串，即做拼接，其他则理解为数字运算
         操作数为非基本类型，则对象按规则转换为基本类型，在看是否满足第一条规则
         比较运算符，基于数字格式做比较,在操作数都为字符串时会以对应的ascii码值比较
         null转换为数字类型值为0
         Infinity的Infinity(*/+)Infinity为Infinity;Infinity(/-)Infinity为NaN；0 * Infinity // NaN
         null == undefined
         NaN与任何数的运算都为NaN


    补充：parseInt, parseFloat在转换为数字的要求上不同；首先参数都必需为字符串，parseInt参数若不为字符串，则会首先先转换为字符串，parseFloat则会报错，数字格式有整数，小数，科学计数法，二进制，八进制，十进制，十六进制，转换结果即NaN与可转换数字；若参数为二，八，十六进制字符串格式，并设置了第二参数为指定进制格式，则会以指定格式进制转换为10进制；若参数为二，八，十六进制数字格式，则由于需要转换为字符串格式，转换后会以其十进制字符串格式参与，若参数为小数，小数位数过多，需转换为科学计数法在转换为字符串最后过滤掉不可过滤的值；parseFloat对于非字符串参数均返回NaN;


- **类型判断**

  1. typeOf

     验证非Null意外的基本类型

  2. instanceOf

     验证一个对象是否由某个构造函数实例而来，主要思想还是检查构造函数的原型是否在对象的原型链上

  3. Object.prototype.toString

     验证一个对象的类型

  4. Constructor

     得到对象所属构造函数



## 相关概念理解

- **面向对象**

  即将客观事物抽象为类，通过定义类内部提供行为方法与属性，通过暴露一定的行为方法来完成功能操作，是一种非关注流程化，非细节化化的编程思想

- **面向过程**

  即通对编程通过过程化，一步一步解析执行，完成对应的行为操作，细节化，具体化的一种编程方式

- **原型，原型链**

  即在js中万物皆对象，函数也是对象，函数具有prototype属性，指向该函数所对应的原型，原型也为对象，具有__proto__属性，指向该对象所对应构造函数的prototype属性，原型即构造函数的prototype属性所指对象，原型链则是由于js对象性，通过prototype与__proto__之间建立形成的查找对象属性形成的查找范围链

- **函数运用**

  高阶函数：即将函数作为了参数或者返回值的函数；高阶函数具有使函数功能更加具体化，功能化独立性，灵活性

  函数的柯理化：即将多参函数转换为单参函数，通过参数的定位使函数功能更加具体化，独立化，灵活化，具有延迟函数执行，收集参数功能，缩小函数功能化

  函数的反柯理化：即扩大了函数的作用范围，使函数更加针对具体对象的通用性和灵活性

  析构函数：即完成对函数执行中的相关释放操作的函数，一般在建立函数执行后以高阶函数的方式返回内部提供了释放清理定义函数中执行后需要清理的行为；析构函数是高阶函数中运用方式一种，一种具有销毁，清理的功能的函数


- **同步异步，串行并行**

  同步：即发起方在发起任务执行，任务的执行需要等待执行结果完成后，再进行后续任务执行

  异步：即发起方在发起任务执行，任务的执行不需要等待执行结果完成后，可以继续执行后续任务，后期待任务结果完成，会进行通知之前任务

  同步任务相当于，一个任务开始了，必须全部完成后才可以进行后面的任务，同步任务长期延迟执行会产生堵塞后期任务启动执行，并导致用户长时间的等待，卡顿；异步任务相当于任务先执行了一半，不影响后面的其他任务进入执行，待任务执行结果完成后再通知执行另一半任务

  串行与并行的概念只产生在异步编程模式下，同步任务的执行就是串行方式，串行即一个一个的执行任务，下一个任务受上一个任务的执行影响，并行任务即也可以理解为不相关的任务同时执行，相互之间不会产生制约；在异步编程中，我们可以一个异步任务完成后再开启另一个异步任务，也可以同时执行两个异步任务，并行执行提高了执行效率，速度，高效时间；串行与并行流程控制是为了更好的管理异步任务的执行

  补充理解：并发的任务，在操作系统为单核模式下其实也是串行方式交替处理

- **事件循环，任务队列**

  事件循环：即一种调度任务的策略，通过一个单独的事件触发线程来管理对主线程和异步任务对应线程之间建立的管理，通过在异步线程任务完成后，通过事件循环调度策略来将任务队列中任务调入主线程执行

  任务队列：即对异步任务完成建立通信触发函数的管理队列，队列中放入各异步任务执行完成后需要触发的通信函数

- **宏任务与微任务**

  宏任务与微任务即产生在异步任务执行中，两种不同的任务方式，宏任务队列管理宏任务对应的通信函数，微任务则管理微任务；