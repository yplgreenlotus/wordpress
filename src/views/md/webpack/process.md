# Webpack 构建流程

#### 1、Webpack 的入口

Windows系统中，在项目工程中安装 webpack 、webpack-cli 之后在 node_modules/.bin 目录下你会发现多了 webpack、webpack.cmd、webpack-cli、webpack-cli.cmd 等4个文件，其中以 “.cmd” 是 window 系统对应的可以执行 “bat” 脚本 ， 没有后缀名的是是对应unix系的shell脚本。

webpack.cmd 与 webpack 可执行脚本

```javascript

// webpack.cmd 文件

@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\..\webpack\bin\webpack.js" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\..\webpack\bin\webpack.js" %*
)

// webpack 文件

#!/bin/sh
basedir=$(dirname "$(echo "$0" | sed -e 's,\\,/,g')")

case `uname` in
    *CYGWIN*) basedir=`cygpath -w "$basedir"`;;
esac

if [ -x "$basedir/node" ]; then
  "$basedir/node"  "$basedir/../webpack/bin/webpack.js" "$@"
  ret=$?
else 
  node  "$basedir/../webpack/bin/webpack.js" "$@"
  ret=$?
fi
exit $ret

```

webpack-cli.cmd 与 webpack-cli 可执行脚本

```javascript

// webpack-cli.cmd

@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\..\webpack-cli\bin\cli.js" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\..\webpack-cli\bin\cli.js" %*
)

// webpack-cli

#!/bin/sh
basedir=$(dirname "$(echo "$0" | sed -e 's,\\,/,g')")

case `uname` in
    *CYGWIN*) basedir=`cygpath -w "$basedir"`;;
esac

if [ -x "$basedir/node" ]; then
  "$basedir/node"  "$basedir/../webpack-cli/bin/cli.js" "$@"
  ret=$?
else 
  node  "$basedir/../webpack-cli/bin/cli.js" "$@"
  ret=$?
fi
exit $ret

```

在项目工程的 package.json 文件中的 script 字段中配置 webpack 或 webpack-cli 的可执行语句实际就是去找了上面对应的 “.cmd” 结尾的可以执行文件。从以 “.cmd” 结尾的可以执行文件中可以发现:

1、Webpack 实际是利用 node 去执行了 webpack 工程下的 “bin\webpack.js” ，这便是执行 webapck 的入口文件

2、Webpack-cli 实际是利用 node 去执行了 webpack-cli 工程下的 “bin\cli.js” ，这便是执行 webapck-cli 的入口文件

在 Webpack 、 Webpack-cli 工程上的 package.json 文件的 bin 字段上你会发现，webpack 指向是 “./bin/webpack.js” , webpack-cli 指向是 “./bin/cli.js”

#### 2、Webpack 工程下的 bin\webpack.js

查看 Webpack 工程下的 bin\webpack.js 文件，你会发下它其实就是检查你的工程下有没有安装 webpack-cli 或 webpack-command ，当然它默认首选 webpack-cli（ webpack-command 简单版的 webpack-cli ）， 如果都没有安装它会提示你安装，否则就会用 require 加载 webpack-cli 或 webpack-command 的入口文件， webpack-cli 的入口文件就是 "bin\cli.js" , 说到底还是 webpack 还是依赖 webpack-cli 去启动 webpack


#### 3、Webpack-cli 工程下的 bin\cli.js

Webpack-cli 是 Webpack 的命令行工具包 ，打开 Webpack-cli 工程下的 bin 目录的 cli.js 文件 ，大概做了如下的事情：

1、它首先是去检查是否是需要启动Webpack的执行命令，例如：["init", "migrate", "serve", "generate-loader", "generate-plugin", "info"] ，如果是就往下走，否则就执行上面的命令，当然它过滤 “serve” 了，因为这个是 “webpack-dev-server” 执行的

2、接着就是利用 “yargs” 包 构建了强大的 help 提示命令，然后就是把 命令行参数、webapck.config.js的配置进行整合，让后根据参数初始化了很多 插件等（webpack 4.X 的开箱即用的体现）

3、最后 compiler = webpack(options) , 让后看有没有 progress 参数，有的话开启 progress 插件，最后看是有 watch 参数，有的话调用 compiler.watch 方法 否则调用 compiler.run 方法，启动 webpack 

#### 4、Webpack 下的 lib/webpack.js

根据 Webpack 的 package.json 文件的 main 字段可以得出 webpack 打包的真正入口文件为 lib/webpack.js ，他们里面大概做了如下几件事：

1、校验了一下出入的options

2、然后根据与默认的options进行了合并

3、实例化了 compiler 对象

4、初始化了环境、插件（包括默认的）

#### 4、Webpack 构建过程

调用 compiler.run 方法就启动了 webpack 构建流程 ，run 方法里面会调动 compile 方法启动代码编译，compiler 主要管着 启动与收尾的工作，比如 beforeRun、run 、thisCompliation、compliation 、make 、emit、done 等很多Hook，但是具体构建的细节都是在 compliation 里面完成











