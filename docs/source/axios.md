## axios

  夸平台实现请求资源库，客户端利用了XMLHttpRequest对象，服务端利用了http.request模式；内部通过利用发布订阅方式来订阅拦截器，利用promise方式来实现异步触发开启请求

  做了什么：

    - 创建Axios构造函数, 存储指定的拦截器, 完成各请求方法添入Axios.prototype, Axios.prototype.request作为了所以请求方法的入口

    - 创建拦截器构造函数，建立原型上use方法(提供收集拦截器), eject方法(删除指定的拦截器)

    - 创建默认参数定义，定义了请求前处理函数，请求后处理函数, 相关头信息, 取消请求, 代理配置，夸平台请求方法等

    - 建立客服端请求方式与服务端请求方式

    - 对外提供axios应用口

    - 提供CancelToken功能

  - axios

    地址： <a href="https://github.com/axios/axios">https://github.com/axios/axios</a>

    1. 请求发起方式：

        web端：XMLHttpRequest

        服务端：node http

        ```js
          function getDefaultAdapter() {
            var adapter;
            if (typeof XMLHttpRequest !== 'undefined') {
              // For browsers use XHR adapter
              adapter = require('./adapters/xhr');
            } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
              // For node use HTTP adapter
              adapter = require('./adapters/http');
            }
            return adapter;
          }
        ```

    2. 异步promise

    ```js
      // 对外提供的应用入口
      function createInstance(defaultConfig) {
        // 构建基本实例
        var context = new Axios(defaultConfig);
        // 创建新的方法对外暴露，并在外调用是将参数传入
        // Axios.prototype.request返回promise
        // 内部this指向了context
        var instance = bind(Axios.prototype.request, context);

        // Copy axios.prototype to instance
        utils.extend(instance, Axios.prototype, context);

        // Copy context to instance
        utils.extend(instance, context);

        return instance;
      }
      // axios 运行后返回promise
      var axios = createInstance(defaults);

    ```

    ```js
      function Axios(instanceConfig) {
        this.defaults = instanceConfig;
        this.interceptors = {
          request: new InterceptorManager(),
          response: new InterceptorManager()
        };
      }

      // 绑入请求方法
      utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
        /*eslint func-names:0*/
        Axios.prototype[method] = function(url, config) {
          return this.request(utils.merge(config || {}, {
            method: method,
            url: url
          }));
        };
      });

      utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
        /*eslint func-names:0*/
        Axios.prototype[method] = function(url, data, config) {
          return this.request(utils.merge(config || {}, {
            method: method,
            url: url,
            data: data
          }));
        };
      });

      // 主触发请求方法
      Axios.prototype.request = function request(config) {
        /*eslint no-param-reassign:0*/
        // Allow for axios('example/url'[, config]) a la fetch API

        // 这里完成了config合并

        // Hook up interceptors middleware
        var chain = [dispatchRequest, undefined];
        var promise = Promise.resolve(config);

        // 若调用了this.interceptors.request.use方法，可以插入自定义拦截器，在发请求前做一些操作
        // this.interceptors.response.use方法对响应后提供处理器
        this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
          chain.unshift(interceptor.fulfilled, interceptor.rejected);
        });

        this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
          chain.push(interceptor.fulfilled, interceptor.rejected);
        });

        while (chain.length) {
          // 发起 dispatchRequest config将传入
          promise = promise.then(chain.shift(), chain.shift());
        }

        return promise;
      };

      // 核心在InterceptorManager实例
      function InterceptorManager() {
        // 提供存放promise fulfilled,rejected
        this.handlers = [];
      }

      // dispatchRequest
      function dispatchRequest(config){
        // config 预设准备

        // Ensure headers exist
        config.headers = config.headers || {};

        // 请求前数据处理 Transform request data
        config.data = transformData(
          config.data,
          config.headers,
          config.transformRequest
        );

        // Flatten headers
        config.headers = utils.merge(
          config.headers.common || {},
          config.headers[config.method] || {},
          config.headers
        );

        var adapter = config.adapter || defaults.
        // 这里adapter根据不同设备完成xhr（XMLHttpRequest node下http,返回promise）
        // 分别返回触发以下对应的成功和失败函数
        return adapter(config).then(function onAdapterResolution(response) {
        throwIfCancellationRequested(config);

        // 数据格式处理
        response.data = transformData(
          response.data,
          response.headers,
          config.transformResponse
        );

          return response;
        }, function onAdapterRejection(reason) {
        if (!isCancel(reason)) {
          throwIfCancellationRequested(config);

          // Transform response data
          if (reason && reason.response) {
            // 响应数据格式处理
            reason.response.data = transformData(
              reason.response.data,
              reason.response.headers,
              config.transformResponse
            );
          }
        }

          return Promise.reject(reason);
        });
      }
    ```

    重点：通过了对数组[dispatchRequest, undefined]，实现了分割请求前拦截，和请求后处理以及请求发起三部分，并结合promise.then返回值传递性完成

    3. 数据处理方式

    ```js
      // 表单格式，buffer, 文件格式，对象格式
      // url 地址中转换为文本格式
      // 前端ArrayBuffer（isArrayBuffer），isFile 文件格式，二进制isBlob，isArrayBufferView视图操作模式ArrayBuffer，isURLSearchParams 是否为url参数模式， Object转为json格式
      // 后端Buffer（isBuffer），isStream流对象
      var default = {
        transformRequest: [function transformRequest(data, headers) {
        normalizeHeaderName(headers, 'Accept');  // Accept: value
        normalizeHeaderName(headers, 'Content-Type'); // Content-Type: value
        if (utils.isFormData(data) ||
          utils.isArrayBuffer(data) ||
          utils.isBuffer(data) ||
          utils.isStream(data) ||
          utils.isFile(data) ||
          utils.isBlob(data)
        ) {
          return data;
        }
        if (utils.isArrayBufferView(data)) {
          return data.buffer;
        }
        if (utils.isURLSearchParams(data)) {
          setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
          return data.toString();
        }
        if (utils.isObject(data)) {
          setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
          return JSON.stringify(data);
        }
        return data;
      }],

        transformResponse: [function transformResponse(data) {
          /*eslint no-param-reassign:0*/
          if (typeof data === 'string') {
            try {
              data = JSON.parse(data);
            } catch (e) { /* Ignore */ }
          }
          return data;
        }],
      }
    ```

    4. CancelToken阻断定义

        通过配置config下的CancelToken字段在请求处理过程中，若该对象下的promise属性状态变为成功态触发then方法内部调用了request.abort()阻断请求；

    ```js

      function Cancel(message) {
        this.message = message;
        this.__CANCEL__ = true;
      }
      function CancelToken(executor) {
        let resolvePromise;
        this.promise = new Promise(function(resolve, reject){
          resolvePromise = resolve;
        })
        const token = this;
        executor(function(c) {
          if (token.reason) {
            return;
          }
          // 创建阻断信息
          token.reason = new Cancel(c);
        })
      }
      CancelToken.prototype.source = function () {
        const cancel;
        const token = new CancelToken(function(c){
          cancel = c;
        });
        return {
          token,
          cancel
        }
      }
    ```


    5. adapter提供夸平台

    ```js
      // 主要代码
      const xhr = new XMLHttpRequest();
      xhr.open('http://www.test.com/abc', 'post', true);
      xhr.onreadystatechange = function(){
        if (xhr.readyState !=4 || !xhr) {
          return;
        }
        const responseData = xhr.responseText || xhr.response;
        xhr = null;
      }
      // 延迟
      xhr.ontimeout = function(){
        xhr = null;
      }
      // 阻断
      xhr.onabort = function(){
        xhr = null;
      }
      // 网络错误
      xhr.onerror = function(){
        xhr = null;
      }
      xhr.send(data);
    ```

    ```js
      const http = require('http');
      const https = require('https');
      const url = require('url');
      const urls = url.parse('http://www.test.com/abc');
      const server = isHttps.test(urls.protocol) ? https : http;
      function stripBOM(content) {
        if (content.charCodeAt(0) === 0xFEFF) {
          content = content.slice(1);
        }
        return content;
      }
      server.request({
        url: 'http://www.test.com/abc',
        method: 'post',
        data: {},
        // 这里还可以有其他参数
      }, function(res){
        let content = [];
        res.on('data', function(chunk){
          content.push(chunk);
        })
        res.on('error', function(err){
          console.log('err:', err);
        })
        res.on('end', function(){
          content = Buffer.concat(content).toString('utf8');
          content = stripBOM(content);
        })
      })
      server.setTimeout(config.timeout, function(){
        server.abort();
      })
      server.on('error', function(err){})
      if (data instanceof Stream) {
        data.on('error', function handleStreamError(err) {
          console.log(err);
        }).pipe(server);
      } else {
        server.end(data);
      }
    ```