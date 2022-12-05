## webpack
webpack 是一个款打包工具，为了更好的管理资源，可以把各种各样的模块打包成JS，统一做相应处理

## 基本常用用法
webpack 分为几个基本配置context相对处理目录设置，entry入口，output出口，module模块预处理，resolve模块查找相关配置，plugin插件处理，devServer本地服务配置，devtool开发模式源码映射配置

- entry

  打包入口配置，单入口以字符串格式，多入口以对象格式配置，多模块合并以数组格式

- output

  path 打包输出路径

  filename生成的文件（[name/id/hash]）

  chunkFileName 懒加载生成文件

  publicPath 静态地址指定

  library  对外暴露的变量

  libraryTarget 所使用的环境 umd/commonjs/commonjs2/var 根据不同环境打包出适应的脚本

- module

  noParse 对于加载模块，不依赖其他模块设置不解析为了减少模块分析与导入

  rules: 多条处理规则配置，针对不同的文件做不同处理
   ```js
    [
      {
        test: /regexp/,//匹配规则
        // 'babel-loader'| ['babel-loader'] | [{loader: 'babel-loader', options:{}}]
        use: (string|string[],{}[]),
        // 排除目录
        exclude: (string|string[]),
        // 包含目录
        include: (string|string[])
      }
    ]
  ```

- resolve

  由于模块解析处理规则相关配置

  module解析模块的查找模块目录配置

  mainFile导入模块配置导入识别的文件默认index.js

  mainFiled导入模块对packJson下优先导入字段对应文件的配置

  alias提供可以更好更简单的引入模块路径，别名话简单

- plugin

  处理在loader处理不了的其他情况

- devServer

  配置本地启动服务，完成本地开发的灵活性运用

  port/proxy/publicPath/contentBase...

