## 简介

vuex是基于Vue所提供的独立的状态管理库；通过全局单例模式实现了对数据状态统一管理，对外提供变更状态的方法(commit, dispatch);主要解决了多视图依赖同一个状态，多组件之间的传递频繁，复杂，不好管理；多个视图需要各自调用行为发起状态的变更操作，行为方法不统一；通过全局独立对象管理，既可以对状态统一管理，又可以提供了统一的发起状态修改行为方法，使功能更加内聚，低耦合，管理会更好

  - vuex利用vue的响应式数据方式

  - 利用了vue中对于更新视图粒度的方式

  - 依赖于Vue

## 实现流程

- 实现Vue.use支持安装插件方式

  建立导出对象中包括install方法，将Vue传入install中，通过Vue.mixin方式混入beforeCreate钩子函数，完成在Vue.options; 将options.store对象定义到每一个子组件实例对象的实例属性$store上

- 创建Vue.Store类方法；实现原型上需要的方法commit, dispatch，replaceState,registerModule等方法

- 利用数组栈的原理，处理数据格式化，建立各数据模块之间的父子关系

- 通过建立各path之间拼接完成的路径来建立各模块数据的作用域映射关系

- 通过实例化Vue实例，将state绑定到data上，将getters上的方法通过Object.defineProperty方式转为getter,setter方式，并绑入vue实例的computed上，实现缓存

- 提供类的属性访问器state方法，对用户暴露读取state的属性访问方式， 并利用Vue.set方式动态向父对象添加状态

- 利用vm.$watch方式监测和AOP思想来监测是否直接修改state状态属性值，提供错误提醒

- 插架实现

## 设计思想

1. 发布订阅思想

  mutations,actions中定义属性和方法映射关系加入到_mutations,_actions中存储，对外提供commit, dispatch方法，通过type类型在_mutations,_actions中映射到对应方法调用执行，并传入payload修改的值，这里要注意的是，mutation主要是完成修改state操作，action主要是对mutation的一层封装，完成一些异步操作


```js
  // 简例
  let _mutations = [];

  let addMutation = function(type, fn) {
    _mutations[type] =  _mutations[type] || [];
    _mutations[type].push((payload) => {
      fn(payload);
    })
  }

  let commit = function(type, payload) {
    let mutation = _mutations[type];
    mutation && mutation(payload);
  }
  commit('start', 'hello')
```

2. 包装器切片编程（AOP）

  在处理防止在严格模式下对state状态的改变，通过vm.$watch监测state,默认开关状态为this._committing = false,更改触发watch监测报错，mutations,actions下触发,通过调用此层包装函数开启执行；切片编程的好处可以劫持提供函数功能，增加业务，但不影响老业务

```js
  this._committing = false;
  _willing(fn) {
    let _committing = this._committing;
    this._committing = true;
    fn();
    this._committing = _committing;
  }
```

3. 单例模式

  在Vue.use模式下安装插件，内部传入Vue，锁定版本，并做排除多次安装插件问题;全局状态下只有一个Vuex实例

```js
  // 简例
  // 插件实现定义方式
  let Vue
  let install = function (_Vue) {
    if (Vue) {
      return;
    }
    // 锁定传入Vue版本
    Vue = _Vue;
    // ....... 插件只安装一次
  }

  // 主vuex类定义
  class Store {
    construct(options){
      // 初始化各配置
    }
    commit(type, payload) {},
    dispatch(type, payload) {}
  }

  // 对外暴露模块
  export default {
    Store,
    install
  }

  // 应用入口导入使用
  import Vuex from 'vuex'
  let store = new Vuex.Store({
    state: {},
    mutations: {},
    actions: {},
    modules: {}
  })
  new Vue({
    store
  })

```

4. 利用栈数据结构存储，建立父子模块关系

  利用先进栈的模块会后进栈模块的父模块，利用reduce方法进行迭代

```js
  // 基本模型
  let modules = {
    state: {
      a: 1
    },
    mutations: {
      m1: function(){}
    },
    modules: {
      subA: {
        state: {
          'suba': 1
        }
      }
    }
  }

  let root;
  let register = function(path, modules) {
    let rawModule = {
      _rawModule: modules,
      state: modules.state,
      children: {}
    }
    if (!root) {
      root =  rawModule;
    } else {
      let parent = path.slice(0, -1).reduce((rawModule, key) => {
        return rawModule[key];
      }, root);
      parent['children'][path[path.length-1]] = rawModule;
    }
    // 循环子模块
    if (rawModule._rawModule.modules) {
      Object.keys(rawModule._rawModule.modules).forEach((key)=>{
        let rawChildrenModule = rawModule._rawModule.modules[key];
        register(path.concat(key), rawChildrenModule);
      })
    }
  };
  register([], modules);
  console.log(JSON.stringify(root, null, 2));
  // 结果模板
  /*
     root = {
       _rawModule: rawModule
       state: {},
       children: {
         subModule1,
         subModule2
       }
     }
  */
```

## Vuex 总结

- state 数据状态，即vue中的data数据；通过将state定义在实例的vue上，主要是完成数据的双向绑定

- getters 数据的计算属性，目的是为了可以关联到state，但可以在依赖的数据发送变化时更新；通过定义在vue实例的computed上来实现，实现了懒计算

- mutations 唯一可以触发state状态去改变，主要收集起来函数行为，订阅起来，后期发布;此方法只能执行同步逻辑

- actions 为解决异步方法执行而提供了，但在更改state变化还是需要通过触发mutation里方法来完成；内部支持异步原因是，在dispatch发布时，会以promise.all方式来等所有的订阅方法执行完成，返回是一个promise

- commit/dispatch 完成对mutations和actions来完成发布订阅的方法

- modules 模块方法主要是完成划分空间，通过namespaced标识为true来完成；在订阅mutations,actions时会遍历到当前模块是否具有该属性，如果有当前方法名会填入当前模块的key来完成，例如：modules:{namespaced: true,a:{mutations:{age(){}}}}; -> a/age: fn

- plugins 完成自定义一些功能，注入到vuex中，基本思想也是通过发布订阅来完成，插件即一个函数，内部会订阅函数，并执行传入实例store;用户内部会调用store.subscribe完成订阅；并在mutation的commit触发后执行

- strict 严格模式，主要是防止直接修改state属性而开启，通过vue.$watch监测store._vm._data.$$state属性，vue对于$开头的属性不会代理到实例上。

- registerModule 注册新模块，重新调用register方法，installModule, restoreVm