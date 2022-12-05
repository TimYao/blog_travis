## vue介绍
mvvm模式开发：module, view, viewModule; module为数据模型，view为模板，viewModule为衔接module与view之间的桥梁，真正的mvvm模式是只能通过这个桥梁来双方通信，vue由于可以通过直接操作dom，所以并不是完全的mvvm模式，早期后端通过mvc模式来完成开发，通过用户访问view，通过control导航到路由，完成逻辑编写，并建立起读取数据完成数据更新并最后返回到指定模板完成渲染

## vue关联

- Vue组件

- VueRouter

- Vuex

- Vue-cli

## Vue基本

## vue源码

  - 双向响应
  1. Object.defineProperty完成对对象getter,setter方法
  2. 对数组push，unshift,splice,重写，并对数组中的对象完成getter,setter方法重新
  3. 所监测的对象均添加__ob__属性指向所属observer对象实例
  4. 对具有__ob__属性对象进行依赖收集，目的当数据发送变化通知所对应的watcher完成更新

  总结：对象中get中完成依赖收集，set中完成watcher通信更新，所谓的双向响应即对数据通过观察者模式，在对数据建立唯一的被观察者，并通过watcher建立观察者，被观察者注册观察者，建立一个多对多的映射关系，当数据发生改变则通知watcher更新，当模板更新后会通过get读取对应数据

  问题点：不对数组索引做监测，通过索引改变值不会被监听，数组长度也不会监听

  解决方式：Vue.set，Vue.delete 解决，
          数组通过splice方法完成对新填入的值通知watcher更新
          若操作的对象之前为监听过的对象存在__ob__，则通过Object.defineProperty来触发set方法通知watcher更新，属性重新取值

  ```js
  export function set (target: Array<any> | Object, key: any, val: any): any {
    if (process.env.NODE_ENV !== 'production' &&
      (isUndef(target) || isPrimitive(target))
    ) {
      warn(`Cannot set reactive property on undefined, null, or primitive value: ${(target: any)}`)
    }
    if (Array.isArray(target) && isValidArrayIndex(key)) {
      target.length = Math.max(target.length, key)
      target.splice(key, 1, val)
      return val
    }
    if (key in target && !(key in Object.prototype)) {
      target[key] = val
      return val
    }
    const ob = (target: any).__ob__
    if (target._isVue || (ob && ob.vmCount)) {
      process.env.NODE_ENV !== 'production' && warn(
        'Avoid adding reactive properties to a Vue instance or its root $data ' +
        'at runtime - declare it upfront in the data option.'
      )
      return val
    }
    if (!ob) {
      target[key] = val
      return val
    }
    defineReactive(ob.value, key, val)
    ob.dep.notify()
    return val
  }

  /**
   * Delete a property and trigger change if necessary.
   */
  export function del (target: Array<any> | Object, key: any) {
    if (process.env.NODE_ENV !== 'production' &&
      (isUndef(target) || isPrimitive(target))
    ) {
      warn(`Cannot delete reactive property on undefined, null, or primitive value: ${(target: any)}`)
    }
    if (Array.isArray(target) && isValidArrayIndex(key)) {
      target.splice(key, 1)
      return
    }
    const ob = (target: any).__ob__
    if (target._isVue || (ob && ob.vmCount)) {
      process.env.NODE_ENV !== 'production' && warn(
        'Avoid deleting properties on a Vue instance or its root $data ' +
        '- just set it to null.'
      )
      return
    }
    if (!hasOwn(target, key)) {
      return
    }
    delete target[key]
    if (!ob) {
      return
    }
    ob.dep.notify()
  }
  ```

 - Vue.options

   全局
   Vue.options[components/filters/directives]

   components增加入keep-alive组件

   ```js
    extend(Vue.options.components, builtInComponents)
   ```
   指向大vue
   ```js
    Vue.options._base = Vue
   ```

   全局下方法:

   // 提供改变或增加对象属性操作，并保持监听，
   // 数组通过splice操作，对象则通过常规方式
   // 这两个方法中均提供了ob.dep.notify()发布watcher更新
   Vue.set = set
   Vue.delete = del

   // 提供异步渲染
   Vue.nextTick = nextTick

   Vue.use
   Vue.mixin
   Vue.extend
   Vue.component/filter/directive

   ```js
    initUse(Vue) // plugin.install(Vue, args)

    initMixin(Vue)
    export function initMixin (Vue: GlobalAPI) {
      Vue.mixin = function (mixin: Object) {
        this.options = mergeOptions(this.options, mixin)
        return this
      }
    }

    initExtend(Vue)
    export function initExtend (Vue: GlobalAPI) {
      /**
       * Each instance constructor, including Vue, has a unique
      * cid. This enables us to create wrapped "child
      * constructors" for prototypal inheritance and cache them.
      */
      Vue.cid = 0
      let cid = 1

      /**
       * Class inheritance
      */
      Vue.extend = function (extendOptions: Object): Function {
        extendOptions = extendOptions || {}
        const Super = this
        const SuperId = Super.cid
        const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {})
        if (cachedCtors[SuperId]) {
          return cachedCtors[SuperId]
        }

        const name = extendOptions.name || Super.options.name
        if (process.env.NODE_ENV !== 'production' && name) {
          validateComponentName(name)
        }

        const Sub = function VueComponent (options) {
          this._init(options)
        }
        Sub.prototype = Object.create(Super.prototype)
        Sub.prototype.constructor = Sub
        Sub.cid = cid++
        Sub.options = mergeOptions(
          Super.options,
          extendOptions
        )
        Sub['super'] = Super

        // For props and computed properties, we define the proxy getters on
        // the Vue instances at extension time, on the extended prototype. This
        // avoids Object.defineProperty calls for each instance created.
        if (Sub.options.props) {
          initProps(Sub)
        }
        if (Sub.options.computed) {
          initComputed(Sub)
        }

        // allow further extension/mixin/plugin usage
        Sub.extend = Super.extend
        Sub.mixin = Super.mixin
        Sub.use = Super.use

        // create asset registers, so extended classes
        // can have their private assets too.
        ASSET_TYPES.forEach(function (type) {
          Sub[type] = Super[type]
        })
        // enable recursive self-lookup
        if (name) {
          Sub.options.components[name] = Sub
        }

        // keep a reference to the super options at extension time.
        // later at instantiation we can check if Super's options have
        // been updated.
        Sub.superOptions = Super.options
        Sub.extendOptions = extendOptions
        Sub.sealedOptions = extend({}, Sub.options)

        // cache constructor
        cachedCtors[SuperId] = Sub
        return Sub
      }
    }

    initAssetRegisters(Vue)
    export function initAssetRegisters (Vue: GlobalAPI) {
      /**
       * Create asset registration methods.
      */
      ASSET_TYPES.forEach(type => {
        Vue[type] = function (
          id: string,
          definition: Function | Object
        ): Function | Object | void {
          if (!definition) {
            return this.options[type + 's'][id]
          } else {
            /* istanbul ignore if */
            if (process.env.NODE_ENV !== 'production' && type === 'component') {
              validateComponentName(id)
            }
            if (type === 'component' && isPlainObject(definition)) {
              definition.name = definition.name || id
              definition = this.options._base.extend(definition)
            }
            if (type === 'directive' && typeof definition === 'function') {
              definition = { bind: definition, update: definition }
            }
            this.options[type + 's'][id] = definition
            return definition
          }
        }
      })
    }
   ```

   options合并策略

   Vue.options, {extends:{}, mixins:[{}], other}
   ```js
    export function mergeOptions (
      parent: Object,
      child: Object,
      vm?: Component
    ): Object {

      if (typeof child === 'function') {
        child = child.options
      }

      if (!child._base) {
        if (child.extends) {
          parent = mergeOptions(parent, child.extends, vm)
        }
        if (child.mixins) {
          for (let i = 0, l = child.mixins.length; i < l; i++) {
            parent = mergeOptions(parent, child.mixins[i], vm)
          }
        }
      }

      const options = {}
      let key
      for (key in parent) {
        mergeField(key)
      }
      for (key in child) {
        if (!hasOwn(parent, key)) {
          mergeField(key)
        }
      }
      function mergeField (key) {
        const strat = strats[key] || defaultStrat
        options[key] = strat(parent[key], child[key], vm, key)
      }
      return options
    }
   ```

   生命周期将多个合并为数组，watch合并多个为数组

   methods，props,inject, computed合并替换

   provide与data方式一样

   components/directives/filters 子组件合并到父组件上，父组件为原型，子组件自身属性

   data属性 数据合并,没有的合并，重复的将以首为主

 - 双向响应(Object.defineProperty/依赖收集)

    被观察者Dep 与 Watcher 观察者

    <strong>关于watcher 三种模式 渲染watcher,用户watcher,计算属性watcher</strong>

    1. 渲染watcher主要是组件产生时会对应一个watcher,会与组件中相关渲染属性进行产生依赖收集，没一个data属性将产生一个dep，dep会收集对应的watcher,当变化是会触发对应watcher进行update，并子更新结束再次取的新值渲染

    2. 用户watcher主要是针对用户自己添加观察的数据属性变化，在首次会运行得到老值存储，并建立了观察属性与用户watcher之间的依赖收集，当观察的属性变化后会触发对应的watcher进行变化，这样会再次执行用户watcher对应的expOrFn,并最后掉用cb，回调到handler指向的函数中将新值与老值返回,即用户watcher与属性dep产生依赖收集，dep注册了用户watcher

    3. computed watcher,通过首次对每一个computed创建对应的computed watcher,并存储起来，并为每一个computed建立关联了get,set属性，主要是提供后期调用触发计算，并触发之前存储对应的watcher,由于在初始化是定义为lazy，只会在get时触发执行，并将dirty置为false,防止多次触发，在调用执行时候会创建computed watcher与属性dep之间建立依赖收集，所以当属性发送变化后会触发对应收集watcher进行更新操作，在更新操作我们将dirty设置为true,通知为值的变化，这样就更新完成，在完成对computed watcher操作后，并建立其所关联的属性dep与渲染watcher建立关联，触发渲染watcher更新操作

 - 生命周期执行

   ```js
    // 建立组件父子关系，以及挂载函数等的暴露
    initLifecycle(vm)

    // 对父组件传递的事件进行更新替换_parentListeners
    initEvents(vm)
    // 完成$on订阅事件存储
    vm._events = Object.create(null)
    (vm._events[event] || (vm._events[event] = [])).push(fn)

    const listeners = vm.$options._parentListeners
    if (listeners) {
      updateComponentListeners(vm, listeners)
    }

    // $on $once $off $emit
    $on //订阅存储
    $once // 执行一次释放
    function on () {
      vm.$off(event, on)
      fn.apply(vm, arguments)
    }
    on.fn = fn
    vm.$on(event, on)

    $off
    // 无指定清除事件，全部重置 vm._events = Object.create(null)
    // 找到指定事件订阅数组做清除，在指定了事件和函数，做数组的splice方法排除掉

    $emit
    // let cbs = vm._events[event]
    // invokeWithErrorHandling(cbs[i], vm, args, vm, info) 分别执行函数

    // 对父子节点之间的关系处理，以及虚拟节点方法的定义
    initRender(vm) // 待不冲插槽
    // 虚拟节点方法的定义,后期会调用创建虚拟节点
    vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
    // 对父组件传递过来的 $attrs $listeners 进行设置
    defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, null, true)
    defineReactive(vm, '$listeners', options._parentListeners || emptyObject, null, true)


    callHook(vm, 'beforeCreate')
    // beforeCreate前基本实现的初始化父子组件关系，基本事件的处理和父子组件事件传递，基本渲染需要的函数定义，插槽的处理


    // 对inject注入的初始化
    initInjections(vm)
    const result = resolveInject(vm.$options.inject, vm) // 监测是否参数有inject，且格式为数组格式，会有多个提供
    toggleObserving(false) // 不对其值为对象开启观测，保持原状态情况
    defineReactive(vm, key, result[key]) // 将值定义到实例对象上
    toggleObserving(true) // 操作完成从新开启


    // 对data,methods,computed,props,watcher等初始化处理
    initState(vm)
      // 属性处理
      if (opts.props) initProps(vm, opts.props)
      // 方法处理
      if (opts.methods) initMethods(vm, opts.methods)
      // 核心内容
      vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm)

      // 数据处理
      if (opts.data) {
        initData(vm)
      } else {
        observe(vm._data = {}, true /* asRootData */)
      }
      // 完成了数据对象类型劫持重新get,set方法，
      // 数组方法重新，实现push,unshift,splice对插入内容的是否观察
      // 依赖收集
      // 并完成发布更新watcher
      // 代理data属性到私有属性_data


      // 计算器处理
      if (opts.computed) initComputed(vm, opts.computed)
      // 核心
      // 后期存储实例化的watcher
      const watchers = vm._computedWatchers = Object.create(null)
      // 读取传入computed的方式
      const getter = typeof userDef === 'function' ? userDef : userDef.get
      // 建立对应watcher
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions //{ lazy: true }
      )
      // 放入实例
      if (!(key in vm)) {
        defineComputed(vm, key, userDef)
      }
      export function defineComputed (
        target: any,
        key: string,
        userDef: Object | Function
      ) {
        const shouldCache = !isServerRendering()
        if (typeof userDef === 'function') {
          sharedPropertyDefinition.get = shouldCache
            ? createComputedGetter(key)
            : createGetterInvoker(userDef)
          sharedPropertyDefinition.set = noop
        } else {
          sharedPropertyDefinition.get = userDef.get
            ? shouldCache && userDef.cache !== false
              ? createComputedGetter(key)
              : createGetterInvoker(userDef.get)
            : noop
          sharedPropertyDefinition.set = userDef.set || noop
        }
        if (process.env.NODE_ENV !== 'production' &&
            sharedPropertyDefinition.set === noop) {
          sharedPropertyDefinition.set = function () {
            warn(
              `Computed property "${key}" was assigned to but it has no setter.`,
              this
            )
          }
        }
        // 关联计算方式
        Object.defineProperty(target, key, sharedPropertyDefinition)
      }
      // 缓存下
      function createComputedGetter (key) {
        return function computedGetter () {
          const watcher = this._computedWatchers && this._computedWatchers[key]
          if (watcher) {
            if (watcher.dirty) {
              watcher.evaluate()
            }
            if (Dep.target) {
              watcher.depend()
            }
            return watcher.value
          }
        }
      }
      // 非缓存下
      function createGetterInvoker(fn) {
        return function computedGetter () {
          return fn.call(this, this)
        }
      }
      // 总结，初始状态下得到computed方式有两种，一种直接函数，一种是通过setter,getter方式定义，取到对应通过定义实例化watcher,并存储起来，通过object.defineProperty关联设置，可以在读取值情况下进行运算，定义中读取上一次存储的watcher，并判断watcher.dirty,即初始化传入的lazy值的变化来调用运行watcher，内部会调用expOrFn



      // watch处理
      if (opts.watch && opts.watch !== nativeWatch) {
        initWatch(vm, opts.watch)
      }
      // 对watch传入参数扁平化
      function initWatch(vm, watch){
        for(const key in watch){
          const handler = watch[key];
          if (Array.isArray(handler)) {
            for(let i=0;i<handler.length;i++){
              createWatcher(vm, key, handler[i])
            }
          } else {
            createWatcher(vm, key, handler);
          }
        }
      }
      function createWatcher(vm, expOrFn, handler, options){
        if (isPlainObject(handler)) {
          options = handler
          handler = handler.handler
        }
        if (typeof handler === 'string') {
          handler = vm[handler]
        }
        return vm.$watch(expOrFn, handler, options)
      }
      Vue.prototype.$watch = function(expOrFn, cb, options){
        const vm: Component = this
        if (isPlainObject(cb)) {
          return createWatcher(vm, expOrFn, cb, options)
        }
        options = options || {};
        options.user = true;
        const watcher = new Watcher(vm, expOrFn, cb, options);
        if (options.immediate) {
          try {
            cb.call(vm, watcher.value)
          } catch (error) {
            handleError(error, vm, `callback for immediate watcher "${watcher.expression}"`)
          }
        }
        // 释放watcher监测
        return function unwatchFn () {
          watcher.teardown()
        }
      }
      //总结：vm.$watch/{watch:[]/{}/string},用的是同一个内部方法vm.$watch，内部就是创建了一个用户watcher，内部去执行，并当设置了immediate时触发cb返回watcher.value值返回到cb，若没有定义立即，在初次我们已经收集依赖，等变化，触发setter，触发更新watcher的update run方法完成执行，并将值通过cb回调回去

      // watch,computed区别
      // watch 第一次会执行，computed第一次不执行
      // computed在调用是执行
      // computed运用在模板计算


    // 对provide 提供的暴露方法的初始化,写入到实例下私有属性_provide
    initProvide(vm)
    export function initProvide (vm: Component) {
      const provide = vm.$options.provide
      if (provide) {
        vm._provided = typeof provide === 'function'
          ? provide.call(vm)
          : provide
      }
    }
    // 方法resolveInject建立完成查找inject注入的参数对应于provide
    // 一是根据inject的key从vm实例上递归读取vm._provided属性对应的key值直到找到
    // 二是，没有vm实例情况下从inject默认赋值情况
    const provideDefault = inject[key].default
    result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault

    // 启动created生命周期方法执行
    callHook(vm, 'created')


    // 这里完成对渲染方式的判断
    // render, template, el.outInnerHTML
    callHook(vm, 'beforeMount')

   ```

  生命周期流程
    - initLifecycle 初始化建立了相关父子关系
    - initEvents 初始化建立了事件基本参数量以及父事件传递
    - initRender 初始化了插槽解析，相关渲染方法，父子节点关系
    - beforeCreate

    - initInjections 完成解析inject参数的查找，并绑入实例
    - initState 完成data,props,method,computed,watch
        对data完成劫持改写get,set方法，并建立属性与watcher依赖收集,数组方法重写，完成响应原理
        props:对数据的格式化，校验，并劫持重新属性get,set,对属性值为对象的建立的观察，代理到实例vm._props
        method:校验，完成关联到实例上
        computed: 对属性设置为get,set方式，并建立watcher，缓存watcher
        watch: 对属性实现观察更改，内部调用的vm.$watch,内部实现创建建立用户watcher，首次执行记录老值，并收集了依赖，后期完成变动触发watcher更新
    - initProvide 执行provide方法返回对象挂载到vm._provide
    - created

    - vm.$options.el开启编译挂载
      vm.$mount 内部会区分出runtime模式还是complier with runtime
    - vm.$mount决定渲染方式render,template, el.outHTML
    - beforeMount

    - beforeUpdate watcher更新渲染前
    - updated watcher更新渲染完成

    - 渲染watcher建立，真是节点创建,挂载完成
    - mounted

 - 渲染挂载

   控制开启挂载
   ```js
    // vm.$options.el 参数的存在决定是否启动挂载功能
    // vm.$options.el 指向DOM节点，标签
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }

    Vue.prototype.$mount = function (
      el?: string | Element,
      hydrating?: boolean
    ): Component {
      el = el && inBrowser ? query(el) : undefined
      // 这里entry-time-width-complier.js
      if (!vm.$options.render) {
        let template = vm.$options.template;
        // 这里存在template（#，Dom节点）
        if (!template) {
          template = vm.$options.el.outerHTML
        }
      }

      const { render, staticRenderFns } = compileToFunctions(template, {
        outputSourceRange: process.env.NODE_ENV !== 'production',
        shouldDecodeNewlines,
        shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments
      }, this);
      options.render = render
      options.staticRenderFns = staticRenderFns

      return mountComponent(this, el, hydrating)
    }


   ```

   mountComponent定义：

    1. 完成渲染方式的判断 render方式，template, el.outInnerHtml

    2. render方式不需要编译模板，直接产生虚拟DOM
    template, el.outerHTML需要模板编译转换为ast树，完成最后将ast转换为渲染函数，通过渲染函数得到虚拟DOM

    ```js
      vm.$el = el // 指定的DOM标签


      callHook(vm, 'beforeMount')

      new Watcher(vm, updateComponent, noop, {
        before () {
          if (vm._isMounted && !vm._isDestroyed) {
            callHook(vm, 'beforeUpdate')
          }
        }
      }, true) // 这里是标注为渲染watcher

      before 方法将在更新操作前触发

      updateComponent = () => {
        // vm._render() 虚拟节点完成生成
        // vm._update虚拟节点转为dom节点
        vm._update(vm._render(), hydrating)
      }

      // 挂载完成
      if (vm.$vnode == null) {
        vm._isMounted = true
        callHook(vm, 'mounted')
      }
      return vm
    ```

    vm._render方法产生虚拟节点的完成：
    ```js
      // 绑定
      // Vue.prototype._render
      // Vue.prototype.$nextTick
      renderMixin(Vue);
      // vm._render() 触发以下
      Vue.prototype._render = function() {
        // render为编译后写入原型上的方法，渲染函数
        const { render, _parentVnode } = vm.$options
        // render = vm.$options.render

        // 对外暴露的render
        // vm.$createElement 暴露出的h方法
        vnode = render.call(vm._renderProxy, vm.$createElement)
      }

      // 更新DOM节点生成 核心代码
      Vue.prototype._update = function (vnode) {
        const vm = this;
        // 标签元素节点
        const prevEl = vm.$el
        // 记录前一个虚拟节点
        const prevVnode = vm._vnode
        // 虚拟节点记录到vm上
        vm._vnode = vnode
        // 初始渲染
        if (!prevVnode) {
          vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
        } else {
          // update
          vm.$el = vm.__patch__(prevVnode, vnode);
        }
      }

    ```

    vm.__patch__ 完成真是节点创建虚拟节点比对，组件的创建

    ```js
      // oldVnode不存在为组件创建，存在分为真是元素标签和非真实即上一次的虚拟节点
      // 核心代码
      function patch(oldVnode, vnode, hydrating, removeOnly){

        // 不存在新虚拟节点，销毁老节点
        if (isUndef(vnode)) {
          if (isDef(oldVnode)) invokeDestroyHook(oldVnode)
          return
        }
        // 不存在老节点，即创建组件
        if (isUndef(oldVnode)) {
          isInitialPatch = true
          createElm(vnode, insertedVnodeQueue)
        } else {
          // 是否为真是DOM节点，初次渲染节点为el提供的标签
          const isRealElement = isDef(oldVnode.nodeType)
          // 不是真是DOM节点，比对过程，即新老虚拟节点比对
          if (!isRealElement && sameVnode(oldVnode, vnode)) {
            patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly)
          } else {
            if (isRealElement){
              // 是否为服务器渲染模式
              // SSR_ATTR = data-ssr-render
              if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
                oldVnode.removeAttribute(SSR_ATTR)
                hydrating = true
              }
              oldVnode = emptyNodeAt(oldVnode)

              // 拿到当前节点父节点和自己
              const oldElm = oldVnode.elm
              const parentElm = nodeOps.parentNode(oldElm)
              // create new node
              createElm(
                vnode,
                insertedVnodeQueue,
                // extremely rare edge case: do not insert if old element is in a
                // leaving transition. Only happens when combining transition +
                // keep-alive + HOCs. (#4590)
                oldElm._leaveCb ? null : parentElm,
                nodeOps.nextSibling(oldElm)
              )
            }
          }
        }
      }
    ```



    强制更新
    ```js
      Vue.prototype.$forceUpdate = function () {
        const vm: Component = this
        // vm._watcher 渲染watcher
        if (vm._watcher) {
          vm._watcher.update()
        }
      }
    ```

    销毁
    ```js
      Vue.prototype.$destroy = function () {
        // vm._isBeingDestroyed标识是否销毁了
        if (vm._isBeingDestroyed) {
          return
        }
        // 若父级没销毁，从父级孩子中移除销毁实例
        if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
          remove(parent.$children, vm)
        }

        // 销毁渲染watcher，每个组件都有一个渲染watcher
        if (vm._watcher) {
          vm._watcher.teardown()
        }
        // 销毁关联的watcher列表
        let i = vm._watchers.length
        while (i--) {
          vm._watchers[i].teardown()
        }
        // 移除引用数据引用，观察后产生__ob__
        // vmCount根数据下存在
        if (vm._data.__ob__) {
          vm._data.__ob__.vmCount--
        }

        // 标识为销毁
        vm._isDestroyed = true

        // 释放当前存储的虚拟节点
        vm.__patch__(vm._vnode, null)

        // 触发销毁生命周期方法
        callHook(vm, 'destroyed')

        // 去除所有事件
        vm.$off()
        // 移除引用
        if (vm.$el) {
          vm.$el.__vue__ = null
        }
        if (vm.$vnode) {
          vm.$vnode.parent = null
        }
        // 释放父节点引用
        if (vm.$vnode) {
          vm.$vnode.parent = null
        }
      }
    ```