- devtool

  对打包编码的source map映射，可以在调试bug更快找到源码出错位置，不同的值会明显影响到构建(build)和重新构建(rebuild)的速度

  none 构建与重新构建速度三星，适应生成环境，打包后的代码

  eval 构建与重新构建速度三星，不适应生成环境，生成后的代码

  ```js
    eval("\n\n__webpack_require__(/*! ./css/index.css */ \"./src/css/index.css\");\n\n//# sourceURL=webpack:///./src/index.js?");
  ```

  cheap-eval-source-map 构建一星与重新构建二星，不适应生成环境，转换过的代码（仅限行）

  ```js
  eval("\n\n__webpack_require__(/*! ./css/index.css */ \"./src/css/index.css\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvaW5kZXguanMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanM/N2U5MCJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxucmVxdWlyZShcIi4vY3NzL2luZGV4LmNzc1wiKTsiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/index.js\n");
  ```

  cheap-module-eval-source-map  构建0与重新构建二星，不适应生成环境，原始源代码（仅限行）

  ```js
    eval("\n\n__webpack_require__(/*! ./css/index.css */ \"./src/css/index.css\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvaW5kZXguanMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vYmFiZWwtYS5qcz80Y2QwIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGltcG9ydCBpbWcgZnJvbSAnLi9pbWFnZXMvaW1nLmpwZyc7XG5pbXBvcnQgJy4vY3NzL2luZGV4LmNzcyc7XG4vLyBsZXQgbG9hZGluZ0ltZyA9ICgpID0+IHtcbi8vICAgY29uc3QgaW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbi8vICAgaW0uc3JjID0gaW1nO1xuLy8gICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGltKTtcbi8vIH1cbi8vIGxvYWRpbmdJbWcoKTtcbi8vIGltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG4vLyBpbXBvcnQge25hbWVkfSBmcm9tICcuL2EuanMnXG4vLyBpbXBvcnQgbSAgZnJvbSAnLi9hLmpzb24nXG4vLyBjb25zb2xlLmxvZygnaW5kZXgganMnLCBuYW1lZCwgbSk7Il0sIm1hcHBpbmdzIjoiOztBQUNBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/index.js\n");
  ```

  cheap-source-map 构建一星与重新构建0，适应生成环境，转换过的代码（仅限行）

  ```js
    //# sourceMappingURL=main.bundle.js.map
  ```

  cheap-module-source-map 构建0与重新构建负一星，适应生成环境，原始源代码（仅限行）

  ```js
    //# sourceMappingURL=main.bundle.js.map
  ```

  inline-cheap-source-map 构建一星与重新构建0，不适应生成环境，转换过的代码（仅限行）

  ```js
    //# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5idW5kbGUuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Nzcy9pbmRleC5jc3MiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Nzcy90LmNzcyIsIndlYnBhY2s6Ly8vLi9zcmMvY3NzL2luZGV4LmNzcz80NzQ0Iiwid2VicGFjazovLy8uL3NyYy9pbWFnZXMvaW1nLmpwZyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXguanNcIik7XG4iLCJtb2R1bGUuZXhwb3J0cz1gYCtyZXF1aXJlKFwiISFjc3MtbG9hZGVyIS4vdC5jc3NcIikrYFxuYm9keXtcbiAgY29sb3I6IHJlZDtcbiAgYmFja2dyb3VuZC1pbWFnZTogdXJsKFwiYCtyZXF1aXJlKFwiLi4vaW1hZ2VzL2ltZy5qcGdcIikrYFwiKTtcbn1gIiwibW9kdWxlLmV4cG9ydHM9YFxuYm9keXtcbiAgZm9udC1zaXplOiAyNHB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZWQ7XG59YCIsIlxuICAgIGNvbnN0IHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICBzdHlsZS5pbm5lclRleHQgPSByZXF1aXJlKFwiISEuLi8uLi9sb2FkZXJzL2Nzcy1sb2FkZXIuanMhLi9pbmRleC5jc3NcIik7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzdHlsZSk7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSAnJztcbiAgIiwibW9kdWxlLmV4cG9ydHMgPSBcImltYWdlcy9pbWc4MWE3YjE5NTdkMTJjNTI0NTEzZjU5NmM0ODNkMWM0Ni5qcGdcIiIsIlwidXNlIHN0cmljdFwiO1xuXG5yZXF1aXJlKFwiLi9jc3MvaW5kZXguY3NzXCIpOyJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQ0xBOzs7Ozs7Ozs7Ozs7QUNBQTtBQUNBO0FBQ0E7Ozs7QSIsInNvdXJjZVJvb3QiOiIifQ==
  ```

  inline-cheap-module-source-map 构建0与重新构建负一星，不适应生成环境，原始源代码（仅限行）

  同上,只是对编译前的源码保留了映射

  inline-source-map 构建二星与重新构建二星，不适应生成环境，原始源代码

  同上,只是保留了映射的行列信息

  source-map 构建二星与重新构建二星，适应生成环境，原始源代码

  hidden-source-map 构建二星与重新构建二星，适应生成环境，原始源代码

  nosources-source-map 构建二星与重新构建二星，适应生成环境，无源代码内容

  eval-source-map 构建负二星与重新构建一星，不适应生成环境，原始源代码

  +++ 非常快速, ++ 快速, + 比较快, o 中等, - 比较慢, -- 慢

  其中一些值适用于开发环境，一些适用于生产环境。对于开发环境，通常希望更快速的 source map，需要添加到 bundle 中以增加体积为代价，但是对于生产环境，则希望更精准的 source map，需要从 bundle 中分离并独立存在

  eval 将代码块进行eval包裹

  inline 嵌入了脚本中，形成行内

  cheap 对于编译后的代码进行行信息监测，并且不会产生源代码的map记录

  module 对于源代码产生记录，可以调试中看到源代码

  source-map 生成独立文件

  none 不生成映射

  针对不同情况选择，上线适合轻量cheap,module,source-map,通过配置来完成私服中调试；
  本地开发，eval,cheap,inline,module都可以；其中eval模式不会进行ast分析速度会更快

  https://webpack.docschina.org/configuration/devtool/

- watch

  开启监控模式，可以实时打包或编译

- watchOptions

  开启监测后的配置，对控制响应频率控制

  aggregateTimeout 增加延迟重新构建时间，聚合多次操作

  ignored 排除一些不需要监测的目录，文件

  poll 轮询监听时间


