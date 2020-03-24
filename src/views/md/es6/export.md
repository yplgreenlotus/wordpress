
# 导入导出

#### 1、import

import的特点：

1、通过相对路径引入表示自定义模块

```javascript
  import main from './src/main'
```

2、import 有变量声明提升的作用，在没有定义以前可用直接使用

```javascript
  console.log(a)
  import {a} from './src/main'
```

3、import 不能放到作用域下，只能放到顶层环境


#### 2、export

1、export 导出的是变量或接口，不能导出具体的值，导出的结果不能修改

test.js

```javascript
// 导出方式一：
export let a = 1
export let b = 2
// 导出方式二：
export {a,b}
// 错误的导出方式：不能导出具体的值
export {a:1,b:2}

// 导入方式一：
import { a , b } from './test'
// 导入方式二：
import * as test from './test'

```

2、export default 导出的是具体的值，导出的结果不能修改

```javascript
export let a = 1
export let b = 2
// default 就是像一个命名空间
export default { c : 3 , d : 4 }

// 可以直接这样用
import test from './test'
// test -> { c : 3 , d : 4 }

// 但是如果这样用
import * as obj from './test'
// test -> { default:{ c : 3 , d : 4 } ,a : 1, b : 2 }

// 可这样用
import test,{ a, b } from './test'

// default是关键字
import { a, b , default as test} from './test'

// export 还可以给 变量 换成 default
const obj = { a : 1 }

export {
  obj as default
}

```

3、import 导入的变量随 export 导出的变量更新而更新，导入导出变量名称必须一样

```javascript

let a = 1
let b = 2

setTimeout(()=>{
  a++
},1000)

export { a , b }

import { a , b } from './test'

setTimeout(()=>{
  // a 的值会更新
  console.log(a)
},1000)

```

3、import导入的内容不会随着 export default 导出的内容变化而变化

```javascript
let a = 1
setTimeout(()=>{
  a++
},1000)
export default a

import a from './test'
setTimeout(()=>{
  // 注意 a 的值不会更新
  console.log(a)
},1000)

```

4、export default 不能在一个文件内使用多次




#### 3、导入导出

```javascript
// 导出 ./app 所有的变量
export * from './app' 
// 导出 ./main 中的 y
export { y } from './main'
// 这里会报错，因为y没有定义 , 只有用import才有变量声明的做作用
console.log(y)
```