## vue重点

- watch原理
首先组件中建立watch以及Vue.watch实现方式均为实例上vm.$watch方法完成，实例方法通过标识watcher类型为user类型并调用了watcher类

1. watch参数模式string(指向methods下关联方法)，数组(多个关联)，对象，对参数扁平化处理，对应找到handler对应方法
2. 标识watcher类型为user,创建watcher
3. 第一个执行在解析了expOrFun后会对属性dep依赖收集用户watcher.并保留第一次执行结果值
4. 在监测属性值变化后触发对应dep收集的watcher进行执行，重新获取到expOrFun执行结果，将老值与新值返回给回调handler方法

- computed原理
首先computed的实现也是基于watcher类的实现，只是初始状态不执行，在产生计算调用后触发，并有缓存，关联的属性不变化不会重复计算

1. computed参数方式为两种，直接函数模式即默认为get方式，第二种直接声明出set,get方式的对象模式
2. 建立缓存computed对象vm._computedWatchers，作为存储computed对应属性建立的watcher实例存放
3. 通过computed参数方式，重写get,set方式，并通过key关联到对应的存储创建watcher,并标识lazy标识watcher为计算watcher
4. watcher类内部会记录lazy标识，dirty标识，初次不执行，属性发生调用通过get会收集对应的计算watcher，在变化后会触发对应收集watcher执行，过程中每一次会对dirty在watcher执行重置为true执行
5. 计算watcher执行完成后会出栈，计算属性在模板中使用会关联渲染watcher与计算属性依赖属性，在依赖属性变化后，渲染watcher会更新视图

