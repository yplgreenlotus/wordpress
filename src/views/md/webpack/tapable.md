# Tapable

Tapable 是一个小型的发布订阅类型的库，类似于 node 中的 EventEmitter。Webpack 本质上是一种事件流的机制，它的工作流程就是将各个插件串联起来，而实现这一切的底层库就是 Tapable，所以搞清楚 Tapable 底层实现机制有利于我们更好的理解 Webpack 的底层原理

#### Tapable Hook 类

```javascript
  const {
      SyncHook, // 同步Hook
      SyncBailHook, // 同步熔断Hook
      SyncWaterfallHook, // 同步瀑布Hook
      SyncLoopHook, // 同步循环Hook
      AsyncParallelHook, // 异步并行Hook
      AsyncParallelBailHook, // 异步并行熔断Hook
      AsyncSeriesHook, // 异步串行Hook
      AsyncSeriesBailHook, // 异步串行熔断Hook
      AsyncSeriesWaterfallHook // 异步串行瀑布Hook
  } = require("tapable");
```

#### 1、SyncHook

SyncHook 就一个同步Hook类，通过 tap 监听事件，通过 call 来触发监听事件 , 实现原理如下

```javascript
class SyncHook {
  constructor (args) {
    if (!Array.isArray(args)) args = []
    this.args = args
    this.taps = []
  }

  tap (...args) {
    this.taps.push(args.pop())
  }

  call (...args) {
    const params = args.splice(0, this.args.length)
    this.taps.forEach(fn => fn(...params))
  }
}

module.exports = SyncHook

```

```javascript

const SyncHook = require('./lib/SyncHook.js')

class Test {
  constructor () {
    this.hook = {
      sync: new SyncHook(['name'])
    }
  }

  listener () {
    this.hook.sync.tap('webpack', function (name) {
      console.log(`${name} 正在研究 webpack`)
    })
    this.hook.sync.tap('node', function (name) {
      console.log(`${name} 在在学习 node `)
    })
  }

  trigger () {
    // call 里面的参数 与 实例化SyncHook时的参数个数对应
    this.hook.sync.call('greenlotus')
  }
}
const test = new Test()
test.listener()
test.trigger()
```

#### 2、SyncBailHook

SyncBailHook 是一个同步熔断Hook，如果上一个监听函数返回了一个非undefined值，那就立即中断执行下面的监听函数

```javascript
class SyncBailHook {
  constructor (args) {
    if (!Array.isArray(args)) args = []
    this.args = args
    this.taps = []
  }

  tap (...args) {
    this.taps.push(args.pop())
  }

  call (...args) {
    let ret
    let index = 0
    const params = args.splice(0, this.args.length)
    do {
      ret = this.taps[index++](...params)
    } while (ret === undefined && index < this.taps.length)
  }
}

module.exports = SyncBailHook

```

```javascript
const SyncBailHook = require('./lib/SyncBailHook.js')
class Test {
  constructor () {
    this.hook = {
      sync: new SyncBailHook(['name'])
    }
  }

  /**
   * 监听事件
   */
  listener () {
    this.hook.sync.tap('webpack', function (name) {
      console.log(`${name} 正在研究 webpack`)
      return 'stop'
    })
    this.hook.sync.tap('node', function (name) {
      console.log(`${name} 在在学习 node `)
    })
  }

  /**
   * 触发事件
   */
  trigger () {
    this.hook.sync.call('greenlotus')
  }
}

const test = new Test()
test.listener()
test.trigger()
```

#### 3、SyncWaterfallHook

SyncWaterfallHook 是一个瀑布型的Hook，就是说上一个监听函数的返回值会做了一个执行函数的第一个参数

```javascript
class SyncWaterfallHook {
  constructor (args) {
    if (!Array.isArray(args)) args = []
    this.args = args
    this.taps = []
  }

  tap (...args) {
    this.taps.push(args.pop())
  }

  call (...args) {
    const params = args.splice(0, this.args.length)
    const [fn, ...others] = this.taps
    others.reduce(function (ret, fn) {
      if (ret) params[0] = ret
      return fn(...params)
    }, fn(...params))
  }
}

module.exports = SyncWaterfallHook
```

