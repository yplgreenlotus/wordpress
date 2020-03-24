

# call、apply、bind 原理


举个粒子：

```javascript
var context = {}

context.fn = Math.max

context.fn(2,4,6)

delete context.fn
```

粒子说明：

上面的粒子其实就是call、apply的内部实现的原理，context 实例上并没有 Math.max 方法，但是可以把

Math.max 赋值给 context 实例的一个方法名属性，然后在调用这个方法拿到执行结果，最后删除这个属

性。ending................

#### 1、call 函数实现

```javascript
Function.prototype.copycall = function (context) {
  if (typeof this !== 'function') {
    throw new TypeError('error')
  }
  context = context || window
  // 由 Math.max.copycall(context, 123) 可知
  // this 指针指向的就是 Math.max
  // 所以将this临时挂到context实例上
  context.fn = this
  const args = [...arguments].slice(1)
  const result = context.fn(...args)
  delete context.fn
  return result
}

Math.max.copycall(null, 2,4,6)

```

#### 2、apply 函数实现

```javascript
Function.prototype.copyapply = function (context) {
  if (typeof this !== 'function') {
    throw new TypeError('error')
  }
  context = context || window
  // 由 Math.max.copyapply(context, 123) 可知
  // this 指针指向的就是 Math.max
  // 所以将this临时挂到context实例上
  context.fn = this
  let result, args = arguments[1]
  if (args) {
    result = context.fn(...args)
  } else {
    result = context.fn()
  }
  delete context.fn
  return result
}

Math.max.copyapply(null, [2, 4, 6])

```

## 2、bind 原理

```javascript
Function.prototype.copybind = function (context) {
  if (typeof this !== 'function') {
    throw new TypeError('error')
  }
  context = context || window
  const self = this
  const args = [...arguments].slice(1)
  return function F() {
    if (this instanceof F) {
      // new Function
      return new self(...arguments, ...args)
    } else {
      // call Function
      return self.apply(context, args.concat([...arguments]))
    }
  }
}

const fn = Math.max.copybind(null, 2, 4, 6)

const f2 = fn(8, 10)

```