watcher 与 computed都是通过watcher来完成，computed具有缓存效应(默认不执行)，当调用是发生，内部依靠了dirty变量来实现缓存，watch默认会执行一次，属性值变化后触发回调函数,两者的watcher类型不同的

- assets 目录 与 static 目录

- vue中的观察者模式
内部通过对数据属性进行了劫持并重新了get,set方法，每一个属性在get方法中进行了创建一个dep来依赖收集当前的watcher，也就是注册观察者，在set方法中属性变化会通知所收集的watcher，watcher会通过update方法来更新观察的属性变化，从而实现了观察者模式，总结来说就是通过get,set方式注册了watcher观察者并发布watcher执行，也是发布订阅的方式

对于发布订阅与观察者区别，发布订阅之间不产生直接关联耦合，各自完成各自的任务，通过第三放来存储订阅，观察者模式建立在观察者与被观察者之间，彼此有耦合关系，被观察者的订阅方式会在被观察者内部完成，在发布状态下会内部通知观察者来完成发布，只有两方来完成这一流程，观察者模式也是发布订阅

- vue 中的设计模式(重点)

  工厂模式 - 传入参数即可创建实例，完成类的一系列方法属性

      vue的实例化产生的实例方式，每一个实例都是独立的，都有自己的方法属性


  单例模式 - 只有一份，每一个实例只会创建一次，不会重复创建

      computed创建一个watcher，下次调用执行，从存储vm._computedWatchers下拿到之前的实例做操作


  发布-订阅模式

      生命周期钩子函数的存储和执行

      事件的发布订阅


  观察者模式

      体现在响应式原理方面，通过属性get进行dep收集watcher,set完成通知watcher更新


  适配器模式 - 抹平平台差异


  外观模式 - 兼容浏览器的方法


  代理模式 (防抖和节流) => 返回替代


  装饰模式 =>增强自己

    aop编程思想，数组的方法重写中利用了重写增强数组原生方法功能；数据响应式对对象的劫持也是利用了这种模式


  中介者模式 => vuex

  迭代器模式 => 顺序访问一个元素 forEach

  模板方法模式 => 插槽

