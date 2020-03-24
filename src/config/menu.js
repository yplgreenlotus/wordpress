import http from './menus/http'
import https from './menus/https'
import webpack from './menus/webpack'
import introduce from './menus/introduce'
import javascript from './menus/javascript'
import node from './menus/node'
import es6 from './menus/es6'
// import vue from './menus/vue'
// import react from './menus/react'
// import dataStructure from './menus/dataStructure'
// import designPattern from './menus/designPattern'

export default [{
  name: '简介',
  path: '/introduce',
  children: [...introduce]
}, {
  name: 'javascript',
  path: '/javascript',
  children: [...javascript]
}, {
  name: 'es6',
  path: '/es6',
  children: [...es6]
}, {
  name: 'http',
  path: '/http',
  children: [...http]
}, {
  name: 'https',
  path: '/https',
  children: [...https]
}, {
  name: 'webpack',
  path: '/webpack',
  children: [...webpack]
}, {
  name: 'node',
  path: '/node',
  children: [...node]
}
// , {
//   name: 'dom',
//   path: '/dom',
//   children: [...node]
// }, {
//   name: 'node',
//   path: '/node',
//   children: [...node]
// }, {
//   name: 'vue',
//   path: '/vue',
//   children: [...vue]
// }, {
//   name: 'react',
//   path: '/react',
//   children: [...react]
// }, {
//   name: 'react native',
//   path: '/reactnative',
//   children: []
// }, {
//   name: 'flutter',
//   path: '/flutter',
//   children: []
// }, {
//   name: '数据结构',
//   path: '/dataStructure',
//   children: [...dataStructure]
// }, {
//   name: '设计模式',
//   path: '/designPattern',
//   children: [...designPattern]
// }, {
//   name: '网络编程',
//   path: '/network',
//   children: []
// }, {
//   name: '小程序',
//   path: '/minprogram',
//   children: []
// }, {
//   name: '微信公众号',
//   path: '/wechat',
//   children: []
// }, {
//   name: '数据库',
//   path: '/database',
//   children: []
// }, {
//   name: '部署',
//   path: '/release',
//   children: []
// }, {
//   name: '工程化',
//   path: '/engineering',
//   children: []
// }, {
//   name: '单元测试',
//   path: '/unit',
//   children: []
// }
]