```javascript

const SyncWaterfallHook = require('./lib/SyncWaterfallHook.js')

class Test {
  constructor () {
    this.hook = {
      sync: new SyncWaterfallHook(['name', 'age', 'sex'])
    }
  }

  listener () {
    this.hook.sync.tap('one', function (name, age, sex) {
      console.log(`姓名：${name}，年龄：${age}，性别：${sex}`)
      return 'xiaowu'
    })
    this.hook.sync.tap('two', function (name, age, sex) {
      console.log(`姓名：${name}，年龄：${age}，性别：${sex}`)
      return 'xiaohe'
    })
    this.hook.sync.tap('three', function (name, age, sex) {
      console.log(`姓名：${name}，年龄：${age}，性别：${sex}`)
    })
  }

  trigger () {
    this.hook.sync.call('xiaoli', 23, 'women')
  }
}

const test = new Test()
test.listener()
test.trigger()
```

#### 4、SyncLoopHook

SyncLoopHook 是一个循环型的Hook，就是根据监听函数的返回值来决定是否再次执行函数，只要返回任意非undefined就会继续执行函数

```javascript
class SyncLoopHook {
  constructor (args) {
    if (!Array.isArray(args)) args = []
    this.args = args
    this.taps = []
  }

  tap (...args) {
    this.taps.push(args.pop())
  }

  call (...args) {
    let ret
    const params = args.splice(0, this.args.length)
    this.taps.forEach((fn) => {
      do {
        ret = fn(...params)
      } while (ret !== undefined)
    })
  }
}

module.exports = SyncLoopHook
```
```javascript

const SyncLoopHook = require('./lib/SyncLoopHook.js')

class Test {
  constructor () {
    this.hook = {
      sync: new SyncLoopHook(['name'])
    }
  }

  listener () {
    let index = 1
    this.hook.sync.tap('webpack', function (name) {
      console.log(`${name} 学习 1 遍 webpack`)
    })
    this.hook.sync.tap('node', function (name) {
      console.log(`${name} 学习 ${index} 遍 node`)
      if (index >= 5) {
        return undefined
      } else {
        index++
        return 'next time'
      }
    })
    this.hook.sync.tap('vue', function (name) {
      console.log(`${name} 学习 1 遍 vue`)
    })
  }

  trigger () {
    this.hook.sync.call('xiaoli')
  }
}

const test = new Test()
test.listener()
test.trigger()
```

#### 5、AsyncParallelHook

AsyncParallelHook 异步 并行 Hook ，异步 Hook 有两种实现方式, 一种是基于 callback 实现 ， 通过 tapAsync 实现监听，使用 callAsync 触发监听 ，另一种是基于 Promise 实现，通过 tapPromise 实现监听，使用 promise 触发监听 

```javascript
class AsyncParallelHook {
  constructor (args) {
    if (!Array.isArray(args)) args = []
    this.args = args
    this.taps = []
  }

  tapAsync (name, handler) {
    this.taps.push({ name, handler, type: 'async' })
  }

  tapPromise (name, handler) {
    this.taps.push({ name, handler, type: 'promise' })
  }

  callAsync (...args) {
    // 拿到最终的回调函数
    const cb = args.pop()
    // 拿到call传进来的参数
    const params = args.splice(0, this.args.length)
    this.execute(params, cb)
  }

  promise (...args) {
    // 依次执行监听器，每个监听器返回的都是 promise ，收集所有返回的 promise
    const params = args.splice(0, this.args.length)
    return new Promise((resolve, reject) => {
      this.execute(params, resolve)
    })
  }

  execute (args, cb) {
    let len = this.taps.length
    const done = () => {
      len--
      if (len === 0) cb()
    }
    this.taps.forEach(tap => {
      const { type, handler } = tap
      const ret = handler(...args, type === 'async' ? done : undefined)
      if (ret && ret.then) ret.then(() => done())
    })
  }
}

module.exports = AsyncParallelHook
```