- v-if/v-for优先级
通过vue-template-compiler插件可以看出，v-for高于v-if，每一次循环都会重复产生if判断

- 生命周期钩子函数(重点)
  通过在options合并钩子函数，在指定的初始化位置执行订阅的钩子函数,将用户编写的钩子函数根据生命周期名字分类分别放到数组中，调用callHook时依次执行对应的数组中的方法
  ```js
  callHook(vm, 'beforeDestroy')
  callHook(vm, 'destroyed')

  export function callHook (vm: Component, hook: string) {
    pushTarget()
    const handlers = vm.$options[hook]
    const info = `${hook} hook`
    if (handlers) { // 循环执行所有钩子方法
      for (let i = 0, j = handlers.length; i < j; i++) {
        invokeWithErrorHandling(handlers[i], vm, null, vm, info)
      }
    }
    if (vm._hasHookEvent) {
      vm.$emit('hook:' + hook)
    }
    popTarget()
  }
  ```

  生命周期：

  beforeCreate: 实例初始化后，建立了一些初始化准备操作

  created: 实例创建完成后，数据的观测，方法属性运算，watch/event 事件回调,这里没有$el
  因为它是最早触发的原因可以进行一些数据，资源的请求

  beforeMount: 在挂载开始之前被调用：相关的 render 函数首次被调用, 对模板的渲染方式的选择

  mounted: el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用该钩子
  可以进行一些DOM操作

  beforeUpate: 数据更新时调用，发生在虚拟 DOM 重新渲染和打补丁之前
  可以在这个钩子中进一步地更改状态，这不会触发附加的重渲染过程

  updated： 由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。
  可以执行依赖于 DOM 的操作。然而在大多数情况下，你应该避免在此期间更改状态，因为这可能会导致更新无限循环。 该钩子在服务器端渲染期间不被调用

  beforeDestroy： 实例销毁之前调用。在这一步，实例仍然完全可用

  destroyed：实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁。 该钩子在服务器端渲染期间不被调用
  可以执行一些优化操作,清空定时器，解除绑定事件


