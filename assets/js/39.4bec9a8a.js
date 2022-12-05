(window.webpackJsonp=window.webpackJsonp||[]).push([[39],{344:function(e,a,v){"use strict";v.r(a);var p=v(33),_=Object(p.a)({},(function(){var e=this,a=e.$createElement,v=e._self._c||a;return v("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[v("h2",{attrs:{id:"webpack-cli"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#webpack-cli"}},[e._v("#")]),e._v(" webpack-cli")]),e._v(" "),v("p",[e._v("webpack-cli以webpack命令行工具，通过命令行方式传入config配置信息")]),e._v(" "),v("h2",{attrs:{id:"命令分类"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#命令分类"}},[e._v("#")]),e._v(" 命令分类")]),e._v(" "),v("ul",[v("li",[e._v("内部提供的功能包：")])]),e._v(" "),v("p",[e._v("init：初始化一个webpack配置")]),e._v(" "),v("p",[e._v("migrate: 升级一个新版本配置")]),e._v(" "),v("p",[e._v("serve: 开启webpack dev server")]),e._v(" "),v("p",[e._v("loader: loader脚手架")]),e._v(" "),v("p",[e._v("plugin: plugin脚手架")]),e._v(" "),v("p",[e._v("info: 输出安装系统以及依赖信息")]),e._v(" "),v("ul",[v("li",[e._v("配置命令参数")])]),e._v(" "),v("p",[e._v("设定webpack的参数，例如entry等即webpack config配置信息")]),e._v(" "),v("h2",{attrs:{id:"流程理解"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#流程理解"}},[e._v("#")]),e._v(" 流程理解")]),e._v(" "),v("ul",[v("li",[v("p",[e._v("webpack命令行方式调用, webpack --entry...")])]),e._v(" "),v("li",[v("p",[e._v("通过监测模块中是否安装了webpack-cli,若没有安装会完成安装")]),e._v(" "),v("p",[e._v("检测方式以项目模块下，或者全局模块下 require.resolve")]),e._v(" "),v("p",[e._v("安装方式以：npm install 与 yarn add (通过判断项目目录下package,yarn配置文件)")]),e._v(" "),v("p",[e._v("安装借助：child_process开启独立进程完成")]),e._v(" "),v("p",[e._v("交互方式: readLine模块，inquire模块等")])]),e._v(" "),v("li",[v("p",[e._v("调用webpack-cli 模块将process.argv参数传入")]),e._v(" "),v("p",[e._v("传入参数整理通过commander模块或者yarg模块")]),e._v(" "),v("p",[e._v("完成最终的option参数整理(校验，合并，默认化等)")])]),e._v(" "),v("li",[v("p",[e._v("导入webpack模块")]),e._v(" "),v("p",[e._v("完成将最终的options参数传入webpack中compiler = webpack(options);")]),e._v(" "),v("p",[e._v("由compiler.run或者compiler.watchRun完成启动webpack流程")])])])])}),[],!1,null,null,null);a.default=_.exports}}]);