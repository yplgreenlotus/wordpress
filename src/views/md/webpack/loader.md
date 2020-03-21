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
   // 这里告诉loader-runner 采用异步的方式，默认是同步，内部有个标识会控制
   // 接着它会返回一个内部的callback,大概就一个next函数
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

#### 6、loader 的内部机制

其实一个完整的loader应该是下面这样的：

```javascript
// loader 的 normal 方法
function greenLoader (source,other) {
   const res = dealwidthSource(source,other)
   this.callback(null,res)
}
// loader 的 pitch 方法
greenLoader.pitch = function(remainingRequest, precedingRequest, data) {
  this.data[key] = otherData
  let result
  // do something , result is undefined or other
  return result
}
module.exports = greenLoader
```
根据官方给出的例子,如果给某类资源配置的是如下loader：

```javascript
  use: [
    'a-loader',
    'b-loader',
    'c-loader'
  ]
```

那么它的执行过程是：

```javascript

|- a-loader `pitch`
  |- b-loader `pitch`
    |- c-loader `pitch`
      |- requested module is picked up as a dependency
    |- c-loader normal execution
  |- b-loader normal execution
|- a-loader normal execution

```

从上面可以看出，内部的执行过程是先从左到右迭代每个loader的pitch方法，然后在从右到左迭代loader normal 方法，至于这么设计的原因主要有两点：

1、共享数据：每个loader都可以在执行pitch的时候添加一些全局共享的数据

2、熔断：如果loader有返回值，那么就中断后面的loader执行，直接执行前面 loader 的 noraml 方法，放回的内容将取代之前传入的资源

例如，上面执行到 b-loader 的 pitch 方法是，return 资源

```javascript
  module.exports = function(content) {
    return someSyncOperation(content);
  };

  module.exports.pitch = function(remainingRequest, precedingRequest, data) {
    if (someCondition()) {
      return "module.exports = require(" + JSON.stringify("-!" + remainingRequest) + ");";
    }
  }
```
那么执行结果就是：

```javascript
|- a-loader `pitch`
  |- b-loader `pitch` returns a module
|- a-loader normal execution
```

至于loader的上下文，这里不是 webpack ，而是 loader-runner 定义的loaderContext的，是执行这组loader共享的一个实例，里面挂了很多Api，具体的可以参考 webpack 官方文档

#### 7、loader-runner

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

3、源码解析

打开 loader-runner 源码可以看到两个主要的js:

1、loadLoader.js 它主要是用来 require loader 的本身

2、loaderRunner.js 的主要作用就是用 loader 转换资源文件。具体实现如下：


a、导出了 runLoaders 函数，里面定义了 loader-runner 全局上下文 loaderContext , 里面定义了运行loader的变量、api等

b、接着调用 iteratePitchingLoaders 方法迭代每个 loader 的 pitch 方法

iteratePitchingLoaders 方法：

```javascript
function iteratePitchingLoaders (options, loaderContext, callback) {
  // 判断是否是最后一个loader pitch,是就开始 processResource ，
  // 他会使用传入的：readResource （fs.readFile.bind(fs)）读取资源
  // 然后开启 从右到左的 loader normal 迭代
  if (loaderContext.loaderIndex >= loaderContext.loaders.length) {
    return processResource(options, loaderContext, callback)
  }
  // 获取当前loader
  var currentLoaderObject = loaderContext.loaders[loaderContext.loaderIndex]
  // 当前loader pitch 是否已经执行
  if (currentLoaderObject.pitchExecuted) {
    loaderContext.loaderIndex++
    return iteratePitchingLoaders(options, loaderContext, callback)
  }
  // 首先用 loadLoader.js 的 loadLoader 函数加载loader
  // 让后执行pitch
  loadLoader(currentLoaderObject, function (err) {
    if (err) {
      loaderContext.cacheable(false)
      return callback(err)
    }
    // 检查当前loader是存在 pitch 函数
    var fn = currentLoaderObject.pitch
    currentLoaderObject.pitchExecuted = true
    // 不存在则执行下一个
    if (!fn) return iteratePitchingLoaders(options, loaderContext, callback)
    // 否则执行当前这个pitch
    runSyncOrAsync(
      fn,
      loaderContext,
      [loaderContext.remainingRequest, loaderContext.previousRequest, currentLoaderObject.data = {}],
      function (err) {
        if (err) return callback(err)
        var args = Array.prototype.slice.call(arguments, 1)
        var hasArg = args.some(function (value) {
          return value !== undefined
        })
        if (hasArg) {
          // 如果有返回值，就放弃后面的loader,执行上一个loader noraml 函数,并且带上了返回参数
          loaderContext.loaderIndex--
          iterateNormalLoaders(options, loaderContext, args, callback)
        } else {
          // 否则继续执行下个pitch
          iteratePitchingLoaders(options, loaderContext, callback)
        }
      }
    )
  })
}
```
processResource 方法：

