## js组成

- 组成于es5/es6 + dom + bom

  es5/es6基本语法提供

  dom提供脚本方式操作文档

  bom依赖运行环境为window提供的API方法


## js理解

  - 文法： 编译原理主要强调用什么样的语法来表示，透过基本的语法，编译思想，比如将语法分析为对应的规则，AST来完成对语句的理解（分为词法，语法）

      - 词法：通过将字符串转换为token理解的独立单元，通过token独立单元映射到对应的方法生成AST树，通过AST树完成对原始语法的转换

      - 语法：预处理分析代码中的变量如何分析，如何界定范围，如何处理代码解析，时序指令定义了如何按指定的模式分析代码


  - 语义：通过文法来表达语义


  - 运行（执行）

      - 数据结构

         >  七种类型：原始类型（number string boolean symbol）+ (null undefined object)

         >  类型转换（原始类型间转换，原始类型与引用类型转换）

            原始类型：  number(有限数字，无限数字Infinity，NaN)
                      parseInt,parseFloat,Number
                      string(空字符，非空字符)
                      toString,String
                      boolean(true, false)
                      symbol(标识描述)

            转换：运算+运算模式，操作数存在字符，拼接行为
                 其他运算模式，操作数转为数字行为进行操作
                 特殊模式null,undefined,NaN,Infinity

                 比如： '' + 1 => '1'
                       1 + true
                       null + 1 => 1
                       null + 0 => 0
                       null + null => 0
                       null + undefined => NaN
                       null + Infinity => Infinity
                       null + NaN => NaN
                       undefined + undefined/NaN/Infinity => NaN
                       Infinity + Infinity => Infinity
                       Infinity*Infinity => Infinity
                       Infinity / Infinity => NaN
                       Infinity - Infinity => NaN
                       Infinity/0 => Infinity

            引用类型：object, Array

            转换: 将引用类型转为基本类型，之后再转为对应的原始类型
                 toPrimitive,valueOf,toString
                 toPrimitive可以控制操作优先权
                 toPrimitive()，本身提供了三种模式，数字，字符串，default,若是数字模式与default模式将优先valueOf,若是字符模式为toString优先，例如：alert(str) // string mode ； +type // 数字模式
                 valueOf或者toString只要转换失败则继续调用
                 Symbol.toStringTag可以设置对象类型[object, type]


                [Symbol.toPrimitive](hint) {
                  alert(`hint: ${hint}`);
                  return hint == "string" ? `{name: "${this.name}"}` : this.money;
                }


         > 类型判断

            typeof 除null以外的基本类型
            instanceOf 验证构造函数是否再对象原型链上
            Object.prototype.toString验证对象所属的类型
            constructor 验证对象指向的构造函数


      - 实例

        > 宿主对象，内置对象js内部提供的（固有对象不需要实例Math，原生对象需要实例对象Date, 普通对象Object, class）

      - 算法

        > 事件循环： 通过开启一个线程来监控和调度js主线程与异步线程完成任务的运行，将完成任务推入等待，通过事件循环来不停访问推入主线程运行

        > 微任务：即浏览器主动发起宏任务，js发起的任务为微任务，宏任务分为同异步，微任务为异步任务，由于JS引擎为单线程，主线程执行处理逻辑，每一个宏任务中优先执行同步任务,之后执行所包含的微任务，以及异步宏任务,之后进行下一个宏任务,当主线程运行完成后，通过事件循环开启下一个任务，直到所有任务队列完成

        > 函数执行：通过函数调用开启执行，形成执行调用栈，函数类型（表达式声明，函数声明，构造函数，箭头函数，async函数，generator函数）

        > 语句执行(普通语句，声明语句)

            普通语句:{if,if else,if else if,for,while,do while,for in,for of,switch,break,continue,label,try catch,表达式语句}

            声明语句:{let,const,var,class,function}



  - 运用

    - js引擎

        以谷歌V8引擎，火狐spider monkey,ie为trident,对如何解析编译理解js，加快对js的处理

    - 宿主对象(dom,bom)，内置对象js, css脚本操作依赖

    - 异步操作和请求

        回调函数 通过分散复杂功能编程，以回调来通知执行

        事件发布订阅 通过事件方式来发布订阅

        发布订阅 通过提前订阅，后期通过触发来发布，内部原理为数组的队列模式存储

        promise/async...await promise主要还是运用了回调函与异步API，async...await为promise与generator的语法糖

        generator 可以实现用户暂停和恢复，起到主动控制执行权

    - js编程思想

      1. 面向过程：面向过程成为具体化，关注编程的执行，一步一步的完成功能化操作，对流程性编程

      2. 面向对象：抽象化，非过程中的每一步，功能化一类，将客观事物抽象为一类，对外提供相关操作属性方法，
                  非细节化


      3. 设计模式：

        类与类之间关系(延伸，依赖，聚合两个类之间可分可合，组合类之间不能分离，分离不能更好运用)


        面向对象（抽象，封装，继承，多态）

          抽象：将客观事物以抽象方式表述，并提供属性和方法对其操作，
               不关心具体细节，只关注所暴露的行为操作

          封装：只暴露应该暴露的方法对外，私有方式不暴露对外，提高安全性，易用性

          继承：方法属性的公用性，方便类扩展，提高父类，子类的通用性

          多态：完成方法属性的多种行为改写，为不同的类提供不同的行为


        思想规则：

          单一规则（函数的功能具体化，一个函数只完成一个相关功能），

          开闭原则（关闭修改，开放扩展），实现低耦合，易扩展，

          里世替换 依赖抽象而不是具体事例，子类要跟随父行为准则，不能改变

          依赖倒置 依赖抽象而不是具体事例

          接口封闭 类对接口之间的依赖


        js中面向对象实现：

          原型继承（作为统一类的公共方法，可节省内存，但链过深，加剧查找销毁），

          实例继承 （作为具体对象的自身方法，浪费内存，每一次创建都会产生一个，查找速度快）

          原型 + 实例继承 公共方法用原型继承，实例方法用实例继承

          原型继承方式主要函数都具有prototype指向其原型上的方法，
          由于每一个原型都为对象具有__proto__指向所对应的构造函数上的原型，
          以prototype,__proto__实现链的方式连接，逐个查找


        设计模式运用：

        简单工厂模式：通过一个函数包装，返回一个对象实例，通过封装更好的解耦了业务逻辑
        ```js
          例一：
            let Factory = function(options){
              function Factory(options){
                for(let key in options){
                  this[key] = options[key];
                }
              }
              return new Factory(options);
            }
            const factory = Factory({name: '生成鞋子'});


          例二：
            interface JQuery {
              [index:number]: any
            }
            class JQuery {
              length: Number;
              constructor(selector){
                let elem = Array.from(document.querySelectorAll(selector));
                let length = elem ? elem.length : 0;
                for(let i=0;i<length;i++){
                  this[i] = elem[i];
                }
              }
              html(htmlText: string | undefined) {
                if (htmlText) {
                  for(let i=0;i<this.length;i++) {
                    this[i].innerHTML = htmlText;
                  }
                } else {
                    return this[0].innerHTML;
                }
            }
            interface Window {
              $: any
            }
            window.$ = function(selector: string) {
              return new JQuery(selector);
            }

            jquery库实例化案列
        ```

        工厂模式：简单工厂的复杂化，以每个类都具有一个工厂函数完成实例操作，实现多个之间分离不耦合
        ```js
          例一：
            abstract class Coffee {
              constructor(public name: string){
              }
            }

            class AmericanoCoffee extends Coffee {}

            class LatteCoffee extends Coffee {}

            class CappuccinoCoffee extends Coffee {}

            abstract class CateFactory {
              abstract createCoffee(): Coffee;
            }

            class AmericanoFactory extends CateFactory {
              createCoffee(){
                return new AmericanoCoffee('美式');
              }
            }

            class LatteFactory extends CateFactory {
              createCoffee(){
                return new LatteCoffee('拿铁');
              }
            }

            class CappuccinoFactory extends CateFactory {
              createCoffee(){
                return new CappuccinoCoffee('卡布奇诺');
              }
            }

            let amer = new AmericanoFactory();

          例二：
            // 创建了工厂函数
            function createElement(type, config) {
              return {type, props: config};
            }

            function createFactory(type: string) {
              let factory = createElement.bind(null, type);
              return factory;
            }
            let factory = createFactory('h1');
            let el = factory({id: 'h1', name: 'h1'});
        ```

        抽象工厂模式 将一类产品与同一相关产品抽象化，同一产品还是通过所对应的工厂函数来完成创建，

        // factory[createAm, createNt, createKq]抽象类 -> starBuk/luckBuk工厂函数类
        // coffee 抽象类 -> Am类，Nt类，Kq类
        // Am类，Nt类，Kq类继承coffee抽象类
        // starBuk/luckBuk 继承factory并实现具体的createAm, createNt, createKq方法，
        方法中返回Am类，Nt类，Kq类实例
        // 工厂中的公共行为都是createAm, createNt, createKq行为


        单例模式：针对实例的唯一性，不重复创建，减少对内存的消耗
        ```js
          例一：
            let Simple = (function Simple(){
              let simple;
              return function Simple (options) {
                if (!(this instanceof Simple)) {
                  return simple = new Simple(options);
                } else {
                  if (simple) {
                    return simple;
                  }else{
                    for(let key in options){
                      this[key] = options[key];
                    }
                    simple = this;
                  }
                }
              }
            })();
            const p1 = new Simple({name: '单例模式'});
            const p2 = new Simple();

            弹窗模块案列


          例二：
            class Simple {
              private static instance: Simple;
              public getInstance() {
                if (!Simple.instance) {
                  Simple.instance = new Simple();
                }
                return Simple.instance;
              }
            }
            let w1 = new Simple();
            let w2 = new Simple();
            console.log(w1.getInstance() === w2.getInstance());

            // 透明单例，不需要告诉用户需要调用什么方法来完成
            let SimpleClassTm = (function() {
              let instance;
              let SimpleClassTm = function () {
                if (!instance) {
                  instance = this;
                }
                return instance;
              }
              return SimpleClassTm;
            })()
            let w4 = new (SimpleClassTm());

          例三：
            // 单例与构建过程的分离（创建单例与类分离的，没有关系）
            // 封装单例实现多态话 通过将构造函数以参数的模式传入
            class SimpleClass {
            }
            let createSimpleClass = (function () {
              let instance: SimpleClass;
              return function (Constructor?: any) {
                if(!instance) {
                  // 下面的SimpleClass 以参数传入
                  // Constructor
                  /*
                    instance = Constructor.apply(this, arguments);
                    // instance = this;
                    Object.setPrototype(this, Constructor.prototype)
                  */
                  instance = new SimpleClass();
                }
                return instance;
              }
            })();
            let w3 = createSimpleClass();
        ```

      4. 函数运用

          函数式（高阶函数，curry化，compose,其他）

          函数式 完成函数功能上具体化，可伸展化，灵活，编写简答化

          高阶函数，以函数为返回，或者作为参数

          curry化，以缩小一个函数的功能化范围，多次产生根据参数所决定的功能，反柯理化完成功能范围扩大化，
          对操作对象实现更大使用范围上的扩张

          compose 完成流程上了控制，实现类似流自动话函数执行

      5. AST语法树
          语法树，完成对基本语言原生语法的对象话转换，在转换过程中更好的理解原生语言的特性，关系，
          方便最终转化目标的更好的理解过程，主要协助代码转换编译过程

    - js中编程

      深拷贝: 完成将对象都以基本类型拷贝来完成，不产生地址上的关联
             通过递归方式来遍历对象完成,在某些情况下JSON.stringify可以完成深度拷贝，但不全面

      浅拷贝: 对有对象引用的不做去除关联拷贝，而是直接拷贝，修改有影响
             （Object.assign, ...,）

      ```js
      function deepObject(obj, checkWeakMap){
        if (obj === null) return;
        if (typeof obj !== 'object') return obj;
        if (obj instanceOf Date) return new Date(obj);
        if (obj instanceOf Regexp) return new Regexp(obj);
        // 防止出现循环引用
        if (checkWeakMap.has(obj)) {
          return obj;
        }
        const weakMap = new WeakMap();
        weakMap.set(obj, true);
        const result = new obj.constructor;
        // 递归完成每一层的遍历
        for (let key in obj) {
          result[key] = deepObject(obj[key], weakMap);
        }
        return result;
      }
      ```




