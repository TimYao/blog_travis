## wokoo浏览器插架开发

集成了开发环境搭建，不需要个人手动搭建开发环境，提供vue, react方式框架开发，浏览器自身提供了wokoo环境嵌入方式，方便了开发流程

wokoo项目地址：<a href="https://gitee.com/TimLie/wokoo">https://gitee.com/TimLie/wokoo</a>

wokoo脚手架分析： <a href="https://gitee.com/TimLie/browser-plugin">https://gitee.com/TimLie/browser-plugin</a>

- 理解wokoo 脚手架

  利用了lerna多包管理, 独立的各个包功能 wokoo-scripts与wokoo-template

  - **wokoo-scripts**

    - commander模块完成对命令参数解析

      主要做创建项目目录，对项目创建package.json文件

    - 在项目目录下安装wokoo-template模块，提供开发模板选择

      主要利用开启单独进程来完成npm install 命令安装模块

    - 提供交互是命令选择开发框架

      主要利用inquirer模块开启交互式问答方式选择开发模板

    - 完成选择模板开发的配置，模板编译，导入到开发项目根目录下

      主要导入wokoo-template下webpack.config.js,public,.gitignore,以及对选择模板目录下进行遍历编译ejs模板（传入参数），并将模板导入开发项目根目录下临时目录，最终导入根目录删除临时目录，合并开发项目package.json配置与单独模板template.json进行合并，建立独立进程安装依赖模块，卸载wokoo-template模块

  - **wokoo-template**

    提供了vue-template与react-template模板相关（挂载模板内容，template.json, webpack配置信息）

    <a href="https://github.com/kinyaying/wokoo/tree/master/packages/wokoo-template">查看wokoo-template</a>

- 运用 wokoo 开发

  - 安装wokoo

    ```js
      npm i wokoo -g

      // 创建开发目录
      wokoo projectName
    ```

  - 选择开发模板(vue/react)

  - 启动开发

    ```js
      npm start
    ```

  - 浏览器安装支持插件

    chrome 插件

    ![An image](/blog/images/plugin.jpg)

    ![An image](/blog/images/temonkey.jpg)

  - 项目打包

    ```js
      npm run build
    ```

  - 项目嵌入Tampermonkey插件

    将项目下tampermonkey.js内容添加导入到

    ![An image](/blog/images/temonkey.jpg)

    tampermonkey.js 内容，提供匹配规则，可查看文档，思路为将运行脚本动态插入到浏览器中
    ```js
      // ==UserScript==
      // @name         MoveSearch
      // @namespace    http://tampermonkey.net/
      // @version      0.0.1
      // @description  try to take over the world!
      // @author
      // @match        https://*/*
      // @match        http://*/*

      // ==/UserScript==

      ;(function () {
        'use strict'
        if (location.href === 'http://localhost:8080/') return
        var script = document.createElement('script')
        // 若项目打包，则这里的脚本可以换为打包好的脚本，脚本方式：放入cdn导入cdn地址；直接粘贴打包代码，去除第三方脚本，以配置方式导入，防止嵌入代码过大无法正常导入
        script.src = 'http://localhost:8080/app.bundle.js'
        document.body.appendChild(script)
      })()
    ```

  - 运用中的问题

    - csp内容安全策略导致，无法将脚本导入浏览器页面中，通过安装关闭csp浏览器插件关闭，或者利用charless等代理工具配置rewrite规则

    - 功能api接口出现跨域问题，提供外网服务，并配置请求头信息Access-Control-Allow-Origin 等头信息