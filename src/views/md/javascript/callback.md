

# Callback

即回调函数，是一个通过函数指针调用的函数。如果你把函数的指针（地址）作为参数传递给另一个函数，当这个指针被用为调用它所指向的函数时，我们就说这是回调函数

#### 1、示例

Ajax 请求是最经典的异步案例，所以在示例回调的同时，温习下 XmlHttpRequest 对象的使用

```javascript
function ajax(url, data = {}, success, fail) {
  const request = new XMLHttpRequest()
  // 监听请求状态
  // 同步可以省去额外的 onreadystatechange 代码
  request.onreadystatechange = function () {
    if (request.readyState === 4) {
      if (request.status === 200) {
        success && success(request.responseText)
      } else {
        fail && fail(request.status)
      }
    }
  }
  // 方法初始化一个请求
  // true 表示异步,false表示同步, XMLHttpRequest默认异步
  request.open('POST', url, true)
  // post 请求必须设置
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  // 请求主体参数，GET请求可以设置为null
  request.send('a=123&b=456')
}

ajax('https://coding.imooc.com/class/ajaxbigdatacourserecommend', {}, function (res) {
  console.log(res)
}, function (err) {
  console.log(err)
})
```

#### 2、示例

```javascript
const url = 'https://coding.imooc.com/class/ajaxbigdatacourserecommend'
const url2 = 'https://coding.imooc.com/class/ajaxbigdatacourserecommend2'
const url3 = 'https://coding.imooc.com/class/ajaxbigdatacourserecommend3'
const url4 = 'https://coding.imooc.com/class/ajaxbigdatacourserecommend4'
const url5 = 'https://coding.imooc.com/class/ajaxbigdatacourserecommend5'
// ...

ajax(url, function (res) {
  ajax(url2, res, function (res2) {
    ajax(url3, res2, function (res3) {
      ajax(url4, res3, function (res4) {
        ajax(url5, res4, function (res5) {
          // ...
        })
      })
    })
  })
})

```

看到上面的示例你不知你第一感觉是什么 ？ 如何相互依赖嵌套N层，那这样串行的回调还有完没完，

这就是所谓的 callback 回调地狱 问题。一旦业务逻辑复杂，估计人都晕菜了，而且维护成本也比较高，

串行嵌套多了之后，代码并不是很优雅，针对这些痛点，这时 promise 粉墨登场了！！！




