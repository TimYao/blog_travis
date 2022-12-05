## webpack-cli
webpack-cli以webpack命令行工具，通过命令行方式传入config配置信息

## 命令分类

- 内部提供的功能包：

init：初始化一个webpack配置

migrate: 升级一个新版本配置

serve: 开启webpack dev server

loader: loader脚手架

plugin: plugin脚手架

info: 输出安装系统以及依赖信息

- 配置命令参数

设定webpack的参数，例如entry等即webpack config配置信息

## 流程理解

- webpack命令行方式调用, webpack --entry...

- 通过监测模块中是否安装了webpack-cli,若没有安装会完成安装

  检测方式以项目模块下，或者全局模块下 require.resolve

  安装方式以：npm install 与 yarn add (通过判断项目目录下package,yarn配置文件)

  安装借助：child_process开启独立进程完成

  交互方式: readLine模块，inquire模块等

- 调用webpack-cli 模块将process.argv参数传入

  传入参数整理通过commander模块或者yarg模块

  完成最终的option参数整理(校验，合并，默认化等)

- 导入webpack模块

  完成将最终的options参数传入webpack中compiler = webpack(options);

  由compiler.run或者compiler.watchRun完成启动webpack流程

