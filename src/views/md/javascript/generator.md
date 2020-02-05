---
description: >-
  Promise 表示一个异步操作的最终结果，与之进行交互的方式主要是 then 方法，该方法注册了两个回调函数，用于接收 promise 的终值或本
  promise 不能执行的原因。当初为了解决“回调地狱”问题，提出了Promise对象，后来被加入了ES6标准！！！
---

# promise

#### 1、示例

首先要对  Promise 进行说明，先看下它的用法：

```javascript
const fetch = require('node-fetch')
new Promise((resolve, reject) => {
  const promise = fetch('https://coding.imooc.com/class/ajaxbigdatacourserecommend')
  promise.then(res => {
    resolve(res)
  }).catch(err => {
    reject(err)
  })
}).then(data => {
  console.log(data)
}).catch(err => {
  throw err
})

```

根据上面的使用，我们来分析 Promise 的使用特征：

首先：通过 new 关键字 实例化了一个 Promise 对象；

其次：Promise 构造方法 传入了 一个 函数，函数里面有两个参数 ，分别是：resovle , reject

再次：Promise 实例 通过 then 方法 给 自己 添加了一个回调

最后：Promise 构造方法 传入的函数体里面根据业务逻辑执行：resolve 或 reject 回调

#### 接着我们通过上面的描述特征来实现一个简单的 Promise 对象：

```javascript
const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'
const FUNCTION = 'function'

class GreenPromise {
  constructor(fn) {
    // promise 状态转换：
    // 可由：padding ---> resolved
    // 可由：padding ---> rejected
    // 但是返过来不行
    this.status = PENDING
    // promise 实际的 value
    this.value = null
    // 通过then方法收集的resovle回调队列
    this.callbackResovles = []
    // 通过then方法收集的reject回调队列
    this.callbackRejects = []
    
    const resolve = (data) => {
      if (this.status === PENDING) {
        this.status = RESOLVED
        this.value = data
        this.callbackResovles.forEach(func => {
          func(this.value)
        })
      }
    }
    const reject = (error) => {
      this.status = REJECTED
      this.value = error
      this.callbackRejects.forEach(func => {
        func(this.value)
      })
    }
    // 这里防止执行的 fn 执行的时候异常，用try/catch 捕获
    try {
      fn(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }
  then(onResolved, onRejected) {
    // 避免 then(123) 这样用报错
    onResolved = typeof onResolved === FUNCTION ? onResolved : data => data
    // 避免 then(123) 这样用报错
    onRejected = typeof onRejected === FUNCTION ? onRejected : err => {
      throw err
    }
        
    // 用法1：执行 resolve 的时候（callbackResovles 应该是空的），
    // then 方法还没有执行，当then执行后，
    // status 的状态已经是RESOLVED，所以这里直接调用即可
    if (this.status === RESOLVED) {
      onResolved(this.value)
    }
    
    // 用法 1 , 同上
    if (this.status === REJECTED) {
      onRejected(this.value)
    }
    
    // 用法 2：由于 resvole 被延迟 1000 ms 执行
    // 此时 this.status 的状态为PENDING
    // 故将回调事件保存到回调 队列中
    if (this.status === PENDING) {
      this.callbackResovles.push(onResolved)
      this.callbackRejects.push(onRejected)
    }
  }
}

// 用法 1
new GreenPromise((resolve, reject) => {
  if (4 > 3) {
    resolve(true)
  } else {
    reject(false)
  }
}).then(data => {
  console.log(data)
})

// 用法 2
// 这样用会出现 then 方法 在执行时，this.status 的状态为 padding
new GreenPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(true)
  }, 1000)
}).then(res => {
  console.log(res)
})
```

## 