## 异步&事件环

### 一. promise

早期异步操作操作对于顺序执行控制，多个操作并发，异步错误处理，都只能通过回调方式来解决

- 优势

1. 解决异步回调嵌套过深问题

2. 多个异步操作并发处理

3. 异步错误处理的优化

- 缺点

对于异步状态发生改变后，不能更改，并且对于发起异步操作后终止问题，不能一开始就阻止，只能通过丢弃忽略操作结果

- 原理剖析

1. Promise以类的模式出现

2. 每一个promise有三种状态标识（resolve, reject, pending）,且若状态发生改变后不会再更改

3. 链式返回每一次promise对象都为一个新的promise对象

4. 返回值分为普通值(非promise对象的其他值类型)与promise对象模式，每一个返回值作为下一个promise的参数值传入

5. 错误处理的捕获不会阻断后续任务执行

6. 通过发布订阅方式完成触发

手写代码github：

### 二. iterator,generator

不管是遍历器，还是生成遍历方法，目的都是为了返回一个遍历对象，其内部有next方法，在遍历运算符调用时，会不停掉用内部next完成遍历，都是通过Symbol.iterator函数返回一个it对象

1. iterator

生成遍历器，主要的出现目的，也是为了解决数据对象的遍历统一，可以扩展遍历方式，对应扩展运算符，for of底层调用的都是通过次完成

