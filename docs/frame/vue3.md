## vue3

**1. 特点**

    - 函数数编程思想

    - compositionApi以及optionApi

    - 引入ts

    - 引入fragment, suspense, teleport模式

    - 单仓库多包管理方式

    - tree shaking更好

**2. 原理理解**

  #### 响应式

      利用es6 proxy api 实现拦截数据监测，get完成收集effect,set完成执行收集effect；

      建立副作用函数effect，作为proxy需要收集的函数，实现数据与函数之间多对多映射关系

      利用了栈思想来记录执行环境(这里也可以利用树模式，即记录父执行环境)

  #### props, attr

      props主要是针对组件所关联的属性传递，attr用户自定义属性数据；props具有浅响应并具有校验，单项传递；实现方式即在组件实例产生后，会将产生的组件虚拟节点上的props属性以及attr挂入实例对应字段，并通过建立proxy代理执行到instance上的props,attr获取

  #### 事件以及插槽

    组件上定义的事件，会在模板转换为虚拟节点上以及组件实例上保存，在通过emit发射时，
    会从组件实例上获取到对应方法执行，基本思想还是发布订阅

    插槽主要是在组件渲染过程中，形成的虚拟节点上会记录了组件插槽虚拟节点，渲染的开始过程由父到子，
    完成过程由子到父完成，实例上会记录着$slots通过proxy代理读取到实例上的该字段

  #### 组件渲染以及组件更新

      初始过程：

      (1) 创建vnode,组件对应的虚拟节点，记录组件类型等信息

      (2) 根据组件节点类型进入mountComponent

      (3) patch分为初始挂载，更新组件

      (4) 初始节点完成创建实例instance, 产生组件对应的实例，记录相关组件信息(类型，proxy, attr, props等)

      (5) 产生上下文ctx, 产生proxy代理相关实例信息，记录了组件是否有render,是否要编译模板

      (6) 建立组件对应的effect函数

      更新过程：

      (1) 组件自身更新

        在单组件过程中，每一个组件即有一个effect，组件上data, props变化后，对应收集的effect发生更新

      (2) 父组件更新导致子组件更新

        由于父组件通过props方式传递到子组件中，当父组件属性发生变化会使父组件effect更新，instance.update执行即render更新，内部会完成更新props，即父组件新老虚拟节点props更新, 这样子组件获得到的props也是更改的，🙆子组件进行了比对并导致子组件effect进行执行

    总结：

      由于基于组件更新，即组件需要建立一个类型vue2的渲染watcher来完成让属性来收集effect； 组件批量更新通过存储更新effect,在异步(promise)下完成更新effect，effect内部关联了组件下render函数的执行；在初始化先执行下effect，将组件产生的effect绑定到instance上，在更新过程下再次调用instance.update=effect

  #### 生命周期

    将构造函数绑定到当前上下文实例环境，在调用钩子函数时，即已经锁定了当前执行组件实例，
    所以将钩子函数存储在了对应实例下对应生命周期标识对象中,
    比如m标识即mounted； instance[m] = [fm1,fm2]

  #### computed or watch

    computed计算属性，内部也提供了一个effect函数，用作提供给依赖数据的收集，即创建依赖数据收集计算属性effect，这样在数据改变通知到计算属性执行，这里有一个特殊情况，当计算属性嵌套建立，或者与具有effect函数特性的功能发送嵌套，计算属性需要具备收集外层effect函数，这样当计算属性发生改变应该去通知它收集的effect去执行；体现具有被收集和收集。

    watch监测响应数据变化执行回调，首先watch本身是一个具有effect的函数，需要建立观测对象收集watch effect，这样当数据发送变化会通知收集的effect执行，在关联的effect中将执行回调，传递变化的值；这里对于响应数据对象格式的观察递归内部属性值，进行关联收集


    let state = ref(true);
    const cmp = computed(() => {
      return state.value ? 'true' : 'false';
    })
    console.log(cmp.value);
    setTimeout(() => {
      state.value = false;
      console.log(cmp.value);
    }, 1000)

    // 大概理解实现
    function computed(options) {
      let getter;
      let setter;
      if (typeof options === 'function') {
        getter = options;
        setter = () => {
          throw '不能更改';
        }
      } else {
        getter = options.get;
        setter = options.set;
      }
      return new ComputedTml(getter, setter);
    }
    class ComputedTml {
      _value = null;
      isDirty = true;
      deps = []; // 收集外层effect
      constructor(public getter, public setter) {
        // 这里的effect是创建effect函数
        this.computedEffect = effect(getter, {
          scheduler: (effect) => {
            this.isDirty = true;
            // 依赖数据变化了，会通知到关联的计算属性effect指向
            trigger(this,'get', 'value');
          }
        })
      }
      get value () {
        if (!this.isDirty) {
          return
        }
        // activeEffect为记录当前effect，在调用计算属性时候如果嵌套外层effect，这时会是外层effect
        //  {this: {value: set[activeEffect]}} track收集外层关联到this
        track(this, 'get', 'value')
        this.isDirty = false;
        this._value = this.computedEffect();
        return this._value;
      }
      set value (val) {
        this.setter(val); // 这里设置值注意
        return true;
      }
    }

    // watch 大概理解实现
    let state = reactive({age:1});
    watch(state, function(n,o) {
      console.log(n, o);
    })
    function watch(options, cb) {
      let getter
      let value;
      let set = new Set;

      // 递归读取对象属性，让其收集watch effect
      function wrap(options) {
        if (typeof options !== 'object' || set.has(options)) {
          return options;
        }
        let current = options;
        let keys = Object.keys(options);
        for(let i=0; i<keys.length; i++) {
          let key = keys[i];
          let obj = current[key];
          wrap.call(instance, obj);
        }
        return options;
      }

      if (typeof options === 'object') {
        getter = ()=>wrap.call(instance, options)
      } else if (typeof options === 'function') {
        getter = options;
      }

      let job = function(e) {
        if (cb) {
          const n = run();
          if (n !== value) {
            cb(n, value);
            value = n;
          }
        }
      }

      let run = effect(getter, {
        lazy: true,
        scheduler: job
      })

      value = run();
    }

  #### 编译

    针对模板语法template进行分析产生ast描述语法关系，

    html->ast(将原始语法转换为js对象)->转换阶段将ast预编译(加入了一些记录信息)->生成代码(生成新的执行方式语法)

    ast阶段：根据模板进行从左到右进行分析字符情况，以文本，表达式，元素，注释等情况分别转换为对象，
            记录了各类型情况，属性情况，孩子情况

    转换阶段：可以对需要标识的动态节点进行创建标识，优化一些节点合并，属性事件优化等

    生成节点：将转换阶段格式进行拼接形成语法执行，这样在调用执行后生成对应

    每个虚拟节点通过patchFlag标识了节点类型，这样在patch过程根据不同类型进行创建

    (hosting, patchFlag, blockTree)

  #### diff

    针对虚拟节点比对，以节点类型不同，节点类型相同；
    不同节点由新节点直接创建，相同节点则进行复用老节点，并比对子节点，比对过程以同序前比对，
    同序后比对，乱序比对，在同序情况下处理了复用可能性，当退出后锁定的范围为乱序；
    乱序比对情况下，通过建立key映射表来对比老虚拟节点是否存在，若存在复用，在这个过程中只是单纯了比对，
    但并没有移动节点，也无法知道需要添加的新节点，因此引入对乱序范围节点进行标识是否复用，用于区分哪些是
    复用，哪些是新创建节点，在对乱序进行循环处理时以最后一个节点为基准进行相对前插入各节点，这个过程新节点
    将创建，老节点将复用，这里有一个特殊理解，在乱序范围中若存在老节点和新节点序位相同，没必要进行移动操作，
    这里通过最长递增子序列得到不需要移动的的序列标识，在做基准插入时，排除不需移动节点，提升操作性能

  #### keep-alive

    在组件渲染过程中，keep-alive组件渲染的为插槽的节点，会对插槽渲染后的虚拟节点进行缓存，
    并对渲染后的真实节点存储在内存中，在切换过程中，会通过keep-alive
    组件节点上标识的方法触发对应的激活方法或者非激活方法，将虚拟节点传入对应函数，激活过程则从
    缓存中拿出虚拟节点返回，存在虚拟节点上是有真实节点，若没存在完成常规渲染流程，非激活状态卸载
    组件只是替换到，非真实卸载，在指定的缓存数量后，超过的删除按lru规则。

    注意点: 缓存规则利用了lru规则(最近最久未使用，即存储的首项删除，每次活跃项目都后插入)
           keep-alive组件其实只是做了一层缓存包装，对子组件的缓存，并建立了一些缓存规则

  #### provide inject

    完成夸父子组件传递信息，由父到子；
    provide完成将自己需要传递的对象绑入到自身组件实例provides上
    inject完成从自身组件实例上向父级寻找匹配的注入的信息返回，子组件实例的parent上记录了父级provide信息，以链方式继承下来
    父子组件在渲染过程中建立了父子关系，所以子组件通过parent可以得到父组件实例




