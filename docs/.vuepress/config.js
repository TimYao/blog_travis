// 配置文件的入口文件，也可以是 YML 或 toml
module.exports = {
  title: '知识文章',
  description: 'This is a blog.',
  port: 9000,
  base: '/blog/',
  // activeHeaderLinks: false,
  repo: 'TimYao/blog', // 你的仓库
  repoLabel: 'GitHub', // 导航栏上的文本
  themeConfig: {
    // displayAllHeaders: true,
    nav: [
      { text: 'GitHub', link: 'https://github.com/TimYao' },
      // {
      //   text: 'Languages',
      //   items: [
      //     { text: 'Group1', items: [/*  */] },
      //     { text: 'Group2', items: [/*  */] }
      //   ]
      // }
    ],

    search: false,

    sidebar: [
      // {
      //   title: 'JS',
      //   path: '/javascript',
      //   sidebarDepth: 0,
      //   collapsable: false
      // },
      {
        title: 'JS',
        path: '/jsdoc',
        sidebarDepth: 0,
        collapsable: false
      },
      {
        title: 'Html/Css',
        path: 'all',
        sidebarDepth: 0,
        collapsable: false
      },
      {
        title: '前端框架',
        collapsable: true,
        sidebarDepth: 0,
        children: [
          {
            title: 'vue',
            collapsable: false,
            path: '/frame/vue'
          },
          {
            title: 'vue-demi',
            collapsable: false,
            path: '/frame/vue-demi'
          },
          {
            title: 'vue3',
            collapsable: false,
            path: '/frame/vue3'
          },
          {
            title: 'vuex',
            collapsable: false,
            path: '/frame/vuex'
          },
          {
            title: 'vue-router',
            collapsable: false,
            path: '/frame/vue-router'
          },
          {
            title: 'vuessr',
            collapsable: false,
            path: '/frame/vuessr'
          },
          {
            title: 'react',
            collapsable: false,
            path: '/frame/react'
          }
        ]
      },
      {
        title: '测试',
        path: '/test',
        collapsable: false,
        sidebarDepth: 0,
        children: []
      },
      {
        title: '构建工具',
        collapsable: true,
        sidebarDepth: 0,
        children: [
          {
            title: 'webpack',
            collapsable: false,
            path: '/structor/webpack'
          },
          {
            title: 'tapable',
            collapsable: false,
            path: '/structor/tapable'
          },
          {
            title: 'webpack-cli',
            collapsable: false,
            path: '/structor/webpack-cli'
          },
          {
            title: 'webpack-hmr',
            collapsable: false,
            path: '/structor/webpack-hmr'
          }
        ]
      },
      {
        title: '服务端',
        collapsable: true,
        sidebarDepth: 0,
        children: [
          {
            title: 'node',
            collapsable: false,
            path: '/server/node'
          },
          {
            title: 'express',
            collapsable: false,
            path: '/server/express'
          },
          {
            title: 'koa',
            collapsable: false,
            path: '/server/koa'
          }
        ]
      },
      {
        title: '发布上线',
        path: '/replease',
        collapsable: false,
        sidebarDepth: 0
      },
      {
        title: '扩展知识',
        path: '/expand',
        collapsable: false,
        sidebarDepth: 0
      },
      {
        title: '源码分析',
        collapsable: true,
        sidebarDepth: 0,
        children: [
          {
            title: 'axios',
            collapsable: false,
            path: '/source/axios'
          },
          {
            title: 'promise',
            collapsable: false,
            path: '/source/promise'
          },
          {
            title: 'javascript',
            collapsable: false,
            path: '/source/javascript'
          }
        ]
      },
      {
        title: '资料',
        path: '/resource',
        collapsable: false,
        sidebarDepth: 0
      },
      {
        title: '项目实践',
        collapsable: true,
        sidebarDepth: 0,
        children: [
          {
            title: '前端监控',
            collapsable: false,
            path: '/project/monitor#前端监控'
          },
          {
            title: '组件开发',
            collapsable: false,
            path: '/project/ui-component#组件开发'
          },
          {
            title: '私服搭建',
            collapsable: false,
            path: '/project/private-npm#私服搭建',
          },
          {
            title: 'wokoo浏览器插架',
            collapsable: false,
            path: '/project/wokoo#私服搭建',
          }
        ]
      },
      {
        title: '算法学习',
        path: '/sf',
        sidebarDepth: 0,
        collapsable: false
      },
      {
        title: '计算机408课本',
        path: '/408',
        sidebarDepth: 0,
        collapsable: false
      }
    ]
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@images': '/images'
      }
    }
  }
}