```js
  // 类数组对象具有length和key,本身不能调用扩展运算符来遍历的,返回一个有next方法的遍历器
  // 且扩展运算循环内部会不断调next方法
  const obj = {length:2, 0: 1, 1: 2};
  obj[Symbol.iterator] = function(){
    let index=0;
    return {
      next: () => {
        return {value: this[index], done: index++ === this.length}
      }
    }
  }
```

2. generator 生成遍历器

可以更加的灵活控制遍历，内部搭配方法yield具有阻断执行，因此可以更加灵活的对异步结果处理返回

```js
  obj[Symbol.iterator] = function *(){
    let index = 0;
    while(index != this.length){
      yield this[index++];
    }
  }
```

3. co库

主要思想还是通过利用了generator的可阻断执行，来对异步操作的结果等拿到，再开启遍历将结果返回，形式上实现类似同步运行感，并通过外层返回promise对象，完成操作的扁平化，抛弃到嵌套方式回调结果，利用了promise的优势点

```js
 const read = function *() {
   const c1 = fs.readFile('./1.txt', 'utf8');
   const c2 = fs.readFile('./2.txt', 'utf8');
   return c2;
 }
 const co = function (it) {
   // 这里返回promise,解决嵌套异步问题
   return new Promise((resolve, reject) => {
     function next(d){
       // 第一次执行第一条代码
       const {value, done} = it.next(d);
       // 若还有遍历
       if (!done) {
         // 将对象包装为promise,这样对每一个处理统一，如果抛错直接结束，外部可以更方便拿到
         Promise.resolve(value).then((data)=>{
           next(data);
         }, reject)
       } else {
         // 当遍历完成value为最后的c2返回值
         resolve(value);
       }
     }
     // 实现遍历控制
     next();
   })
 }
 co(read()).then((d) => d).catch((e)=>e);
```