## 构建优化

- module下的noParse配置 针对导入模块内部不存在依赖，比如jquery

- plugins 下运用webpack.ignorePlugin,对一些模块只用了一部分模块，忽略掉，手动引入需要的

- plugins webpack.DllPlugin 动态链接库,将不变的第三方模块单独打包处理，生成manifest.json文件，通过在主文件中通过webpack.DllReferencePlugin配置导入映射文件，不用重复打包第三方文件

- plugins happypack 多线程插件支持开启打包

- webpack自动提供了运用es6模块下tree-shaking,只能针对导入es6模块，会自动删除没有运用的定义的一些函数
    scope hosting 作用域提升，对作用域做了整合，自动省略一些简化代码
    tree-shaking: 运用import/export方法，mode: production模式开启，sideEffects: false, es6配置不转为commonjs,目前只设置mode就完成了

- 抽离公共代码

  当有多文件有公用模块时

  ```js
    webpack2: commonChunkPlugin
     webpack4:
     optimization: {
       // 分割代码块
       splitChunks: {
         // 缓存组
         cacheGroups:{
           // 公共模块
           common:{
             // 入口模块
             chunks: 'initial',
             // 尺寸大于多少
             minSize: 0,
             // 抽离模块被引入的次数
             minChunks: 2
           },
           vendor: {
             // 权重提高
             priority: 1,
             // 匹配第三方模块抽离
             test: /node_modules/,
             minSize: 0,
             minChunks: 2
           }
         }
       }
     }
  ```

- 懒加载

  通过es6 草案用法 import()动态载入模块，返回promise
  通过异步触发来加载通过jsonp模式插入文件
  需要安装插件支持@babel/plugin-syntax-dynamic-import

- 热更新

  更新部分而不是全部更新

  ```js
    devServe: {
       hot: true
     }
     plugins: [
       // 打印更新
       new webpack.NamedModulesPlugin(),
       // 热更新模块
       new webpack.HotModuleReplacementPlugin()
     ]
     模块文件中加入
     if(module.hot){
       // 针对指定文件
       module.hot.accept('./source', () => {
         let str = require('./source');
       })
     }
  ```

## webpack模块解析
webpack 内部打包会实现导入模块加载的方法，比如类似node中的require模式,实现module.exports模式的支持，并通过对不同模块类型进行兼容处理(es6模块，commonjs模式)，webpack本身以commonjs规范