**3. vue2与vue3对比**

  - 实现理念差异

    vue2基于继承方式，组件之间整体过程围绕在组件实例，参数信息作为实例参数，原型参数保存；

    vue3基于函数方式，组件实例即一个对象，相关信息记录在组件实例对象上；函数组合方式更加使代码编写灵活

  - 双向绑定

    数据响应：

        vue2以数据响应(Object.defineProperty)重新get,set;建立watcher渲染实例，每一个观察对象建立对应dep进行收集watcher,数据变化通知watcher更新

        vue3以数据响应(proxy拦截代理)监测get,set,has,delete;建立effect函数，建立数据属性收集依赖的上下文effect
    在数据变化，通知effect执行，即每一个组件即有一个effect

        单向数据流，从父到子以数据变化通知对应收集(watcher/effect)执行

    发布订阅以及原始DOM绑定：

        组件实现 props/emit；原始DOM绑定事件

  - diff比对

        vue2双指针比对(头头，尾尾，头尾，尾头)；新老虚拟节点比对

        vue3(同序前/后比对，缩小乱序范围)；新老虚拟节点block tree比对，利用了最长递增子序列提升移动性能

        vue2在转换过程标识的的静态节点，vue3在转换过程中建立动态block tree节点，形成block tree,
        只记录比对节点，提升了比对性能
