# Webpack plugin

Webpack 本质上是一个基于事件流的机制的插件生态系统。插件贯穿了Webpack的整个生命周期，它在整个流程中得每个关键节点都进行了相应的事件触发，比如：初始化（entryOption）、开始编译（run）、依赖递归分析（make）、模块解析（beforeResolve）、开始构建模块（buildModule）、生成AST（normalModuleLoader）、遍历AST (program)、模块构建完成（seal）、输出目录（afterEmit）等，那么插件要做的就是在这些关键节点上绑定事件，等着Webpack在执行到相应的节点进行事件触发，我们通过监听这些相应的事件来完成自己的要达到的目的

1、插件的编写

通常插件就是一个普通的对象或者函数，对象里面必须有一个 apply 方法，函数的话在webpack内部其实就是当 apply 方法用，如下：

```javascript

class TestPlugin {
  constructor (...args) {
    this.args = args
  }

  apply (compiler) {
    // 资源生成到目录之后触发
    compiler.hooks.afterEmit.tapAsync('afterEmit', function (compilation, next) {
      console.log('构建文件列表：')
      Object.keys(compilation.assets).forEach(filename => console.log(filename))
      next()
    })
  }
}

module.exports = TestPlugin

```

2、插件的配置

在 webpack.config.js 文件的 plugins 属性中进行配置，webpack 在初始过程中会拿这个plugin属性进行循环调用插件的 apply 方法，这样插件上的的事件就都进行了绑定，接着就是等着webpack在相应的节点上进行触发

webpack.config.js

```javascript
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.ProgressPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new CompilerPlugin(),
    new CompilationPlugin(),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
      alwaysWriteToDisk: true,
      reject: true
    })
  ]
```
webapck.js

```javascript
if (options.plugins && Array.isArray(options.plugins)) {
  for (const plugin of options.plugins) {
    if (typeof plugin === "function") {
      plugin.call(compiler, compiler);
    } else {
      plugin.apply(compiler);
    }
  }
}
```




