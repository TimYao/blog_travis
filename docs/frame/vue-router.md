## 简介

vue-router以作为一个独立的针对vue框架建立的路由管理器，主要完成支持vue框架插件方式插入vue建立vue与路由功能关联，由vue-router内部提供其路由控制方法，属性。

## 思想原理

从以下三点理解vue-router：

- install的建立

完成插件化将功能注入到vue中

```js
  function install(Vue) {
    Vue.mixin({
      beforeCreate: function() {
        if (this.$options.router) {
          this._routerRoot = this;
          this._router = this.$options.router;
          Vue.util.defineReactive(this,'_route',this._router.history.current);
        } else {
          this._routerRoot = this.$parent._routerRoot;
        }
      }
    })
  }
  Object.defineProperty(Vue.prototype,'$route',{ // 每个实例都可以获取到$route属性
    get(){
      return this._routerRoot._route;
    }
  });
  Object.defineProperty(Vue.prototype,'$router',{ // 每个实例都可以获取router实例
    get(){
      return this._routerRoot._router;
    }
  })


  class VueRouter{
    constructor(options) {},
    init(app) {}
  }
  VueRouter.install = install;
```

- 路由处理

```js
  // createMatcher完成对路由配置进行整合
  function createMatcher(routes) {
    // 收集所有的路由路径, 收集路径的对应渲染关系
    // pathList = ['/','/about','/about/a','/about/b']
    // pathMap = {'/':'/的记录','/about':'/about记录'...}
    let {pathList,pathMap} = createRouteMap(routes);

    // 这个方法就是动态加载路由的方法
    function addRoutes(routes){
        // 将新增的路由追加到pathList和pathMap中
        createRouteMap(routes, pathList, pathMap);
    }
    function match(location){
      let record = pathMap[location];
      if (record) {
        return createRoute(record, {
          path: location
        });
      }
      return createRoute(record, {
        path:location
      });
    } // 稍后根据路径找到对应的记录
    return {
        addRoutes, // 动态增加路由
        match // 提供匹配路由
    }
  }
  // 完成整理路由
  function createRouteMap(routes, oldPathList, oldPathMap) {
    pathList = oldPathList || [];
    pathMap = oldPathMap || {};
    routes.forEach((route) => {
      addRouteRecord(route,pathList,pathMap);
    })
    return {
      pathList,
      pathMap
    }
  }
  // 完成最终路由整理项
  function addRouteRecord(route,pathList,pathMap, parent) {
    let path = parent ? `${parent.path}/${route.path}` : route.path;
    let record = {
      name: route.name,
      path,
      component: route.component,
      parent
    }
    if(!pathMap[path]){
      pathList.push(path);
      pathMap[path] = record;
    }
    if (route.children && route.children.length > 0) {
      route.children.forEach((chidRoute) => {
        addRouteRecord(chidRoute, pathList, pathMap, route);
      })
    }
  }

  // base history 提供基础的路由方法
  class History {
    constructor(router) {
      this.router = router;
      this.current = createRoute(null, {
        path: '/'
      });
      this.cb = null;
    },
    transitionTo(location, onComplete) {
      let route = this.router.match(location);
      if (route.path === location && route.matched.length === this.current.matched.length) {
        return;
      }
      this.updateRoute(route);
      onComplete && onComplete();
    }
    updateRoute(route) {
      this.current = route;
      this.cb && this.cb(route);
    }
  }
  // 继承扩展提供的路由方法
  class HashHistory extend History {
    constructor(router) {
      super(router);
      // 保证地址正确
      ensureSlash();
    }
    getCurrentLocation() {
      return getHash();
    }
    setupListener(){
      window.addEventListener('hashchange', ()=> {
          // 根据当前hash值 过度到对应路径
          this.transitionTo(getHash());
      })
    }
  }
  function ensureSlash(){
    if(window.location.hash){
      return
    }
    window.location.hash = '/';
  }
  function getHash() {
    return location.hash.slice(1);
  }

  // 基本类
  class VueRouter{
    constructor(options) {
      this.matcher = createMatcher(options.routes || []);
      let mode = options.mode;
      if (mode === 'hash') {
        this.history = new HashHistory(this);
      }
    },
    init(app) {
      this.app = app;
      const history = this.history;
      // 初始化时，应该先拿到当前路径，进行匹配逻辑
      history.listen((route) => { // 需要更新_route属性
        app._route = route
      });
      // 让路由系统过度到某个路径
      const setupHashListener = ()=> {
          history.setupListener(); // 监听路径变化
      }
      history.transitionTo( // 父类提供方法负责跳转
        history.getCurrentLocation(), // 子类获取对应的路径
          // 跳转成功后注册路径监听，为视图更新做准备
        setupHashListener
      )
    }
    match(location) {
      return this.matcher.match(location);
    }
  }
```

- 内置组件

```js
export default {
  functional:true,
  render(h,{parent,data}){
    let route = parent.$route;
    let depth = 0;
    data.routerView = true;
    while(parent){
      // parent.$vnode 组件节点
      if (parent.$vnode && parent.$vnode.data.routerView){
          depth++;
      }
      parent = parent.$parent;
    }
    let record = route.matched[depth];
    if(!record){
        return h();
    }
    return h(record.component, data);
  }
}

export default {
  props:{
      to:{
          type:String,
          required:true
      },
      tag:{
          type:String
      }
  },
  render(h){
      let tag = this.tag || 'a';
      let handler = ()=>{
          this.$router.push(this.to);
      }
      return <tag onClick={handler}>{this.$slots.default}</tag>
  }
}
```