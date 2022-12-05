## 简介

通常我们使用一个新能技术都是为了解决现实中的一些情况，好比vuessr是什么，为什么需要，解决了什么问题；vuessr即vue服务端渲染，由于现在开发模式的转换，开发方式由前后端混搭开发，演变为现在流行的前后端分离方式开发，提高了项目管理，提高了开发效率；但由于对于需要提高页面的搜索引擎抓取，seo优化，以及页面的更快速内容渲染，在单页面情况下效能远不及服务端直渲染更好。vuessr是为了解决单页面开发，前后分离方式开发上的一个中间者，来实现即满足新开发方式，也能够满足直渲需求

## 原理切入

通过建立服务端渲染出vue实例化后的模板字符串，并通过客户端同样的实例正常挂载后产生的挂载脚本，最后通过将客户端产生的实例挂载脚本绑定到服务端吐出的字符串模板实现生效服务端内容的交互性；完美完成页面内容由服务端吐出页面内容，并在后续中可以完美利用前端无刷新页面来交互一些操作

## 流程理解

- 编码流程

**1. 提供公共的实例管理模块函数，这是由于客户端与服务端引入的都是Vue的实例化对象，区别仅在是否将实例挂载到dom对象上；**

**2. 对于路由和数据同样提供唯一的管理模块函数，这是因为首先对于路由，每一次后端路由导向都是一个新的实例，防止多次产生共享污染记录；数据同样，每一次都有独立的数据记录，所以在创建实例必须不同**

  ```js
    // app.js
    import Vue from 'vue';
    import App from './App.vue';
    import createRouter from './router.js';
    import createStore from './store.js';

    // 提供每次访问都是新的实例
    export default () => {
      const router = createRouter();
      const store = createStore();
      const app = new Vue({
        router,
        store,
        render: h => h(App)
      })
      return {app, router, store}
    }

  ```

**3. 路由的处理理解**

在通过浏览器访问页面时，一般的路由访问通过地址来查询到所需资源位置，对于后端访问本身默认有静态化资源访问的寻找，例如对于/访问默认会去静态资源中寻找index.html，在vuessr中，首先首次访问页面都是通过访问后端路由，先触发，之后的二次路由交互则是由前端路由完成；所以在进行中的关键是要将在通过访问后端路由地址过程中，将地址打到对应的前端路由地址，完成指向到需要访问资源，这里通过此方式来提前完成找到对应的路由资源渲染得到相应的字符串模板内容，通过后端吐出。

**4. 数据的预获取**

首先要明白此处下路由有两种，一位服务端的路由，二位前端路由；对于数据的获取，我们可以在服务端得到后传给客户端，也可在客户端获取；触发方式都是在组件下提前定义触发函数，后期通过后端路由确定后得到对应组件发起触发或者通过前端路由匹配路由得到对应组件触发

这里我们分为前端获取与后端获取；对于前端获取的方式，由于前端对于数据获取又可分为路由导航前和路由导航后由组件内部获取两种方式

前端获取，通常建立在路由组件解析(beforeResolve)与组件挂载前(beforeMount)，beforeResolve这种方式在路由组件解析完成时,在此方式下可以进行路由匹配获取，得到匹配的路由，发起钩子函数调用触发获取数据

```js

   // app.js
    import Vue from 'vue';
    import App from './App.vue';
    import createRouter from './router.js';
    import createStore from './store.js';

    // 提供每次访问都是新的实例
    export default () => {
      const router = createRouter();
      const store = createStore();
      // 第二种前端获取数据方式 ************
      // Vue.mixin({
      //   beforeMount() {
      //     const { asyncData } = this.$options;
      //     if (asyncData) {
      //       asyncData(); // 触发位置
      //     }
      //   },
      //   beforeRouteUpdate(){} // 针对路由参数变化，组件不重新渲染来触发asyncData方法
      // })
      const app = new Vue({
        router,
        store,
        render: h => h(App)
      })
      return {app, router, store}
    }
```

```js
// entry.client.js

import createApp from './app.js';

const {app, router, store} = createApp();
router.onReady(() => {
  // 前端方式获取数据方式之一 **************
  router.beforeResolve((to, from, next) => {
    // to: 前往路由   from: 离开路由  next 流程控制
    // 匹配到当前路由信息
    const matched = router.getMatchedComponents(to)
    // 匹配到离开路由信息
    const prevMatched = router.getMatchedComponents(from)

    // 得到要渲染的路由
    let diffed = false
    const activated = matched.filter((c, i) => {
      return diffed || (diffed = (prevMatched[i] !== c))
    })

    if (!activated.length) {
      return next()
    }

    // 若需要loading加载器，可在这里预设

    // 触发加载组件钩子函数执行，发起数据预取
    Promise.all(activated.map(c => {
      if (c.asyncData) {
        return c.asyncData({ store, route: to })
      }
    })).then(() => {

      // 停止加载loading

      next()
    }).catch(next)
  })
  // 挂载组件到指定dom
  app.$mount('#app');
})

```