特色：

  1. 实现了require,module.exports方式 (require = __webpack_require__)

     ```js
      var module = {
        i, // 模块标识，这里为路径
        l, // 是否已经加载
        exports // 模块中内容
      }
     ```

     完成对模块中的this指向到module.exports,并对所有导出闭包模块传入了module, module.exports, require

     ```js
      modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
     ```

     实现缓存存储

     ```js
       var installedModules = {};
       if (installedModules[moduleId]) {
          return installedModules[moduleId];
       }
     ```

  2. 完成异步加载，懒加载模块导入方式

     通过对导入模块import()分析，产生调用对应的方法完成jsonp模式动态插入脚本，并最后将异步模块更新到modules列表，同步所有相关依赖模块的列表

     import方法映射的方法实现，内部实现promise模式处理

     ```js
      __webpack_require__.e = function requireEnsure(chunkId) {
      var promises = [];
      // JSONP chunk loading for javascript

      var installedChunkData = installedChunks[chunkId];
      if(installedChunkData !== 0) { // 0 means "already installed".
        // a Promise means "currently loading".
        if(installedChunkData) {
          promises.push(installedChunkData[2]);
        } else {
            // setup Promise in chunk cache
            var promise = new Promise(function(resolve, reject) {
              installedChunkData = installedChunks[chunkId] = [resolve, reject];
            });
            promises.push(installedChunkData[2] = promise);

            // start chunk loading
            var script = document.createElement('script');
            var onScriptComplete;

            script.charset = 'utf-8';
            script.timeout = 120;
            if (__webpack_require__.nc) {
              script.setAttribute("nonce", __webpack_require__.nc);
            }
            script.src = jsonpScriptSrc(chunkId);

          // create error before stack unwound to get useful stacktrace later
            var error = new Error();
            onScriptComplete = function (event) {
              // avoid mem leaks in IE.
              script.onerror = script.onload = null;
              clearTimeout(timeout);
              var chunk = installedChunks[chunkId];
              if(chunk !== 0) {
                if(chunk) {
                  var errorType = event && (event.type === 'load' ? 'missing' : event.type);
                  var realSrc = event && event.target && event.target.src;
                  error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
                  error.name = 'ChunkLoadError';
                  error.type = errorType;
                  error.request = realSrc;
                  chunk[1](error);
                }
                installedChunks[chunkId] = undefined;
              }
            };
            var timeout = setTimeout(function(){
              onScriptComplete({ type: 'timeout', target: script });
            }, 120000);
            script.onerror = script.onload = onScriptComplete;
            document.head.appendChild(script);
          }
        }
        return Promise.all(promises);
      };
     ```

     定义window.webpackJsonp，添加push方法，并记录上一层push方式，后期实现递归完成同步modules列表,push = webpackJsonpCallback，触发更新

     ```js
      function webpackJsonpCallback(data) {
        var chunkIds = data[0];
        var moreModules = data[1];
        // add "moreModules" to the modules object,
        // then flag all "chunkIds" as loaded and fire callback
        var moduleId, chunkId, i = 0, resolves = [];
        for(;i < chunkIds.length; i++) {
          chunkId = chunkIds[i];
          if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
            resolves.push(installedChunks[chunkId][0]);
          }
          installedChunks[chunkId] = 0;
        }
        for(moduleId in moreModules) {
          if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
            modules[moduleId] = moreModules[moduleId];
          }
        }
        if(parentJsonpFunction) parentJsonpFunction(data);

        while(resolves.length) {
          resolves.shift()();
        }
      };
      var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
      var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
      jsonpArray.push = webpackJsonpCallback;
      jsonpArray = jsonpArray.slice();
      for (var i=0; i<jsonpArray.length; i++) {
        webpackJsonpCallback(jsonpArray[i]);
      }
      var parentJsonpFunction = oldJsonpFunction;
     ```

  3. 实现多模块规范之间的兼容es6与commonjs

     总思路为：es6模块均添加Symbol.toStringTag完成对Object.prototype.toString对象类型的重新化，添加es6标识__esModule, 对模块导出应对响应的处理规则，es6模块均产生{default:{}, Symbol.toStringTag: Module, __esModule: true, 其他非default导出对象}，commonjs方式导出模块不做处理，module.exports/exports

     - 导出es6模块，导入方式es6

      标识添加，读取default,或访问对象
      Module {default: {text: "cc"}, aa: ƒ aa(), __esModule: true, Symbol(Symbol.toStringTag): "Module"}

      ```js
        __webpack_require__.r(__webpack_exports__);
        {
          "./src/index.js":
          (function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            var _title__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/title.js");

            console.log(_title__WEBPACK_IMPORTED_MODULE_0__["default"], _title__WEBPACK_IMPORTED_MODULE_0__["age"]);
          }),

          "./src/title.js":
          (function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            __webpack_require__.d(__webpack_exports__, "age", function() { return age; }); __webpack_exports__["default"] = (name = 'tim');
            let age = 12;
          })

        }
      ```

     - 导出es6模块，导入commonjs模式

      Module {default: {text: "cc"}, aa: ƒ aa(), __esModule: true, Symbol(Symbol.toStringTag): "Module"}
      ```js
        {
            "./src/index.js":
            (function(module, exports, __webpack_require__) {
              let m = __webpack_require__("./src/title.js");
              console.log(m);
            }),

            "./src/title.js":
            (function(module, __webpack_exports__, __webpack_require__) {
              "use strict";
              __webpack_require__.r(__webpack_exports__);
              __webpack_require__.d(__webpack_exports__, "age", function() { return age; });
              __webpack_exports__["default"] = (name = 'tim');
              let age = 12;
            })
        }
        Module {default: "tim", __esModule: true, Symbol(Symbol.toStringTag): "Module", age: 12}
      ```

     - 导出commonjs, 导入commonjs

      ```js
        {
          "./src/index.js":
          (function(module, exports, __webpack_require__) {
            let title = __webpack_require__("./src/title.js");
            console.log(title);
          }),

          "./src/title.js":
          (function(module, exports) {
            module.exports = 'title';
            // exports.name = 'title name';
            // exports.age = 'title age';
          })
        }
      ```

     - 导出commonjs, 导入es6

      会对commonjs模式判断是那种模式，返回对应模式处理方式，es6返回default,commonjs module

      ```js
        let c = {
          text: 'cc'
        }
        module.exports = {
          c
        }
        import * as m from './c';

        {c: {text: "cc"}}


        __webpack_require__.n = function (module) {
          var getter = module && module.__esModule ?
          function getDefault (){ return module['default']; } :
          function getModuleExports () { return module; };
          Object.defineProperty(getter, 'a', getter);
          return getter;
        }
        {
          "./src/index.js":
          (function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            var _title__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/title.js");
            var _title__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_title__WEBPACK_IMPORTED_MODULE_0__);
            console.log(_title__WEBPACK_IMPORTED_MODULE_0___default.a, _title__WEBPACK_IMPORTED_MODULE_0__["age"]);
          }),

          "./src/title.js":
          (function(module, exports) {
            exports.name = 'title name';
            exports.age = 'title age';
          })
        }
      ```

  总结：

  ::: tip
  总模块导入还是导出若模块监测出为ES6模块，统一做了添加标识{Symbol.toStringTap: "Modules", __esModule: true} [object, Modules]
  导出：es6, 导入：es6
  这种方式将default 方式绑入module.exports.default,并将其他方式绑定到module.exports上，最后导入获取以ES6方式的{default:{}, key:value}得到

  导出：e6，导入commonjs
  这种方式导出同样做es6模式处理，导入按默认commonjs方式，在获取中通过{default:{}, key:value}得到

  导出：commonjs，导入commonjs
  这种方式不做任何处理，按常规的commonjs模式获取得到

  导出：commonjs,导入es6模式
  这种方式导入通过判断导出对象格式为es6模式还是commonjs模式，返回模块下的default,还是默认的，并会再最后模块上定义a属性得到最后所有的模块

  es6模块在webpack的处理下表现为module.exports = {default:{}, otherKey: value, Symbol.toStringTag: "Modules", __esModule: true},所以对于是commonjs方式导入，从default得到es6模块default下参数，其他获取方式不变化，commonjs格式module.exports = {}
  :::