```javascript

const AsyncParallelHook = require('./lib/AsyncParallelHook.js')

class Test {
  constructor () {
    this.hook = {
      async: new AsyncParallelHook(['name'])
    }
  }

  /**
   * 监听事件
   */
  listener () {
    this.hook.async.tapAsync('webpack', function (name, callback) {
      setTimeout(() => {
        console.log(`${name}：`, '学习 webpack')
        callback && callback()
      }, 2000)
    })
    this.hook.async.tapAsync('node', function (name, callback) {
      setTimeout(() => {
        console.log(`${name}：`, '学习 node')
        callback && callback()
      }, 2000)
    })
  }

  /**
   * 监听promise事件
   */
  listenerPromise () {
    this.hook.async.tapPromise('vue', function (name) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log(`${name}：`, '学习 vue')
          resolve()
        }, 1000)
      })
    })
    this.hook.async.tapPromise('react', function (name) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log(`${name}：`, '学习 react')
          resolve()
        }, 1000)
      })
    })
  }

  /**
   * 触发事件
   */
  trigger () {
    // 触发异步事件，必须有回调
    this.hook.async.callAsync('greenlotus', function () {
      // 最后回调
      console.log('*********** greenlotus 学习完毕 ************')
    })

    // 触发 promise 事件，最后返回 promise
    this.hook.async.promise('ypl').then(() => {
      // 最后执行
      console.log('*********** ypl 学习完毕 ************')
    })
  }
}

const test = new Test()
test.listener()
test.listenerPromise()
test.trigger()
```

#### 6、AsyncParallelBailHook

AsyncParallelBailHook 异步并行熔断，只要任何一个监听函数返回值，都将执行最终回调

```javascript
class AsyncParallelBailHook {
  constructor (args) {
    if (!Array.isArray(args)) args = []
    this.args = args
    this.taps = []
  }

  tapAsync (name, handler) {
    this.taps.push({ name, handler, type: 'async' })
  }

  tapPromise (name, handler) {
    this.taps.push({ name, handler, type: 'promise' })
  }

  callAsync (...args) {
    const cb = args.pop()
    const params = args.splice(0, this.args.length)
    this.execute(params, cb)
  }

  promise (...args) {
    const params = args.splice(0, this.args.length)
    return new Promise((resolve, reject) => {
      this.execute(params, resolve, reject)
    })
  }

  execute (args, cb, reject) {
    const done = (err, res) => {
      if (err && reject) return reject()
      if (err && cb) return cb()
      if (res && cb) return cb()
    }
    this.taps.forEach(tap => {
      const { handler, type } = tap
      if (type === 'promise') {
        handler(...args).then(res => done(null, res), err => done(err))
      } else {
        handler(...args, done)
      }
    })
  }
}

module.exports = AsyncParallelBailHook

```

```javascript

// const { AsyncParallelBailHook } = require('tapable')
const AsyncParallelBailHook = require('./lib/AsyncParallelBailHook.js')

class Test {
  constructor () {
    this.hook = {
      async: new AsyncParallelBailHook(['name'])
    }
  }

  /**
   * 监听事件
   */
  listener () {
    this.hook.async.tapAsync('webpack', function (name, callback) {
      setTimeout(() => {
        console.log(`${name}：`, '学习 webpack')
        callback()
      }, 1000)
    })

    this.hook.async.tapAsync('node', function (name, callback) {
      setTimeout(() => {
        console.log(`${name}：`, '学习 node')
        callback()
      }, 1000)
    })

    this.hook.async.tapPromise('node', function (name) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log(`${name}：`, '学习 tapable')
          reject(new Error('promise熔断型HOOK'))
          // resolve()
        }, 1000)
      })
    })
  }

  /**
   * 触发事件
   */
  trigger () {
    this.hook.async.callAsync('greenlotus', function () {
      console.log('*********** greenlotus 学习完毕 ************')
    })

    this.hook.async.promise('ypl').then(res => {
      console.log('*********** ypl 学习完毕 ************')
    })
  }
}

const test = new Test()
test.listener()
test.trigger()

```

#### 7、AsyncSereisHook 

AsyncSereisHook 异步串行Hook，就是等上一个异步监听函数执行结果已出才执行下一个异步监听函数