```js
 // entry.server.js

 import createApp from './app.js';

 export default (context) => {
   return new Promise((resolve, reject) => {
     const { app, router, store } = createApp();
     // 将前端路由打入到请求对应的路径
     router.push(context.url);
     router.onReady(()=>{
       // 获得匹配路由
       const matchedComponents = router.getMatchedComponents();
       if (!matchedComponents.length) {
          return reject({ code: 404 })
       }

      // 服务端获取数据方式 ****************
      // 注意此方式需要在entry.client.js下完成同步前后端数据的数据同步，代码如下
      // const { app, router, store } = createApp()
      // if (window.__INITIAL_STATE__) {
      //   store.replaceState(window.__INITIAL_STATE__)
      // }
      // Promise.all(matchedComponents.map(component=>{
      //   if(component.asyncData){
      //       return component.asyncData(store);
      //   }
      // })).then(()=>{
      //   // 将状态放到上下文的状态中 此时就会将这个状态放到window上
      //   //context.state = store.state
      //   // 此方法可以返回一个promise，返回最终的实例
      //   resolve(app);
      // })

       resolve(app);
     })
   })
 }
```

```js
  // server.js  为服务端启动服务脚本
  const express = require('express');
  const { createBundleRenderer, createRenderer } = require('vue-server-renderer');
  const server = require('express')();
  const path = require('path');
  const fs = require('fs');
  let template;

  server.use(express.static(path.resolve(__dirname,'./dist')));

  template = fs.readFileSync('./public/index.ssr.html', 'utf8');


  // 对应服务端打包出来的
  // const serverBundle = require('./dist/vue-ssr-server-bundle.json');
  const serverBundle = require('./dist/server.bundle.js');
  // // 这个manifest 存entry.client端打包的信息
  // const clientManifest = require('./dist/vue-ssr-client-manifest.json')

  const renderer = createBundleRenderer(serverBundle, {
    template,
    // clientManifest
  })

  server.get('*', (req, res) => {
    const context = { url: req.url };
    // console.log(req.url);
    renderer.renderToString(context, (err, html) => {
      // console.log(err, html);
      if(err && err.code == 404){
        res.end('Page Not Found');
      }
      res.end(html);
    })
  })

  server.listen(8000);
```


- 构建流程

@babel/core -> 完成对代码转换，由es6+转换为浏览器支持的es5

@babel/preset-env -> 对转码规则的设定

babel-loader -> 作为webpack与babel之间的桥梁

vue-style-loader, css-loader 对vue中样式style支持与css处理

vue-loader解析.vue文件中的模板编译

**(1). 公共配置；完成对基本的处理，例如打包产生的目录，对脚本的编译转换，对css的预处理编译转换**

```js
  // webpack-base.js
  const path = require('path');
  const VueLoaderPlugin = require('vue-loader/lib/plugin')
  module.exports = {
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, '../dist')
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets:['@babel/preset-env']
            }
          },
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          use: ['vue-style-loader', {
            loader: 'css-loader',
            options: {
              esModule: false, // 注意为了配套使用vue-style-loader
            }
          }]
        },
        {
          test: /\.vue$/,
          use: 'vue-loader'
        }
      ]
    },
    plugins: [
      new VueLoaderPlugin()
    ]
  }
```

**(2). 客户端配置；针对客户端入口文件打包建立，模板的配置与引入**

```js
  // webpack.client.js
  const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const merge = require('webpack-merge');
  const base = require('./webpack.base');

  const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');

  module.exports = merge(base, {
    mode: 'development',
    entry: {
      client: path.resolve(__dirname,'../src/entry.client.js')
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname,'../public/index.client.html'),
        filename: 'index.client.html',
        minify: false
      }),
      new VueSSRClientPlugin()
    ]
  })

```

**(3). 服务端配置；针对服务端的入口文件打包建立，模板的配置**