## 组件通信状态管理

  - 父子组件props emit
    1. 子组件上定义props传递父信息，子组件上绑定事件,子组件内部通过emit触发子组件事件
    2. 通过$parent,$children可以互访问，不建议使用
    3. $attrs $listeners传入，这在子组件上绑定的方法和静态属性都会传入子组件内，可以通过inheritAttr来设置子组件根实例是否继承显示属性

  - 平级组件通过父组件桥梁通信
    1. 通过props,emit方式传递到父,通过props传递到子
    2. 通过props,emti方式传递到父，通过ref指向子实例下方法或属性传入

  - 夸组件通信
    1. provide, inject，父子多级关系，通过provide暴露出父实例，子组件注入使用
    2. 多级无关系组件通信，通过$dispatch,$broadcast方式自定义递归向上找和向下找指定组件上绑定的方法
    3. event bus这种方式会触发所有的绑定的触发事件,独立一个vue实例订阅事件，并在不同的情况下，调用$emit发布事件

  - 组件状态统一管理
    1. 通过vuex方式，针对复杂和大型的数据，状态管理
    2. Vue.observable模拟vuex来实现


## vuex
  1. 表达出对单向数据流的概念，及整个vuex的运行流程
  2. 状态集中管理，实现多组件状态共享
  3. Vuex的原理是通过new Vue产生实例，达到响应式数据变化的目的
  4. 多组件间通信，无法持久化数据

## Vue.extend 和 Vue.mixin
  1. Vue.extend 返回Vue构造器,创建子类 应用场景：可以手动挂载组件
  2. Vue.mixin 实现混入逻辑 内部mergeOptions 应用场景：抽离公共方法
  3. 组件中的extends是扩展一个，mixins可以扩展多个

## keep-alive
 完成对组件的缓存，不需要每次重新创建，思路是当前keep-alive组件上创建了cache = {},keys=[];来存储对应的插槽组件的虚拟DOM和
key，key值根据组件中定义的key或者是组件的cid+tag拼接而成，创建过程中去对cache查找匹配，不存在就存入，存在就取出，若设置了max，过大时会清理内部第一个长久不使用的组件虚拟节点

## Vue总结点

