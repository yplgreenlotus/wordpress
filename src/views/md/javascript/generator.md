# generator

#### 1、迭代器（迭代器）

首先我们来看一段代码

```javascript

function makeIterator(arr) {
  let nextIndex = 0
  return {
    next: () => {
      if (nextIndex < arr.length) {
        return { value: arr[nextIndex++], done: false }
      } else {
        // 用 done 标识当前这个迭代器是否完成
        return { value: undefined, done: true }
      }
    }
  }
}

const arr = ['起床', '吃早餐', '上班', '下班', '回家']

const iterator = makeIterator(arr)
console.log('**************生活节奏****************')
console.log('7点整：', iterator.next().value)
console.log('8点整：', iterator.next().value)
console.log('9点整：', iterator.next().value)
console.log('18点整：', iterator.next().value)
console.log('19点整：', iterator.next().value)
console.log('20点整：', iterator.next().value)

**************生活节奏****************
7点整： 起床
20 8点整： 吃早餐
21 9点整： 上班
22 18点整： 下班
23 19点整： 回家
24 20点整： undefined
```

#### 2、生成器（generator）

生成器 名故思意 就是一个生产东西的容器， 生成器函数就是可以返回迭代器的函数，本质还是在操作迭代器，只不过表面通过生成器来完成这件事情，接下来我们来看下示例代码：

```javascript

function* makeIterator(arr) {
  for (let i = 0; i < arr.length; i++) {
    yield arr[i]
  }
}
const arr = ['起床', '吃早餐', '上班', '下班', '回家']
const gen = makeIterator(arr)

console.log('**************生活节奏****************')
console.log('7点整：', gen.next().value)
console.log('8点半：', gen.next().value)
console.log('9点整：', gen.next().value)
console.log('18点整：', gen.next().value)
console.log('19点整：', gen.next().value)
console.log('20点整：', gen.next().value)

**************生活节奏****************
19 7点整： 起床
20 8点整： 吃早餐
21 9点整： 上班
22 18点整： 下班
23 19点整： 回家
24 20点整： undefined

```

#### 3、对比结论

对比 上面 的 迭代器 、生成器你会发现他们产生的结果是一毛一样的，所以生成器的本质就是返回迭代器，生成器 出现 就为了简化 迭代器，这就是以上最想要表达主要信息。

#### 4、迭代器的使用

示例1：

```javascript

function* generator_1() {
  let a = yield 1
  console.log('a', a)
  let b = yield 2
  console.log('b', b)
  let c = yield 3
  console.log('c', c)
  return 0
}

let it = generator_1()

console.log("*************执行结果****************")
console.log('execute one: ', it.next())
console.log('execute two: ', it.next())
console.log('execute three: ', it.next())
console.log('execute four: ', it.next())

*************执行结果****************

execute one:  {value: 1, done: false}
a undefined

execute two:  {value: 2, done: false}
b undefined

execute three:  {value: 3, done: false}
c undefined

execute four:  {value: 0, done: true}

```

看到上面的结果，此时你肯定会大吃一惊 ， a 、b、c  的值为啥是 undefined  ？ tell me why ?  

#### generator 函数赋值行为：

其实根据上面代码看来有一定的误导性 ， 这里我举例说明：

如： let xx = yield yy  ，以 yield 为中心：

yield 左边表达式为：let xx = 

yield 右边表达式为：yy

其实 yield 左边表达式 值 并 不是通过 yield 右边表达式来赋值，而是 it.next\(\) 方法传递的参数来赋值的，

很显然上面的next\( \)方法都没有传参，所以  a 、b、c  的值为 undefind 并不奇怪。

#### generator 函数执行流程：

首先：let it = generator\_1\(\) 拿到迭代器

it.next\(\) 第一次调用：只执行了  yield 1

it.next\(\)  第二次调用：先执行  let a = 表达式赋值操作，在执行  console ,  接着执行 yield 2  ，让后停止；

it.next\(\)  第三次调用：先执行  let b = 表达式赋值操作，在执行  console ,  接着执行 yield 3  ，让后停止；