```js
  // webpack.server.js
  const merge = require('webpack-merge');
  const base = require('./webpack.base');
  const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');

  const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');

  module.exports = merge(base, {
    // 开发模式指定
    mode: 'development',
    entry: {
      server: path.resolve(__dirname, '../src/entry.server.js')
    },
    target: 'node',
    // 使用module.exports 导出结果
    output:{
      libraryTarget: "commonjs2"
    },
    // devtool: 'source-map',
    externals: Object.keys(require('../package.json').dependencies),
    plugins:[
      new HtmlWebpackPlugin({
          filename:'index.ssr.html',
          template: path.resolve(__dirname,'../public/index.ssr.html'),
          // 排除掉自动引用服务端打包的包
          excludeChunks: ['server'],
          // 配置通过ejs语法来动态插入到服务器模板中挂载的前端vue脚本
          client: '/client.bundle.js'
      }),
      new VueSSRServerPlugin()
    ]
  })
```

**(4). 客户端模板与服务端模板**

```html
  // index.client.html
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
  </head>
  <body>
      <div id="app"></div>
  </body>
  </html>
```

```html
  // index.ssr.html
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
  </head>
  <body>
      <!--vue-ssr-outlet-->

      <!-- ejs模板 自动插入配置的client.js -->
      <script src="<%=htmlWebpackPlugin.options.client%>"></script>
  </body>
  </html>
```


## 总结

vuessr主要还是通过后端服务通过解析请求地址，将路由地址通过vue-router内部提供的push方法，将路由地址切换为该地址，由vue-router内部完成匹配得到匹配的组件，在vuessr中监测到router.onReady后将匹配成功后的vue实例app导出成功，这一步在配合打包服务端入口文件会最终以module.exports = app方式导出，在配合vue-server-renderer插件中，会建立一个node环境下的vm.runInThisContext函数封闭执行环境，以{exports:{}}方式传入执行环境，最终拿到了entry.server.js导出方法并将context传入相当于传入了路由请求地址,在后面的执行中，内部还是通过结合vue模板编译解析来完成解析流程，最终将解析完成内容插入到vue-server-renderer传入的template模板，也就是插入到了<!-vue-ssr-outlet-->标签中。

```js
export default (context) => {
   return new Promise((resolve, reject) => {
     const { app, router, store } = createApp();
     // 将前端路由打入到请求对应的路径
     router.push(context.url);
     router.onReady(()=>{
       // 获得匹配路由
       const matchedComponents = router.getMatchedComponents();
       if (!matchedComponents.length) {
          return reject({ code: 404 })
       }
       resolve(app);
     })
   })
 }
  // 这里是vue-server-renderer 下run 方法为最终由vm.runInThisContext封装一个环境并通过建立m={exports:{}}模式传入内部，这样外部就获取到了，内部module.exports绑定的方法也就是上面函数，context为传入的{url: ''},在运行完成后，由上面resolve(app),这样下面then方法得到了匹配组件实例
  run(context).catch(function (err) {
    rewriteErrorTrace(err, maps);
    cb(err);
  }).then(function (app) {
    if (app) {
      renderer.renderToString(app, context, function (err, res) {
        rewriteErrorTrace(err, maps);
        cb(err, res);
      });
    }
  });
  // https://github.com/vuejs/vue/blob/8a219e3d4cfc580bbb3420344600801bd9473390/src/server/bundle-renderer/create-bundle-runner.js#L91
  // https://github.com/vuejs/vue/blob/8a219e3d4cfc580bbb3420344600801bd9473390/src/server/bundle-renderer/create-bundle-runner.js#L25

  // renderer.renderToString 最终内部会调用到ssrCompileToFunctions，这个ssrCompileToFunctions被定义在vue框架
  // import { ssrCompileToFunctions } from 'web/server/compiler'
  const normalizeRender = vm => {
  const { render, template, _scopeId } = vm.$options
  if (isUndef(render)) {
    if (template) {
      const compiled = ssrCompileToFunctions(template, {
        scopeId: _scopeId,
        warn: onCompilationError
      }, vm)

      vm.$options.render = compiled.render
      vm.$options.staticRenderFns = compiled.staticRenderFns
    } else {
      throw new Error(
        `render function or template not defined in component: ${
          vm.$options.name || vm.$options._componentTag || 'anonymous'
        }`
      )
    }
  }
 }

 // import { createCompiler } from 'server/optimizing-compiler/index'
 // 到这里已经很清晰化看到，最终还是调用了vue内部模板解析编译，
 export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
  const ast = parse(template.trim(), options)
  optimize(ast, options)
  const code = generate(ast, options)
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})
```

通过以上，可以清楚的知道了，为什么在entry.server.js中对应的webpack配置中要配置libraryTarget:node以及library:commonjs2，通过这样将导出方法绑定在了module.exports上，方面后面拿到进行后续的编译解析流程。vue-server-renderer作为了一个联系服务端路由处理以及vue解析一个中间桥梁，最终完成服务端输出解析后的模板。当然内部也完成了注入客户端编译后的client.entry.js脚本