**1. vue 响应式原理**

  数据响应式，通过对对象和数组进行创建观测对象，递归观测每一个对象和数组

  - 对象

    对对象进行创建观测，并建立一个dep对象，遍历观测对象的每一个属性，对为对象格式的属性值同样进行观测对象创建与dep创建，属性也会创建相应的dep，对对象属性进行劫持通过Object.defineProperty添加getter,setter,getter完成建立属性对应dep对视图watcher的收集；setter当修改属性值时通过属性对应的dep触发收集的watcher调用更新

  - 数组

    对数组对象进行创建观测对象，并建立一个dep对象，重新数组的(shift,unshift,push,pop,splice,reverse,sort)方法内部调用原始数组的方法，数组的依赖收集产生在getter中，当一次是属性对应属性值为数组时，会对数组进行创建观测对象，并在getter中会建立数组本身收集watcher，并当为数组时会遍历数组每一个值，进行观测对象建立；数组的触发更新在数组重写方法中，获取到填入的值，对值进行创建观测对象，并获取到数组上的ob找到对应的dep对象发起通知收集watcher来进行更新视图

  - 技术点

    - 不管是对象还是数组，都会为其创建observer对象，并会创建dep实例，作为收集存储
    - 对象通过Object.defineProperty重新属性getter（收集watcher）,setter(通知watcher更新),建立dep与watcher之间的互相收集
    - 对数组进行重写数组更改数组的方法，并对新添加的值进行观测，并调用了数组ob.dep.notify()方法去通知视图更新

    通过对对象添加Dep,来隐射到多个属性值，dep关联了watcher,通过属性值变化，对于到关联的dep，dep完成对应watcher进行渲染（通过属性的setter来触发）；对于数组不劫持索引和长度问题，以及后期添加对象不劫持问题，一是通过vue.set,或者通过重新已经观察的对象中的值；对于数据的观察当属性大量化了会有性能问题，不建议过于深层嵌套对象


**2. vue 模板编译**

  通过将模板编译成render函数，后期通过执行render函数执行返回虚拟节点；模板的编译通过正则分词，状态机分词等，vue采用了第一种方式正则分词，转换为ast抽象语法树，ast主要是以对象格式描述了原生的模板，内部描述个模板节点的父子关系，节点类型，属性信息，最后将ast转换为新的可执行脚本模板字符串，通过不同的节点类型调用相应的函数创建，并通过new Function创建为可运行脚本保存为render

  - 技术点

    - 通过parse,parseHTML,完成对原始模板进行正则分词，转换为ast

    - 将ast对象描述的格式根据标签类型转换为对应内置提供的函数调用，最终拼接为新的脚本字符串，通过new Function封装为render函数，供后期调用

    补充：静态节点标记，通过对每一个ast后节点的每一个属性判断(非绑定，非if,非组件，非for,是保留标签，文本节点类型)是静态标记，并递归孩子节点，如果孩子节点不是静态节点则重新将父节点置为非静态节点（node.static）

**3. vue 生命周期钩子**

  生命周期钩子本质就是函数，通过将不同时间段需要执行的函数以数组方式存储起来，在后期在需要执行的地方进行遍历调用各个函数执行；Vue内部通过callHook方法来调用对应方法，所有的钩子函数存储在vm.$options上;运用了发布订阅思想，先订阅存储，后发布触发


**4. Vue.mixin使用场景和原理**

  主要抽离公共业务功能，当组件初始化时，会通过mergeOptions方法进行合并，采用策略方式针对不同的属性进行合并。数据合并策略当出现重复时，以组件数据优先，采用就近原则

  补充：mergeOptions合并策略，生命周期钩子以数组方式将父和子进行合并；数据以将组件没有数据从复制父中的数据，若子存在则以子为主；属性，方法，计算属性，注入方式都是以对象同名key替换，子替换父；组件，指令，过滤器都以子继承父的方式组合；

  ```js

    options: {
       el,
       props:[]
       data()=>{},
       method:{
       },
       computed:{},
       inject:[],
       component:{
         ...,
         _proto_: components:{keep-live}
       },
       watch: {
         a:[]
       },
       beforeCreate: []
    }

  ```

**5. nextTick在哪里使用?原理是?**

  nextTick中的回调会在下次dom渲染之后执行，延迟了执行回调；主要原理通过将nextTick中的回调函数先存储到一个数组中，并根据不同浏览器所支持微任务建立启动微任务函数，微任务关联一个函数执行，函数完成对之前存储的回调函数进行出队执行，微任务优先级,Promise, mutationObserver, setImmediate, setTimeOut; watcher的更新方式也是通过nextTick方式进行的，微任务会作为主线程同步任务完成后进行微任务执行


**6. Vue为什么需要虚拟DOM?**

  虚拟DOM是对真实DOM进行描述的一种Js对象，由于操作真实dom性能不好，通过操作js对象的方式性能比较好，通过对比虚拟dom来完成修改更新，其次通过js对象方式可以实现夸平台兼容性。


**7. Vue中的diff原理**

  采用平级比较，并进行深度递归遍历+双指针模式

  在新老虚拟节点都存在且不为元素时以及相同节点以标签和key相同则为相同标签，在符合相同标签下开始比对；步骤以下

  - 新老虚拟节点是否相同，相同则退出比对；否则进入比对

  - 将老虚拟节点el赋值给新虚拟节点el；做后面节点更新真实节点

  - 新虚拟节点为文本节点，则直接将新虚拟文本节点更新到el上；否则为元素节点

  - 元素节点下是否有子节点，新子节点存在，则直接更新新子节点到父级元素；若老子节点存在，则从父级元素删除老子节点；若新老子节点都存在，进行比对子节点

  - 子节点更新通过分别为新老子节点各自创建双指针，分别指向头尾；进行老头新头比对，老尾新尾比对，老头新尾比对，老尾新头比对；乱序比对；比对策略为，老头新头比对与老尾新尾比对若是相同标签则比对重复第一步到第四步，并同时后移前移移动指针；若不是相同标签则进行老头新尾比对，若相同，则将老头移动到老虚拟节点所有节点最后，并将老指针后移，新指针前移，进行重复；若老头新尾不是相同标签，则老尾新头进行比对，老尾与新头标签相同则将老尾节点移动到所有老虚拟节点的首部，并前移老虚拟节点的尾指针，移动新虚拟节点头部指针后移，进行重复；若以上都不满足，则进行乱序比对；乱序比对也就说按从左到右比对，先对老虚拟节点获取key建立key映射表，并新虚拟节点是否存在key，若存在，则通过key看是否在老虚拟节点的key的映射表中，获取到key对应索引；通过索引在老虚拟节点中找到要移动的节点，与新虚拟节点首部比对若相同，将找到移动节点将其移动到老虚拟节点首指针之前，并将移动节点之前位置置为undefined,并进行对移动节点和新虚拟节点首部比对，若是具有相同key但标签不同，则创建新首部节点newStartVnode插入父节点；若没有找到索引则为新节点，创建新节点newStartVnode插入父节点

  - 技术点

    1.先比较是否是相同节点

    2.相同节点比较属性,并复用老节点

    3.比较儿子节点，考虑老节点和新节点儿子的情况

    4.优化比较：头头、尾尾、头尾、尾头

    5.比对查找进行复用