```javascript
function processResource(options, loaderContext, callback) {
  // set loader index to last loader
  loaderContext.loaderIndex = loaderContext.loaders.length - 1;
  var resourcePath = loaderContext.resourcePath;
  if(resourcePath) {
    loaderContext.addDependency(resourcePath);
    options.readResource(resourcePath, function(err, buffer) {
      if(err) return callback(err);
      options.resourceBuffer = buffer;
      iterateNormalLoaders(options, loaderContext, [buffer], callback);
    });
  } else {
    iterateNormalLoaders(options, loaderContext, [null], callback);
  }
}
```

iterateNormalLoaders 方法：

```javascript
function iterateNormalLoaders (options, loaderContext, args, callback) {
  if (loaderContext.loaderIndex < 0) { return callback(null, args) }

  var currentLoaderObject = loaderContext.loaders[loaderContext.loaderIndex]

  // iterate
  if (currentLoaderObject.normalExecuted) {
    loaderContext.loaderIndex--
    return iterateNormalLoaders(options, loaderContext, args, callback)
  }

  var fn = currentLoaderObject.normal
  currentLoaderObject.normalExecuted = true
  if (!fn) {
    return iterateNormalLoaders(options, loaderContext, args, callback)
  }

  convertArgs(args, currentLoaderObject.raw)

  runSyncOrAsync(fn, loaderContext, args, function (err) {
    if (err) return callback(err)

    var args = Array.prototype.slice.call(arguments, 1)
    iterateNormalLoaders(options, loaderContext, args, callback)
  })
}
```

runSyncOrAsync 方法：

```javascript
function runSyncOrAsync(fn, context, args, callback) {
  // 默认是同步
  var isSync = true;
  var isDone = false;
  var isError = false; // internal error
  var reportedError = false;
  // 这个就是写loader时的 this.async
  context.async = function async() {
    if(isDone) {
      // ...
    }
    // 表示异步
    isSync = false;
    // 放回内部的callback,其实就是 this.callback
    return innerCallback;
  };

  var innerCallback = context.callback = function() {
    if(isDone) { 
      // ...
    }
    isDone = true;
    isSync = false;
    try {
      callback.apply(null, arguments);
    } catch(e) {
      isError = true;
      throw e;
    }
  };

  try {
    // 自执行，上下文就是 loaderContenxt
    // pitch args : [loaderContext.remainingRequest, loaderContext.previousRequest, currentLoaderObject.data = {}]
    var result = (function LOADER_EXECUTION() {
      return fn.apply(context, args);
    }());

    if(isSync) {
      isDone = true;
      // 没有放回值
      if(result === undefined){
        return callback();
      }

      if(result && typeof result === "object" && typeof result.then === "function") {
        // pitch 返回 promise 
        return result.then(function(r) {
          callback(null, r);
        }, callback);     
      }

      // 有返回值
      return callback(null, result);
    }
  } catch(e) {
  // ...
  }
}
```