it.next\(\)  第四次调用：先执行  let  = 表达式赋值操作，在执行  console ,  然后结束 return 

#### 示例2：异步generator函数

根据 示例 1  的流程 来梳理次粒子，就很好理解了

```javascript

const co = require('co')
const fetch = require('node-fetch')

function ajax() {
  fetch('https://coding.imooc.com/class/ajaxbigdatacourserecommend').then(res => {
    // 第二次执行next()，并且把返回的值通过next传递进去
    // 此次执行next,传递进去的 res 会赋值给 result , 然后执行 result.json 之后暂停
    return it.next(res).value
  }).then(params => {
    // 第三次执行next()，并且把为第二次执行 next 返回值 params 传进去
    // 此次执行next,传递进去的 params 会赋值给 json, 然后执行console.log(json.data[0])
    it.next(params)
  })
}

function* generator_2() {
  const result = yield ajax()
  const json = yield result.json()
  console.log(json.data[0])
}
// 拿到迭代器
const it = generator_2()
// 第一次执行next()
it.next()
```

#### 5、CO 库

通过上面的 generator 例子，大家有没有发现一个问题，那就是要怎么样才知道一个 generator 函数行

要执行多少次 next 方法呢 ？

大名鼎鼎 的 co 库 就是为了解决这个问题而生的，它出自于tj（node社区神一样的人物）大神之手，接下

来我们来看下  co 库 如何使用 ：

```javascript
npm install co -S
```

```javascript
const co = require('co')
const fetch = require('node-fetch')
const url = 'https://coding.imooc.com/class/ajaxbigdatacourserecommend'

/**
* co 本身就一个函数，接收一个 generator 函数为参数 ，
* 试图将 function、 promise、generator、array 、object 转换成 promise 返回
*/

co(function* () {
  const result = yield fetch(url)
  const res = yield result.json()
  console.log(res.data[0])
})

```

CO 的原理

```javascript
function* gen() {
  const url = 'https://coding.imooc.com/class/ajaxbigdatacourserecommend'
  const result = yield fetch(url)
  const res = yield result.json()
  console.log(res.data[0])
}
// 简单粗暴的解释 co 原理
function execute(generator) {
  const iterator = generator()
  const promise = iterator.next().value
  promise.then(res => {
    const promise2 = iterator.next(res).value
    promise2.then(data => {
      iterator.next(data)
    })
  })
}
// 执行
execute(gen)

```

```javascript
function* gen() {
  const url = 'https://coding.imooc.com/class/ajaxbigdatacourserecommend'
  const result = yield fetch(url)
  const res = yield result.json()
  console.log(res.data[0])
}

// 递归 next 
function next(it, promise, done) {
  if (promise instanceof Promise) {
    if (done) {
      promise.then(res => {
        const result = it.next(res)
        const done = result && !result.done
        if (done) {
          // 递归
          next(it, result.value, done)
        }
      })
    }
  } else {
    const result = it.next()
    const done = result && !result.done
    if (done) {
      // 递归
      next(it, result.value, done)
    }
  }
}

function run(generator) {
  const iterator = generator()
  // 递归
  next(iterator)
}
// 执行
run(gen)
```

```javascript

function* gen() {
  const url = 'https://coding.imooc.com/class/ajaxbigdatacourserecommend'
  const result = yield fetch(url)
  const res = yield result.json()
  console.log(res.data[0])
}

function co (it) {
  return new Promise((resolve,reject) => {
    function next (data) {
      const { value , done } = it.next(data)
      if(done){
        resolve(value)
      }else{
        Promise.resolve(value).then( res => {
          next(res)
        },reject)
      }
    }
    // 第一个参数有没有，没有任何意义
    next()
  })
}

co(gen())

```

总结：generator 是 es6 推出的特性，其实从 co 库里面执行的代码就已经能够找的 async / await 的影子

在 es7 推出之后，async / await 基本就已经取代了 generator 函数，但并不代表他就已经可以退出

历史舞台，react-saga 就基于generator 函数实现，并且他还表明 async / await 并不能彻彻底底的

取代 generator 函数。