<!-- ::: tip
This is a tip
:::

::: warning
This is a warning
:::

::: danger
This is a dangerous warning
:::

::: details
This is a details block, which does not work in IE / Edge
::: -->

## webpack流程整理

- 由webpack-cli处理完成命令行交互，命令参数，以及相关的webpack其他脚手架

- 在由webpack-cli支持后内部会调用webpack来开启webpack启动

- 若不通过webpack-cli方式调用，以读取webpack.config.js来合并整合参数

- webpack内部以两种方式，一种是存在watch方式，一种是以直接调用run非观测模式

- 实例化穿件compiler,compiler为管理webpack整个流程一个对象，内部提供了钩子函数和一些记录信息

- 在compiler创建过程中会进行初始化一些环节配置(比如绑入输入输出模块)，执行一些插件

- 查找入口，找到入口，读取入口文件，得到入口相对项目目录地址，并将其构建成模块对象，内部会有模块标识即模块相对细致，模块依赖记录作为后期在分析依赖时存储依赖模块

- 整合规则中的loader，对资源与loader进行规则匹配，并整合loader类型数组，loader分为(post, inline, normal, pre)，分别处理后的以loader数组记录，在对资源的标识上除去不需要loader(!!只需要行loader,-!排除前置和普通loader,!排除普通loader),根据不同组合为最后需要处理的loader数组（[...post, ...inline, ...normal, ...pre]）通过调用loader-runner一种控制loader执行的流程模块库对loader进行循环，分别以入口模块开始读取入口文件内容，将其传入，以最后处理后的内容，将其转换为对应ast树进行依赖分析，以及部分代码的转换比如将(require方法转换为webpack内部实现的__webpack_require__模块方式)，对以require方式导入的模块再次进行(文件路径，模块建立，loader流程，ast)，模块处理完成将其存储到所属模块的记录信息中。当所有模块编辑结束后，得到了模块的依赖关系，这个过程后完成了模块编译，模块转换，模块的依赖分析

