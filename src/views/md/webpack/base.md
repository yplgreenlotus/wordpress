# Webpack 打包后执行原理

通过上面的代码可以看出，打包后的代码主要有如下几个部分：

1、打包后产出了一个包含所有依赖模块的对象，然后传给了自执行函数

```javascript
    {
    "./src/index.js":(
      function(module, exports, __webpack_require__) { 
        eval("const test = __webpack_require__(/*! ./test.js */ \"./src/test.js\")\r\nconsole.log(\"你好\")\r\n\n\n//# sourceURL=webpack:///./src/index.js?");
    }),
    "./src/test.js": (
      function(module, exports) { 
        eval("console.log('test')\n\n//# sourceURL=webpack:///./src/test.js?");
    })
  }
```

2、webpack 自定义了一个 require 函数，用来执行模块函数

```javascript
  // The require function
  function __webpack_require__(moduleId) {
    // Check if module is in cache
    if(installedModules[moduleId]) { return installedModules[moduleId].exports; }
    // Create a new module (and put it into the cache)
    var module = installedModules[moduleId] = { i: moduleId, l: false, exports: {} };
    // Execute the module function
    // 这里执行了模块对象的函数，并且把 __webpack_require__ 传了过去，用于加载模块自身的依赖模块
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    // Flag the module as loaded
    module.l = true;
    // Return the exports of the module
    return module.exports;
  }
```

3、webpack 手动调用 __webpack_require__ 函数，并且把入口文件路径当作默认key传入

```javascript
  __webpack_require__(__webpack_require__.s = "./src/index.js");
```

4、默认文件有依赖文件，然后再次调用 __webpack_require__ 函数，这样实现递归调用，直到所有模块加载完成

```javascript
  function(module, exports, __webpack_require__) { 
    eval("const test = __webpack_require__(/*! ./test.js */ \"./src/test.js\")\r\nconsole.log(\"你好\")\r\n\n\n//# sourceURL=webpack:///./src/index.js?");
  }),
```