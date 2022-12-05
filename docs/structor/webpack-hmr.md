## webpack-dev-server主流程理解

1. compiler = webpack(options)

2. 根据webpack options.devServer参数判断创建new Server(complier, options.devServer)

3. 通过updateCompiler完成对入口模块entry
   添加webpack-dev-server/client/index.js完成将socket监测代码插入到entry，这部分主要是添加了客户端的socket完成与服务端的连接。
   添加webpack/hot/dev-server.js完成webpackHotUpdate事件创建，后期触发接受hash变更信息，并判断是否支持开启热更新

4. 通过setupHook 添加compiler.hook.done钩子函数监测当编译完成后触发socket发布事件
   内部主要通过socket.emit('hash')传递更新的后的hash;socket.emit('ok')传递并保证成功，判断是否开是热更新

5. 完成setupDevMiddleWare()完成对静态目录指定以及读取文件访问请求处理
   this.app.use(express.static(dir))
   middleware = webpackDevMiddleWare(this.compiler)完成更改compiler内部的文件系统为memory-fs模块
   this.app.use(middleware)
   内部还会完成compiler.watch监测开启监测文件是否更改了，重新编译后将结果会输出到内存，由在静态访问时会响应对应内容

6. 完成createSocketServer()完成基于HTTP server创建socket,记录连接服务的client socket
   为了后期在compiler.hook.done事件触发后对存储socket发起编译后的hash信息

7. 完成setupApp()基于express创建app
   完成createServer基于http node完成http.createServer(this.app)，通过listen方法开启启动服务

## 模块文件理解

1. modules模块相关模块内容，内部包含了所有模块管理记录

```js
  var modules = {
    "./src/index.js": (module, exports, require) => {
      let render = () => {
        let title = require("./src/title.js");
        root.innerText = title;
      };
      render();
      if (module.hot) {
        module.hot.accept(["./src/title.js"], render);
      }
    },
    "./src/title.js": (module) => {
      module.exports = "title3";
    },
    "./webpack/hot/emitter.js": (module) => {
      class EventEmitter {
        constructor() {
          this.events = {};
        }
        on(eventName, fn) {
          this.events[eventName] = fn;
        }
        emit(eventName, ...args) {
          this.events[eventName](...args);
        }
      }
      module.exports = new EventEmitter();
    },
  };
```

2. 模块加载器require方法,
  以及hotCreateRequire,
  hotCreateModule

```js
  function require(moduleId) {
    if (cache[moduleId]) {
      return cache[moduleId].exports;
    }
    var module = (cache[moduleId] = {
      exports: {},
      hot: hotCreateModule(moduleId),
      parents: [],
      children: [],
    });
    modules[moduleId](module, module.exports, hotCreateRequire(moduleId));
    return module.exports;
  }
  function hotCreateRequire(parentModuleId) {
    var parentModule = cache[parentModuleId];
    if (!parentModule) return require;
    var fn = function (childModuleId) {
      parentModule.children.push(childModuleId);
      require(childModuleId);
      let childModule = cache[childModuleId];
      childModule.parents.push(parentModule);
      return childModule.exports;
    };
    return fn;
  }
  function hotCreateModule() {
    var hot = {
      _acceptedDependencies: {},
      accept: function (deps, callback) {
        for (var i = 0; i < deps.length; i++)
          hot._acceptedDependencies[deps[i]] = callback;
      },
      check: hotCheck,
    };
    return hot;
  }
```

3. entry入口模块会注入socket监测的内容

```js
  // webpack-dev-server/client/index.js
  (() => {
    var hotEmitter = require("./webpack/hot/emitter.js");
    var socket = io();
    var initial = true;
    socket.on("hash", (hash) => {
      currentHash = hash;
    });
    socket.on("ok", () => {
      console.log("ok");
      reloadApp();
    });
    function reloadApp() {
      hotEmitter.emit("webpackHotUpdate", currentHash);
    }
  })();

  // webpack//hot/dev-server.js
  (() => {
    var hotEmitter = require("./webpack/hot/emitter.js");
    hotEmitter.on("webpackHotUpdate", (currentHash) => {
      if (!lastHash) {
        lastHash = currentHash;
        console.log("lastHash=", lastHash, "currentHash=", currentHash);
        return;
      }
      console.log("lastHash=", lastHash, "currentHash=", currentHash);
      console.log("webpackHotUpdate hotCheck");
      hotCheck();
    });
  })();
```

4. HotModuleReplacement.runtime内容

方法：

  hotCheck： 完成调用到module.hot.check 模块在创建时会邦入的触发更新方法

  hotDownloadManifest：完成拉取hash json文件，得到更新的hash

  hotDownloadUpdateChunk：完成对得到hash进行拉取对应的js文件，得到更新模块内容

  hotAddUpdateChunk：从模块内容中得到对应需要更新模块

  hotApply：调用更新模块下_acceptedDependencies下之前记录的模块方法执行

5. hotModuleReplacementPlugin插件

  在webpack中会根据options.hot开启更新插件，插件完成对模块记录添加了parent,children,分别记录了模块间父子关系，因为在更新中会以更新模块查找到父模块，通过调用父模块下hot下记录了更新模块文件地址与更新回调，这个回调是重新执行读取模块中更新后的相应模块