**8. Vue.set方法是如何实现的?**

  对象和数组都创建了观测对象ob和dep，对象添加修改若修改属性存在，则直接赋值修改，若不存在Ob直接赋值修改，若存在增调用defineReactive触发对key值进行观测，并通知dep.notify更新；若是数组，则通过调用数组splice方法来实现，内部会观测新插入的值，并调用数组的dep.notify通知视图更新


**9. Vue的生命周期方法有哪些？一般在哪一步发起请求及原因**

  beforeCreate

    组件实例化创建，初始化事件初始配置一些事件定义，初始化父子关系之后执行

  created

    实例化创建完成，数据观测，属性，方法，计算属性等配置之后执行；这部是最早可以进行一些数据，资源请求，服务端支持此钩子

  beforeMount

    验证是否需要模板编译，是否有render函数，模板处理方式之后执行

  mounted

    vm.$el替换el, 实例挂载完成后执行；可以操作dom

  beforeUpdate

    节点比对patch,渲染dom更新之前执行，这时候只是触发了watcher调用更新前做的操作

  updated

    patch比对完成，渲染dom完成后执行，不适合在这个部分做修改数据，会导致循环触发

  beforeDestroy

    手动发起销毁前触发，在这部实例还存在

  destroyed

    组件销毁，解绑所有创建是关联的，事件绑定，之后执行,清空定时器


**10. Vue组件间传值的方式及之间的区别？**

  - props与$emit

    父向子通过绑定属性方式传入值，子向父通过调用$emit方法发起事件触发并将更改值传入到父组件作用函数中，更新属性值

  - $parent,$children

    通过$parent找到该组件的父组件，$children通过该组件的找到子组件

  - provide, inject

    主要做夸组件之间的通信，通过provide提供对外暴露的组件，通过inject导入provide提供的组件

  - $attrs,$listeners

    $attrs将该组件关联的非props属性批量向下传入，$listeners将该组件关联的绑定的事件批量向下传入

  - eventBus

    通过创建一个独立的vue实例，运用这个实例的$on,$emit方法进行发布订阅相关事件

  - $ref

    通过指定要操作的dom节点，或者组件实例

  - vuex

    基于Vue实现的一个独立的管理Vue数据状态库，在复杂业务情况下可以更好的管理状态


**11. computed与watch区别**

  - computed与watch都为watcher的实例，只是不同的类别，一个计算watcher,一个是用户watcher

  - computed与watch的实现方式不同；
    computed实现通过创建了vm.computedWatcher对象通过保存属性与计算属性watcher,并通过将计算属性通过Object.defineProperty将计算属性定义到实例vm上，通过getter方式，当在页面调用计算属性时触发读取getter，内部触发vm.computedWatcher[key].evaluate执行，内部会执行之前watcher里存储的计算属性表达式，并将watcher.dirty置为false，在执行的过程中建立了读取值依赖收集计算属性watcher,之后读取值对渲染watcher进行依赖收集(数据依赖收集计算属性watcher，数据依赖收集渲染watcher)，当数据变化是会通知计算属性watcher进行更新，并将dirty属性设置为true,在渲染watcher更新同时会再次读取计算属性触发重新取值

    watch用户watcher通过监测属性变化而进行调用对应的watcher实例存储的回调函数执行；内部调用vm.$watch实例方法，内部创建watcher实例并标识为user实例，通过对watch属性封装为函数，内部完成在vm上读取属性值，并执行这个函数，若在vm上读取的值为对象或者数组，将进行递归读取，如果值为监测对象，则会依赖收集用户watcher，当watch观察的属性变化了会再次调用定义回调执行，回调的过程会将值返回

    computed流程:

      - 循环读取computed上的计算属性，分别读取对应值或者getter函数

      - 为每一个计算属性创建对应的计算watcher

      - 创建缓存对象用来存储计算属性与对应watcher

      - 将计算属性绑定到vm实例上(通过Object.defineProperty,以getter方式定义)

      - 读取计算属性运行通过内部getter则调用对应watcher下的evaluate,并标识dirty为false,依赖的数据收集计算watcher,依赖的数据收集渲染watcher; 属性变化通知watcher更新

    watch流程：

      - 遍历watch对象，并调用vm.$watch方法

      - 对每一个属性都会创建一个对应的watchr对象，将属性对应的函数存储到对应的watcher实例对象cb下

      - 建立了属性与回调函数之间通过分析属性在vm实例上读取操作触发回调执行

      - 若存在options.deep则深度操作属性值

      - 属性的读取操作会触发对用户watcher的依赖收集

      - 当数据变化，会通知依赖watcher进行更新

  补充：三者执行顺序 computed watcher->user watcher->render watcher


**12. Vue通过数据劫持精准探测数据变化，为什么还需要虚拟dom进行diff检测差异**

  Vue通过数据劫持可以检测到数据变化，如果直接建立渲染watcher，这样每一个属性都要对应建立一个watcher, 当属性过于大量，造成watcher管理不利，消耗性能也大，而且可能造成更新丢失等问题

  提出运用虚拟dom，第一解决了操作真实dom产生的性能问题，第二通过建立了数据与组件之间watcher之间的对应，解决更新操作粒度过细问题，这样每次更新我只关注更新数据对应的组件，多次操作属性也对应所收集的视图


**13. Vue中的key的作用和原理，谈谈你对它的理解**

  - 在patch的时候，会通过节点的key来比较节点是否相同，相同即可复用

  - 无key节点在更新的时候可能会出现问题

  - 在动态数据更新的状态下，不要使用索引作为key,由于在比对时候前后节点产生的索引key都是一样的，所以比对的时候，可能会比对所有节点进行重新创建各节点


**14. Vue组件化理解**

  - 组件化提高了开发效率，测试行，复用性，模块性

  - 降低了更新范围，只重新渲染变化的组件

  - 组件体现了高内聚，低耦合，单项数据流


**15. Vue中组件的data为什么是一个函数**

  每一个组件都是一个实例化对象，如果data为对象格式，当多次实例化化同一个组件的时候会出现多个实例化对象共享了一个data对象，两个对象之间会出现修改互相影响，不能有唯一的数据状态管理

**16.请说下v-if和v-show的区别**

  - v-if

    最终编译后为通过三目运算来判断是创建标签元素还是创建空节点

    ```js
      <div v-if="a"></div>
      /*
        with(this){return (a)?_c('div'):_e()}
      */
    ```

  - v-show

    最终编译为指令模式来处理

    ```js
      <div v-show="a"></div>
      /*
        with(this){return _c('div',{directives:[{name:"show",rawName:"v-show",value:(a),expression:"a"}]})}
      */
    ```


