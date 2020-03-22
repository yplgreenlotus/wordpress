# Webpack 构建优化分析

#### 1、缩小构建目标

缩小构建目标一般都是通过指定或排除后续目录，不需要去打包解析等

例如：

```javascript
{
  test: /\.js$/,
  // 排除 node_modules 目录下的js,因为一般来讲发布在npm上的包基本都已经解析过了
  // 这里直接用就就行不不需要转换了,节约打包时间
  exclude: path.join(__dirname, 'node_modules'),
  use: ['babel-loader']
}, {
  test: /\.vue$/,
  // 这里比较有明确的指定查找了vue文件的路径，提供打包性能
  include: [path.join(__dirname, './src')],
  use: ['vue-loader']
}
```

```javascript
  resolve: {
    // 默认是.js、.json , 但是在vue工程上其实.json用的比较少
    // 所以这明确指定 .vue', '.js'，如果这里数组越大，搜索匹配越多，所有就越慢
    // 没有指定的要求直接带后缀
    extensions: ['.vue', '.js'],
    // 可以明确指定第三方包就是在node_modules，提高资源定位性能
    modules: [path.join(__dirname, 'node_modules')],
    // 明确告诉webpack第三方包的入口是在 package.json 的 main 字段上
    mainFields: ['main'],
    // 明确资源，提高webpack资源定位效率
    alias: {
      '@': path.resolve(__dirname, 'src'),
      vue: 'vue/dist/vue.esm.js'
    }
  },
```


#### 2、启用多进程打包

默认 webapck 是单线程打包，如果项目大的话花费的时间相对就要长一些，其实可以通过一些方法提高打包效率

1、使用 happypack 开启多线程打包

```javascript

    var HappyPack = require('happypack')

    module:{
      rules:[{
        test: /\.js$/,
        use: 'happypack/loader?id=js',
        exclude: path.join(__dirname, 'node_modules')
      }]
    }

    plugins:[
      new HappyPack({
        id: 'js',
        threads: 4,
        loaders: ['babel-loader']
      })
    ]
```

2、使用 webpack 官方提供的 thread-loader 开启多线程打包

```javascript
  module: {
    rules: [{
      test: /\.js$/,
      // 当然 thread-loader 可以配置options
      use: ['thread-loader', 'babel-loader'],
      exclude: path.join(__dirname, 'node_modules')
    }]
  }
```

3、开启并行多实例压缩

TerserPlugin 是 webpack 4.X 默认的压缩插件，支持压缩 es6 语法代码，而目前 uglifyjs-webpack-plugin 目前还不支持

```javascript
  module.exports = {
    minimizer:{
      new TerserPlugin({
        parallel:4
      })
    }
  }
```

其实 uglifyjs-webpack-plugin 、 parallel-uglify-plugin 都是支持并行多实例压缩的

```javascript
  module.exports = {
    new UglifyjsWebpackPlugin({
       parallel:true
    }),
    new ParallelUglifyPlugin(options)
  }
```

当然开启多线程打包其实同样也会增加资源开销，所以在打包工程不是很大的情况下不是很明显，建议在比较大的项目工程中使用，目前happypack的维护者对它的维护已经不怎么频繁，建议使用thread-loader


#### 3、启用预编译

启用预编译就是说可以提前给一些比较稳定的业务、基础库进行打包，最后对业务代码进行打包的时候就直接引用即可，从而达到打包加速的目的 主要用到时webpack的内置插件： DllPlugin、DllReferencePlugin

1、使用 webpack.DllPlugin 预编译基础库

```javascript
const webpack = require('webpack')
const path = require('path')

const config = {
  mode: 'production',
  entry: {
    vendors: ['vue', 'vue-router'],
    element: ['element-ui']
  },
  output: {
    filename: '[name].dll.[chunkhash:8].js', // 预编译的库产出的文件
    path: path.resolve(__dirname, 'dll'),
    library: '[name]' // 暴露出 dll 的名称
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]', // dll 暴露的名称
      path: path.resolve(__dirname, './dll/[name].manifest.json') // 产出的manifest文件
    })
  ]
}

webpack(config, () => { console.log('ending') })

```

2、使用 webpack.DllReferencePlugin 引入预编译的库

```javascript
  plugins:[
    new webpack.DllReferencePlugin({
      manifest: require('./dll/vendors.manifest.json') // 引入之前产出的manifest文件
    }),
    new webpack.DllReferencePlugin({
      manifest: require('./dll/element.manifest.json') // 引入之前产出的manifest文件
    })
  ]
```

#### 4、启用构建缓存

其实在程序界感觉都离不开缓存，缓存虽然在第一次没有用，但是在第二次的时候就有很好的效率提升，在webpack打包中，如果某个功能开启了缓存，就会在 node_moudles下有个 .cache 目录保存缓存的资源

1、开启 babel-loader 的缓存

```javascript
  {
    test: /\.js$/,
    use: ['babel-loader?caheDirectory=true']
  }
```

2、开启压缩缓存

```javascript
 optimization: {
    minimizer: [
      new TerserWebpackPlugin({ 
        parallel: true ,
        cache: true // 开启压缩缓存
      })
    ],
 }
```

3、提出模块转换缓存，可以使用 cache-loader、hard-source-webpack-plugin

```javascript
  pluigs:[
    new HardSourceWebpackPlugin()
  ]
```

#### 5、体积优化

1、tree shaking 无用的JS、CSS

2、使用 ignorePlugin 避免打包无用的代码

3、动态引入

4、压缩图片