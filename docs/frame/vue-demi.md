## 简介

vue-demi主要是为了在开发功能包插件时支持vue2,vue3，使开发功能包插件支持在vue2,vue3中运行。

## 原理

- 安装产生兼容代码

在安装vue-demi项目下，在项目通过npm install安装包的情况下安装vue-demi包时通过包钩子postinstall执行获取到当前项目中vue版本，这样会将兼容的版本代码生成

  1. postinstall->node postinstall.js

  2. 源代码lib库(vue2.xx,vue2.7,vue3)

  3. 利用node fs模块(readFile,writeFile)将对应源代码输出最终兼容版本

- 以vue2.xx，vue2.7版本，vue3版本

vue2.xx : 依赖于包@vue/compositionapi

vue2.7: 内部已经过度加入了部分vue3功能(compositionApi,SFC,SFC css v-bind),不在需要template-complier包

vue3: 全功能

- vue2.7版本作为使用vue3的过度版本，提供给系统vue2中能使用到vue3功能，由于暂时无法完全替换为vue3的一个过度开发vue版本
