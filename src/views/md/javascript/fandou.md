---
description: 防抖与节流
---

# 防抖与节流

## 1、防抖

防抖：表示某一个动作一直触发，当上下两个动作触发时间达到设定的某个阈值时在执行真正的业务逻辑操作，降低执行频率，从而达到防止抖动效果。

### 举例说明

在 window 绑定一个 scroll 滚动事件，鼠标滚动 scroll 事件一直执行，那如果想要现实鼠标停止滚动等待 200ms 之后在执行业务逻辑代码，那么使用防抖就能到达这样的效果。

### 实现示例

```text
  function debounce(fn, wait, immediate) {
    let timer
    return function (...args) {
      if (timer) {
        clearTimeout(timer)
      }
      if (immediate) {
        // 立即执行
        let callNow = !timer
        timer = setTimeout(() => {
          timer = null
        }, wait)
        if (callNow) {
          fn.apply(this, args)
        }
      } else {
        // 延迟执行
        timer = setTimeout(() => {
          fn.apply(this, args)
        }, wait)
      }
    }
  }


  window.addEventListener('scroll', debounce(function (...args) {
    console.log('处理正则的业务逻辑', ...args)
  }, 200))
```

## 2、节流

节流：表示某一个动作一直触发，动作里面业务逻辑执行频率非常高，这时可以设置一个固定阈值来降低业务逻辑的执行频率，从而达到节流效果

### 示例说明

在 window 绑定一个 scroll 滚动事件，鼠标滚动 scroll 事件一直执行，那如果想要现实事件里面的业务逻辑每隔 200ms 执行一次，那么使用节流就能到达这样的效果。

### 示例实现

```text
  function throttle(fn, wait) {
    let time = Date.now()
    return function () {
      let current = Date.now()
      if (current - time >= wait) {
        time = current
        fn.apply(this, arguments)
      }
    }
  }

  window.addEventListener('scroll', throttle((...args) => {
    console.log('处理正则的业务逻辑', ...args)
  }, 200))
```

## 3、总结

那么如何区分防抖与节流呢，为了区分它们，可以如下理解，当然可能不太准确，仅仅是为了方便理解：

防抖：某个动作执行停止后，延迟 XXX 毫秒执行

节流：每 XXX 毫秒执行一次动作