- 由模块依赖关系来建立chunks,由chunks建立了assets，chunks为代码块，一个代码块是其相关的模块一个组合模块，代码块有两种，一种是由入口模块和依赖模块组成的模块，一种是异步import方式而独立的代码块，assets作为最终要发射的文件，也就是作为文件产生的模块

- 在assets完成后，可对输出资源进行发射输出，完成

补充：

  1. loader作为非脚本资源转换为可脚本处理的模块转换工具，loader分为(转换loader, 处理loader, 工具loader),转换loader完成模块转换为js可处理的js模块(babel-loader)，处理loader完成对一些功能过度(css-loader完成了对css中import的转换为require,以及路径处理)，工具loader主要是完成配合loader的处理(postcss-loader)；loader作为一个函数执行将处理内容传入，通过脚本方式导出,loader-runner作为控制loader执行流程的管理者，管理者中提供了loader context完成对整个流程的上下文的相关记录；

  2. loader的plugin提供了结合解耦功能的导入执行，通过插件可以增强loader功能

  3. plugin作为webpack中贯穿整个webpack流程，每一个插件可提供挂入的钩子，在后期webpack的执行流程中合适的时机触发执行，完成所需任务，plugin以类方式定义，内部通过提供apply方法作为入口启动口，plugin的功能要强大于loader，loader只能做部分功能，loader属于其中一个流程，plugin则贯穿了整个webpack流程中

  4. 代码分割：

    entry chunk将要合并的第三方模块整合为一个入口chunk数组中, 以入口作为最后的代码块资源产生

    import chunk以异步模块方式单独作为代码块资源产生，主要以jsonp方式

    split chunk针对多个模块之间共享了功能模块抽离，通过optimization下splitChunks

  5. hash

    hash: 以整个编译过程中的模块标识符来通过crypto模块完成生成hash产生

    chunkhash: 以入口模块以及相关的依赖模块的模块ID通过crypto模块完成生成hash产生

    contenthash: 以模块内容通过crypto模块完成生成hash产生

    hash的灵活性更大，变动性更大，持久性差，当任何一个模块增减变化都会影响其相关的所有模块hash变化；chunkhash因入口相关模块的变化而变化; contenthash方式计算量大，针对性更强，三者之间强度由低到高

  6. 构建速度

     1. 针对不同环境启动相对应的source-map方式

     2. 对于第三方模块可以实行dll方式的单独处理打包，主要原理是通过单独第三方模块配置文件，通过webpack.DllPlugin生成一个dll.js第三方库打包好的文件，并产生dll.refererce.json文件内部管理了每一个模块的映射文件，在主配置文件中通过DllReferencePlugin会通过引入dll.refererce.json判断来放弃对第三方模块的打包处理

  ```js

  // webpack.vendor.config.js

  const path = require('path');

  new webpack.DllPlugin({
    context: __dirname,
    name: '[name]_[fullhash]',
    path: path.join(__dirname, 'manifest.json'),
  });

  // webpack.app.config.js

  new webpack.DllReferencePlugin({
    context: __dirname,
    manifest: require('./manifest.json'),
    scope: 'xyz',
    sourceType: 'commonjs2',
  });
```

  3. resolve, resolveLoader的配置，控制模块以及loader的解析查找，文件后缀，模块主字段读取，模块主文件查找

  4. use规则中对于规则通过oneOf方式建立，这样可以使得规则匹配执行一次

  5. 引入thread-loader通过开启多进程完成构建速度提升

  6. speed-measure-webpack-plugin统计构建过程中的速度监测

  7. noParse的配置，对于不需要分析依赖的模块开启

  8. ignore-plugin配置忽略过多的不需要模块引入

  9. tree-shaking 去除没有使用的代码

  10. host scope 作用域提升





