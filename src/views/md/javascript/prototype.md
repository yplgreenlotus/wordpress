---
description: 原型继承
---

# Prototype

### 1、构造函数、实例对象、原型


#### a、什么是构造函数

构造函数是Function的实例化对象，它是一种实例化对象的方式，用从初始化实例对象。与普通函数相比，函数名的第一个字母要求是大写，必须搭配new运算符一起使用。

**b、函数的创建方式**

通常是用声明式的写法:

```javascript
function Person() {
  // ...
}

var person = new Person()

```

函数的另外一种创建方式：

```javascript
new Function ([arg1[, arg2[, ...argN]],] functionBody)

var sum = new Function('a', 'b', 'return a + b');

console.log(sum(2, 6));
// expected output: 8

```

这里之所以要介绍 Function 这种方式，是为了让大家知道：**所有的函数都是 Function 的实例**

**c、构造函数函有 prototype 属性 ，指向实例化对象的原型**

```javascript
function Person() {
  // ...
}
var person = new Person()

// 构造函数的 prototype 属性 指向 原型对象
var result = Person.prototype === person.__proto__

console.log('result : ', result)

// result : true
```

### 2、实例化对象

通过 构造函数 搭配 new 运算符 实例化出来的对象

实例化对象的特点：

```javascript
function Person() {}

var person = new Person()

// 实例对象拥有 __proto__ 属性，指向原型对象，就是构造函数的prototype指向的原型对象
person.__proto__ === Person.prototype
//  实例对象的 constructor 就是 构造函数
person.constructor === Person
```

### 3、原型对象

```javascript
function Person() {}
// 实例化对象
var person = new Person()
// 实例化对象指向原型
var proto1 = person.__proto__
// 构造函数指向原型
var proto2 = Person.prototype
// 同一个原型对象
var result = proto1 === proto2 


```

### **4、构造函数、实例对象、原型对象 关系总结**


#### 示例：

```javascript
function Parent() {}

function Child() {}

// 根据上面的关系图设置 原型 与 构造函数的关系
Child.prototype = new Parent()
Child.prototype.constructor = Child

// 实例化对象
var child = new Child()

console.log('child: ', child)

console.log('result: ', Child.prototype === child.__proto__)


```

通过 以上示例 可得原型链：

```javascript
var parent = new Parent()
var object = new Object()

// 原型链1
child.__proto__ => parent 
child.__proto__.__proto__ => object 
child.__proto__.__proto__.__proto__ => Object.prototype 
child.__proto__.__proto__.__proto__.__proto__ => null

// 原型链2
Child.__proto__ => Function.prototype 
Child.__proto__.__proto__ => object 
Child.__proto__.__proto__.__proto__ => Object.prototype 
Child.__proto__.__proto__.__proto__.__proto__ => null

```

