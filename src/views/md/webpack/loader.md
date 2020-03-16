# Webpack loader

默认情况下 webpack 只能处理 Javascript 代码，那如果要处理其他类型文件该怎么办呢 ？那我们是否可以给这些类型的文件内容套上一个js的外壳，让 webpack 能够识别是否就解决了问题呢 ？ 答案是肯定的

#### 1、什么是loader ？

在 webpack 中 loader 是一个资源转换加载器，它可以将Javascript之外的任何静态资源进行转换打包加载。如果从实现上来讲loader就是一个遵循common规范的函数导出对象，webapck 会使用 loader runner 来调用这个函数 ，并且把相关的资源内容、参数传给它 ，函数接受到这些参数之后进行相关的转换处理，最后返回出去

#### 2、loader的分类

1、同步异步的维度：loader 可以分为 同步loader 与 异步loader

```javascript
// 同步 loader
module.exports = function(resource,other){
  return transform(resource)
}

// 同步 loader 也可以 调用 this.callback 返回，但是后面 必须 return undefined
module.exports = function(resource,other){
  this.callback(null,transform(resource),other)
  return
}

// 异步 loader
module.exports = function(resource,other){
  const callback = this.async()
  transform(resource,function(err,result){
    if(err){
      callback(err)
    }else{
      callback(null,result,other)
    }
  })
}

```

2、执行顺序的维度有 pre loader、normal loader 、post loader等 3 种

```javascript
// 1、从右到左 或者 从下到上 less-loader -> postcss-loader -> css-loader -> vue-style-loader
{
  test: /\.less$/,
  use: ['vue-style-loader', 'css-loader', 'postcss-loader', 'less-loader']
}
// 或者
{
  test: /\.less$/,
  use: [{
   loader:'vue-style-loader'
  },{
   loader:'css-loader'
  },{
   loader:'postcss-loader'
  },{
   loader:'less-loader'
  }]
}
// 通过 onforce

```

3、内联loader

