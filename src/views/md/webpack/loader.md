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

#### 5、loader-util

#### 6、loader-runner

#### 7、loader 的内部机制






