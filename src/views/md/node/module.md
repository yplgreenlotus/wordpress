# 模块化

模块化解决的问题：解决命名冲突（命名空间）、采用自执行函数的方式 使代码达到 高内聚 低耦合 的问题

cmd : seajs 已经不维护了

amd : requirejs

目前比较流行的：node模块规范 commonjs 、es6 模块规范 esm 、umd (所有模块规范的大整合)

#### 1、esm

import 特点：

1、可以变量提升，变量可以在 import 之前
2、import 不能放在作用域下，只能放在顶层环境
3、export 只能导出变量列表，不能导出具体的值
```javascript
  let a = 1
  let b = 2
  let c = 3
  // 如
  export { a,b、c}
  // 不能导出
  export { a:1,b:2、c:3}
```
4、如果导出的变量有变化，引入的值也会随着改变
5、可 export default {a:1,b:2}

