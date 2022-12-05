## 前端监控

通过提供一个监测系统，以监测收集相关产品的监测信息给管理者，通过对数据信息分析，一方面作为改善产品依据，一方面可以得到相关站点的错误信息，及时修复，提高用户对站点满意度，提示产品访问体感

- 监控模式

  对用户提供调用入口即访问sdk；对服务器端提供请求收集数据，分析数据并存储；将存储数据导出展示到可视化管理界面

  - 第三方提供监测功能(sentry)

    对外以提供了使用sdk，只关注sentry sdk如何嵌入到代码中，通过sentry可视化端查看错误信息

  - 个人开发监测系统

    对业务进行需求分析后，建立对各产品需求建立相关的上报业务逻辑，通常提供产品相关信息字段产品id, 用户id, 设备id, 上报类型，错误类型，错误码，错误信息等

    服务器端搭建收集错误的api接口，约定格式, 建立数据库数据存储，缓存，搭建可视化访问存储数据，提供给管理员查看上报错误相关信息

    确定如何触发行来建立收集，可根据用户行为，上报触发时刻等

    建立针对客户端sdk对外接口，以及监测错误行为定义方式(通过监测分类)


- 监控分类

  - 用户访问相关

    pv（page view）访问页面即产生；

    uv（user view）利用设备标识或用户唯一标识；

    用户在线时长 通过监测用户触发活跃行为，比如鼠标操作点击行为，行为间隔时长；

    热区(某一模块的访问量) 某个模块位置添加监测，实行行为触发收集；

    方式：通过建立打点服务，将相关的收集信息反应给服务器端（new Image模式或者ajax模式）

  - 脚本相关错误

    try...catch 错误捕获：建立对代码包装try...catch行为，捕获错误传入处理错误函数

    ```js
      function tryify (func) {
        // 确保只包装一次
        if (!func._wrapped) {
          func._wrapped = function () {
            try {
              return func.apply(this, arguments)
            } catch (error) {
              config.handleTryCatchError(error)
              window.ignoreError = true

              throw error
            }
          }
        }
        return func._wrapped
      }
    ```

    js运行错误，加载错误：添加window.onerror定义，获取相关，通过监测触发绑定对象区分为加载错误还是其他错误

    ```js
      // 在捕获阶段可捕获到资源加载错误
      window.addEventListener('error', function (event) {
        // 过滤 target 为 window 的异常，避免与上面的 onerror 重复
        var errorTarget = event.target
        if (errorTarget !== window && errorTarget.nodeName && LOAD_ERROR_TYPE[errorTarget.nodeName.toUpperCase()]) {
          handleError(formatLoadError(errorTarget))
        } else {
          // onerror会被覆盖, 因此转为使用Listener进行监控
          let { message, filename, lineno, colno, error } = event
          handleError(formatRuntimerError(message, filename, lineno, colno, error))
        }
      }, true)
    ```

    promise错误：添加unhandledrejection捕获错误触发

    ```js
      window.addEventListener('unhandledrejection', function (event) {
        console.log('Unhandled Rejection at:', event.promise, 'reason:', event.reason);
        handleError(event)
      }, true)
    ```

    控件错误: 重新console.error方法，内部包装提供错误类型

    ```js
      console.error = (function (origin) {
        return function (info) {
          var errorLog = {
            type: ERROR_CONSOLE,
            desc: info
          }

          handleError(errorLog)
          origin.call(console, info)
        }
      })(console.error)
    ```

    请求错误，通过拦截方法重新，内部调用原始方法，观测绑定失败事件，可捕获到

  - 页面性能

    主要是利用performance API来建立观测页面加载的每一个阶段

- 监控项目学习

  sentry针对vue，灯塔搭建

  项目代码地址：<a href="https://gitee.com/TimLie/zhufeng_front_monitor_202009/tree/master">https://gitee.com/TimLie/zhufeng_front_monitor_202009/tree/master</a>