```javascript
class AsyncSeriesHook {
  constructor (args) {
    if (!Array.isArray(args)) args = []
    this.args = args
    this.taps = []
  }

  tapAsync (name, handler) {
    this.taps.push({ name, handler, type: 'async' })
  }

  tapPromise (name, handler) {
    this.taps.push({ name, handler, type: 'promise' })
  }

  callAsync (...args) {
    const cb = args.pop()
    const params = args.splice(0, this.args.length)
    this.execute(params, cb)
  }

  promise (...args) {
    const params = args.splice(0, this.args.length)
    return new Promise((resolve, reject) => {
      this.execute(params, resolve)
    })
  }

  execute (args, cb) {
    let index = 0
    const next = () => {
      if (index === this.taps.length) return cb()
      const { handler, type } = this.taps[index++]
      if (type === 'promise') {
        handler(...args).then(() => next())
      } else {
        handler(...args, next)
      }
    }
    next()
  }
}

module.exports = AsyncSeriesHook
```

```javascript
const AsyncSeriesHook = require('./lib/AsyncSeriesHook.js')

class Test {
  constructor () {
    this.hook = {
      async: new AsyncSeriesHook(['name', 'course'])
    }
  }

  listener () {
    // 异步事件，需有回调
    this.hook.async.tapAsync('tapable', function (...args) {
      setTimeout(() => {
        const next = args.pop()
        console.log(`${args[0]} 正在学习${args[1]}`)
        next && next(null, 'webpack')
      }, 1000)
    })
    // 异步事件，需有回调
    this.hook.async.tapAsync('webapck', function (...args) {
      setTimeout(() => {
        const next = args.pop()
        console.log(`${args[0]} 正在学习${args[1]}`)
        next && next(null)
      }, 2000)
    })
  }

  listenerPromise () {
    // 异步事件，使用promise代替回调
    this.hook.async.tapPromise('tapable', function (...args) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log(`${args[0]} 正在学习${args[1]}`)
          resolve()
        }, 1000)
      })
    })

    // 异步事件，使用promise代替回调
    this.hook.async.tapPromise('webapck', function (...args) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log(`${args[0]} 正在学习${args[1]}`)
          resolve()
        }, 1000)
      })
    })
  }

  call () {
    this.hook.async.callAsync('greenlotus', 'node', function () {
      console.log('学习完毕')
    })
  }

  callPromise () {
    this.hook.async.promise('ypl', 'webpack').then(() => {
      console.log('ending')
    })
  }
}
const test = new Test()
test.listener()
test.listenerPromise()
test.call()
test.callPromise()
```

#### 8、AsyncSereisBailHook 

AsyncSereisBailHook 异步串行的熔断Hook，如果上一个监听函数返回了非undefined参数，那么就中断执行下一个函数

```javascript
class AsyncSeriesBailHook {
  constructor (args) {
    if (!Array.isArray(args)) args = []
    this.args = args
    this.taps = []
  }

  tapAsync (name, handler) {
    this.taps.push({ name, handler, type: 'async' })
  }

  tapPromise (name, handler) {
    this.taps.push({ name, handler, type: 'promise' })
  }

  callAsync (...args) {
    const cb = args.pop()
    const params = args.splice(0, this.args.length)
    this.execute(params, cb)
  }

  promise (...args) {
    const params = args.splice(0, this.args.length)
    return new Promise((resolve, reject) => {
      this.execute(params, resolve, reject)
    })
  }

  execute (args, cb, reject) {
    let index = 0
    const done = (err, ret) => {
      if (err) return reject && reject(err)
      if (ret) return cb && cb()
      next()
    }
    const next = () => {
      if (index === this.taps.length) return cb()
      const { type, handler } = this.taps[index++]
      if (type === 'promise') {
        handler(...args).then(res => done(null, res))
      } else {
        handler(...args, done)
      }
    }
    next()
  }
}

module.exports = AsyncSeriesBailHook

```