**15. Vue组件渲染流程**

  在对模板进行编译时，如果是组件标签经过parseHtml和parse后生成的render函数中会会调用_c来创建标签元素；_c函数调用了createElement函数，会将tag,data,children等传入_createElement函数；通过调用resolveAsset函数在vm.$options.components下找注册的组件，之后调用createComponent(Ctor, data, context, children, tag)函数传入；若Ctor为对象，则调用Vue.extend方法来创建组件构造函数，分别解析data参数；调用installComponentHooks安装钩子函数(init, prepatch, insert, destroy);创建组件标签虚拟节点以vue-component-[name]标签名的tag; 之后在patch函数中会将返回的组件虚拟节点传入会调用createComponent创建，并触发data上的hooks钩子函数执行(init)内完成实例化构造函数组件，并进行挂载，通过$mount进行空挂载，最终返回编译后的模板节点vnode.elm最后插入到父节点parentElm中

  ```js
    const vnode = new VNode(
      `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
      data, undefined, undefined, undefined, context,
      { Ctor, propsData, listeners, tag, children },
      asyncFactory
    )
    // 创建构造组件函数实例
    const child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      )
    child.$mount(hydrating ? vnode.elm : undefined, hydrating)

    //createComponentInstanceForVnode完成了实例化
    return new vnode.componentOptions.Ctor({
      _isComponent: true,
      _parentVnode: vnode,
      parent
    })
  ```

  技术点：

    将组件模板编译成组件虚拟节点，并在data上挂载上触发钩子，在patch中调用createComponent触发钩子执行，并实例化组件构造函数，进行组件渲染，将空挂载的返回的vm.$el节点返回并插入到第一次挂载的父节点中

    根实例下render执行

    -> createComponent

    -> Vue.extend

    -> installComponentHooks(init, prepatch, insert, destroy)

    -> new Vnode(组件虚拟节点)

    init

    -> createComponentInstanceVnode

    -> $mount

    -> insert

    createComponentInstanceVnode

    -> this._init



    - render函数执行调用createElement

    - resolveAsset函数得到注册组件，并调用createComponent

    - createComponent中非函数组件调用Vue.extend转换为组件构造函数，并将data挂载各钩子函数，并创建组件标签虚拟节点对象返回

    - 上一步返回值传入vm._update方法中，内部调用vm.__patch__

    - createElm调用触发createComponent创建组件，开启data挂载的init函数触发实例化组件构造函数

    - 实例化构造函数完成空挂载返回vm.$el

    - 将vm.$el插入到根节点


**16. Vue组件更新**

  当数据变化通知了指定watcher更新，这时会触发patchVnode比对虚拟节点，并调用初始组件data属性上绑定prepatch钩子函数内调用updateChildComponent进行更新

  ```js
      prepatch (oldVnode: MountedComponentVNode, vnode: MountedComponentVNode) {
        const options = vnode.componentOptions
        const child = vnode.componentInstance = oldVnode.componentInstance
        updateChildComponent(
          child,
          options.propsData, // updated props
          options.listeners, // updated listeners
          vnode, // new parent vnode
          options.children // new children
        )
    }
  ```

  2. vue 组件渲染

    - 组件的定义

    组件的定义：局部定义定义在当前Vue组件下的components，全局定义定义在全局的components；主要思想通过vue.extend完成将对象转换为Vue的构造函数，并合并了传入的option到构造函数的options中

    组件的渲染：通过当view中解析到模板结构通过转换为AST语法树，对原生语法有一个基本的描述，之后并将对应的结构对接为对应的解析函数来执行，也就是说通过将AST转换为render函数，内部代码通过with锁定脚本上下文，new function完成独立黑盒完成代码运行；render函数运行完成得到对应的虚拟DOM，一种Dom节点的描述，并可以添加一些相关属性标识；在对组件标签会提前绑入hook执行函数；在通过对虚拟DOM的转换为真是DOM，类型为普通标签，以及组件标签，对于组件标签，会从当前components得到对应的组件定义，通过在创建过程中会触发hook执行，完成new 构造函数，实例化组件，并通过后期调动mount完成空挂载，最后完成对组件内部渲染，挂载到当前组件的vm.$el，返回给父，并最后完成插入操作，在组件的dom生成过程会通过data中的标识对指令，属性，事件，等进行对应的操作，并传递到初始化实例状态下，以完成建立父子组件的关系建立


  4. 用户watcher, 计算watcher, 渲染watcher

    用户watcher提供给用户创建添加来监控数据变化，通过对观察的属性传入到生成watcher，并标识为user watcher，在初始状态下完成初次渲染执行查找到对应属性的值，并记录下来，执行属性值查找的过程会将当前用户watcher设为当前状态，在取值情况下也就建立了用户watcher与当前属性的关联，后期当属性变化，会通知关联的watcher去更新，watcher的重新执行会触发再次运行查询属性值，这样得到新值，这样在后期将老值与新值传入属性对应的回调函数中，最终得到新老值

    计算watcher提供给对一些逻辑的整合计算得到最后值，可以减少视图中的表达式代码，通过对该属性劫持getter,setter进行关联到创建的watcher,这里会提前初始化watcher,并存储起来，后期通过用户在页面中调用了计算属性，触发watcher的执行，也就是当前属性对应的getter方法触发，由于在方法中关联了一些其他属性，执行过程中会建立计算属性与其他属性建立关联，后期其他属性值变化会通知关联的计算属性watcher执行，重新触发计算属性函数，在每次计算属性watcher完成后会建立其他属性与渲染watcher的关联，其他属性变化通知更新渲染watcher，内部主要通过getter,setter来触发计算watcher的执行调用，并在每次当前改变重置开关以防止重复执行，只有在后期值发生变化重置值完成通知执行

  5. 单向数据流

    信息的传递，都是通过父级传递到子级，通过props定义传入子级，通过父级定义事件，完成后期的通知，来传递数据；view -> view module -> module; 通过模板中的dom listener;事件的订阅；module -> view module -> view; 通过对数据的劫持改写完成关联到view module完成管理

  6. Vue 渲染异步模式

    由于同步情况下反复修改，重复渲染，效率低，导致频繁操作渲染，所以通过将渲染延迟到当前事件循环流程的最后，通过异步模式来完成最后的批量处理，排除多余重复watcher完成最后渲染，这样保证多个属性对应的dep只会导致对应的watcher只执行一次;异步模式通过（promise,mutationObserver,setImmidate,setTimeout）来完成将渲染watcher先存储起来，通过异步方法执行，最后将watcher存储函数依次执行,有watcher调用对应 watcher.run执行，触发this.get执行，重新执行watcher关联的方法

