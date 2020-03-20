# Webpack loader

默认情况下 webpack 只能处理 Javascript 代码，而在我们使用 webpack 的过程中它几乎是无所不能，这其中原因就是我们配置了各种各样的loader

#### 1、什么是loader ？

在 webpack 中 loader 是一个资源转换器，它可以将Javascript之外的任何静态资源进行打包转换，经过一个个loader处理之后得到我们最终想要的资源

#### 2、loader 的写法

同步loader

```javascript
// 写法一：直接返回
module.exports = function(source,other){
  return transform(resource)
}

// 写法二：利用 this.callback 返回 ，之后必须 return undefind
module.exports = function(source,other){
  this.callback(null,transform(source),other)
  return
}
```

异步loader

```javascript
module.exports = function(source,other){
   const cb  = this.async()
   transform(source,(err,result) => { 
     if(err) return cb(err)
     cb(null,result)
   })
}
```

#### 3、loader 的执行顺序

1、从右到左 css-loader -> postcss-loader -> less-loader

```javascript
{
  test: /\.less$/,
  use: ['css-loader', 'postcss-loader', 'less-loader']
}
```

2、从下到上 css-loader -> postcss-loader -> less-loader

```javascript
{
  test: /\.less$/,
  use: [{
   loader:'css-loader'
  },{
   loader:'postcss-loader'
  },{
   loader:'less-loader'
  }]
}
```

3、从执行顺序维度其实分为4种loader，分别是：pre、normal、inline、post loader , 默认情况都是 normal loader 按上面两种说的顺序执行，但是通过 onforce 属性指定类型之后不一样了，得按 pre、normal、inline、post loader 的顺序执行

```javascript
{
  test: /\.less$/,
  use: [{
   loader:'postcss-loader' // 不指定，默认 normal loader
  },{
   onforce:'post',
   loader:'less-loader'
  }{
   onforce:'pre', 
   loader:'css-loader'
  },]
}
```

#### 4、内联 loader (inline loader)

#### 5、loader-utils

loader-utils 开发loader时用的一个神器，用它可以很方便的获取配置loader时传过来的参数等

```javascript
 npm install -D loader-utils
```

```javascript
{
  test: /\.js$/,
  use: [{
      loader: 'babel-loader'
    }, {
      loader: path.resolve(__dirname, './loader/testLoader?a=1&b=2'),
      options: {
      limit: 1024
    }
  }]
}
```



```javascript
const {
  getOptions,
  parseQuery,
  stringifyRequest,
  getRemainingRequest,
  getCurrentRequest,
  isUrlRequest,
  urlToRequest,
  parseString,
  getHashDigest,
  interpolateName
} = require('loader-utils')

module.exports = function (source) {
   // 可以获取 query、options 的参数
   const params = getOptions(this) 
   Object.keys(params).forEach( key => params[key])
   // 转换 this.query 为 Obejct
   const data = parseQuery(this.query)
   Object.keys(data).forEach( key => params[key])
   return source
}

```


#### 6、loader-runner

loader-runner 是 webapck 内部用来执行loader的一个独立的包，我们在编写loader的时候可以很方便的使用它用来试调

1、安装

```javascript
npm install -D loader-runner
```
2、使用

testLoader、testLoader2

```javascript
const loaderUtils = require('loader-utils')
module.exports = function (resource) {
  console.log(loaderUtils.getOptions(this))
  return resource
}
```

```javascript
const fs = require('fs')
const path = require('path')
const { runLoaders } = require('loader-runner')

runLoaders({
  resource: path.resolve(__dirname, './test.js'),
  loaders: [{
    loader: path.resolve(__dirname, './testLoader2'),
    options: {
      limit: 1024
    }
  }, path.resolve(__dirname, './testLoader?id=234')],
  context: { minimize: true },
  readResource: fs.readFile.bind(fs)
}, function (err, result) {
  // console.log(result)
  // { 
  //   result: [ 'console.log(\'test\')\n' ],
  //   resourceBuffer: <Buffer 63 6f 6e 73 6f 6c 65 2e 6c 6f 67 28 27 74 65 73 74 27 29 0a>,
  //   cacheable: true,
  //   fileDependencies: [ '/Users/liyanping/github/LearningWebpack/loaderRunner/test.js' ],
  //   contextDependencies: [],
  //   missingDependencies: [] 
  // }
})
```

#### 7、loader 的内部机制