```javascript

const AsyncSeriesBailHook = require('./lib/AsyncSeriesBailHook.js')
// const { AsyncSeriesBailHook } = require('tapable')

class Test {
  constructor () {
    this.hook = {
      async: new AsyncSeriesBailHook(['name', 'course'])
    }
  }

  listener () {
    // 异步事件，需有回调
    this.hook.async.tapAsync('tapable', function (...args) {
      setTimeout(() => {
        const cb = args.pop()
        console.log(`${args[0]} 正在学习${args[1]}`)
        cb && cb(null, 'stop')
      }, 1000)
    })
    // 异步事件，需有回调
    this.hook.async.tapAsync('webapck', function (...args) {
      setTimeout(() => {
        const cb = args.pop()
        console.log(`${args[0]} 正在学习${args[1]}`)
        cb && cb()
      }, 2000)
    })
  }

  listenerPromise () {
    // 异步事件，使用promise代替回调
    this.hook.async.tapPromise('tapable', function (...args) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log(`${args[0]} 正在学习${args[1]}`)
          // reject(new Error('熔断错误'))
          resolve('stop')
        }, 1000)
      })
    })

    // 异步事件，使用promise代替回调
    this.hook.async.tapPromise('webapck', function (...args) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log(`${args[0]} 正在学习${args[1]}`)
          resolve()
        }, 1000)
      })
    })
  }

  call () {
    this.hook.async.callAsync('greenlotus', 'node', function () {
      console.log('学习完毕')
    })
  }

  callPromise () {
    this.hook.async.promise('ypl', 'webpack').then(() => {
      console.log('ending')
    })
  }
}

const test = new Test()
test.listener()
test.call()
test.listenerPromise()
test.callPromise()

```



#### 9、AsyncSereisWaterfallHook 

AsyncSereisWaterfallHook 异步串行的瀑布Hook，如果上一个函数有返回结果，那么它将作为下一个执行函数的的第一个参数

```javascript
class AsyncSeriesWaterfallHook {
  constructor (args) {
    if (!Array.isArray(args)) args = []
    this.args = args
    this.taps = []
  }

  tapAsync (name, fn) {
    this.taps.push({ name, fn, type: 'async' })
  }

  tapPromise (name, fn) {
    this.taps.push({ name, fn, type: 'promise' })
  }

  callAsync (...args) {
    const cb = args.pop()
    const params = args.splice(0, this.args.length)
    this.execute(params, cb)
  }

  promise (...args) {
    const params = args.splice(0, this.args.length)
    return new Promise((resolve, reject) => {
      this.execute(params, resolve, reject)
    })
  }

  execute (args, cb, reject) {
    let index = 0
    const done = (err, res) => {
      if (err) return reject && reject(err)
      if (res) args[0] = res
      next()
    }
    const next = () => {
      if (index === this.taps.length) return cb()
      const { type, fn } = this.taps[index++]
      if (type === 'promise') {
        fn(...args).then(res => done(null, res), err => done(err))
      } else {
        fn(...args, done)
      }
    }
    next()
  }
}

module.exports = AsyncSeriesWaterfallHook
```

```javascript

const AsyncSeriesWaterfallHook = require('./lib/AsyncSeriesWaterfallHook.js')

class Test {
  constructor () {
    this.hook = {
      async: new AsyncSeriesWaterfallHook(['name', 'course'])
    }
  }

  listener () {
    this.hook.async.tapAsync('tapable', function (...args) {
      setTimeout(() => {
        const cb = args.pop()
        console.log(`${args[0]} 正在学习${args[1]}`)
        cb && cb(null, 'ypl')
      }, 1000)
    })
    this.hook.async.tapAsync('webapck', function (...args) {
      setTimeout(() => {
        const cb = args.pop()
        console.log(`${args[0]} 正在学习${args[1]}`)
        cb && cb(null)
      }, 2000)
    })
  }

  listenerPromise () {
    // 异步事件，使用promise代替回调
    this.hook.async.tapPromise('tapable', function (...args) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log(`${args[0]} 正在学习${args[1]}`)
          resolve('tongshu')
        }, 1000)
      })
    })

    // 异步事件，使用promise代替回调
    this.hook.async.tapPromise('webapck', function (...args) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log(`${args[0]} 正在学习${args[1]}`)
          resolve()
        }, 1000)
      })
    })
  }

  call () {
    this.hook.async.callAsync('greenlotus', 'tapable', function () {
      console.log('大家都学习完tapable')
    })
  }

  callPromise () {
    this.hook.async.promise('tongling', 'tapable').then(() => {
      console.log('tong家族都学习完tapable')
    })
  }
}

const test = new Test()
test.listener()
test.listenerPromise()
test.call()
test.callPromise()

```