4. async,await

内部原理其实就是generator + co实现，完成更加遍历的使用，async await 替换掉了generator 和 co 默认async 函数执行后返回的就是一个promise

### 异步

计算机对任务的执行以进程为单位基础分配内存，所以一个进程完成一个主任务

- 浏览器

浏览器是一个多进程运行（浏览器第三方插件进程管理，网络请求进程，GPU3D动画渲染，用户界面控制进程），每一个页卡都是一个新的主进程，互不影响，（渲染进程）。

渲染进程包括：js引擎线程，gui渲染（UI渲染）线程，event loop循环事件进程，第三方各api异步线程(ajax, setTimeout, setInterval，setImmidate,click等)

js线程与ui线程为互斥线程，不会同时进行，主要保证操作的健壮性，event loop事件线程完成异步任务的调度进入主运行线程，第三方异步线程提供了各种异步执行方法运行环境。

对于js的执行理解，同步任务，异步任务，同步任务即可以按常规流程执行并完成，异步任务分（宏任务，微任务），宏任务以（script, ui渲染（此流程会优化性频繁操作问题）, requestAnimation,setTimeout, setImmidate,setInterval, click, channelMessage）,微任务（promise, mutationObserver, nextTick）,总流程为脚本主宏任务任务，在执行过程中，同步代码先完成执行，若遇到异步任务，对应放入异步任务队列(宏任务队列，微任务队列)，注意宏任务放入宏任务队列是在执行到时才放入，微任务是直接放入，同步执行完对应清空微任务，之后UI渲染，再通过event loop调度去下一个宏任务进入主线程，反复此流程

- node