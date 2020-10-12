![WeChatc5eef9a2b872a5ed97e41659b85b3e4c](https://s1.ax1x.com/2020/10/10/0s3Uxg.png)

# 初识 wbepack

## 1-1. 安装 webpack

新建一个空文件夹,然后在终端输入

```shell
// 初始化项目
npm init -y
// 安装webpack
npm install webpack webpack-cli -D
```

- 在 webpack3 中 webpack 本身和 CLI 在同一个包中,但 wbepack4 将两者分开方便更好的管理,

  目前使用的基本都是 webpack4,所以需要安装 `webpack` 和`webpacli-cli`

- 为了防止不同的人使用的 webpack 版本不一致的问题,一般将 webpack 安装到项目中,不是使用 `-g` 全局安装

## 1-2. webpack 零配置使用

在 webpack4 中已经可以零配置来编译一个项目,下面将通过 webpack 构建一个采用 CommonJS 模块化编写的项目，

该项目将会在通过 JavaScript 在网页上显示`hello Webpack`.

运行构件前,先把要完成的最基础的 JavaScript 文件和 HTMl 建立好,需要如下的文件.

```
├── src
		 ├── index.html
     ├── index.js
     └── show.js

```

页面入口文件 `index.html`

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Document</title>
	</head>
	<body>
		<div id="app"></div>
	</body>
	<script src="../dist/main.js"></script>
</html>
```

Js 函数工具文件 `show.js`

```js
// 操作 DOM 元素，把 content 显示到网页上
function show(content) {
	window.document.getElementById('app').innerText = 'Hello,' + content;
}

// 通过 CommonJS 规范导出 show 函数
module.exports = show;
```

js 执行入口文件 `index.js`

```js
// 通过 CommonJS 规范导入 show 函数
const show = require('./show.js');
// 执行 show 函数
show('Webpack');
```

一切准备完毕后,我们可以在终端输入 `npx webpack` , 来运行 webpack 构建。或者在根目录的 `package.json` 中编辑 `scripts` ,后使用 `yarn build` 来构建

```json
"scripts": {
    "build": "webpack"
}
```

你会发现目录下多出一个 `dist` 目录,里面有一个 `main.js` 文件。这时我们可以在浏览器打开`index.html`，网页将会看到 `Hello,Webpack`。

此时的目录树

```cmd
├── src
	 ├── index.html
     ├── index.js
     └── show.js
├── dist    // webpack编译生成
     └── main.js

```

## 2. 配置

在实际使用的过程中,零配置的 webpack 的往往没办法达到预期的效果,这时候我们往往会根据我们的需求来做相应的配置。

Webpack 在执行构件时会默认从根目录下的`webpack.config.js`或者`webpackfile.js` 文件读取配置,所以我们需要在根目录下新建`webpack.config.js`

此时的目录树

```cmd
├── src
     ├── index.html
     ├── index.js
     └── show.js
├── dist    // webpack编译生成
     └── main.js
├── webpack.config.js
```

我们可以先简单的配置一下`webpack.config.js`

```js
// 引入path模块 处理路径
const path =require("path")
// 由于 webpack 构建运行在 node.js 环境下，所以该文件最后需要通过 commonJS 规范导出一个描述如何构建的 Object 对象。
module.export={
  // 模式 development 开发模式 production 生产模式
  mode:"development",
  // 入口
  entry:"./src/index.js", // 入口文件路径
  // 出口
  output:{
    filename:'build.js', // 输出文件的名称,
    path:path.resolve('dist'); // 输出文件存放的路径
  }
}
```

通过上面的配置,我们就可以达到和零配置一样的效果了。实际开发中,我们可能并不想在 src/index.html 直接引入编译后的 js 文件, 更需要的是在生成的`dist`目录下生成一个 html 并且引入 js 文件,同时我们还希望,能在开发的时候生成一个开发服务。这时候我们可以使用 `html-webpack-plugin` 插件和 `webpack-dev-server` 来实现.

### html 和 devServer

首先安装 `html-webpack-plugin`

```cmd
// 安装 html-webpack-plugin
npm i html-webpack-plugin -D

// 安装 webpack-dev-server
npn i webpack-dev-server -D
```

然后在 `webpack.config.js`中添加`html-webpack-plugin`配置项

```js
const path = require('path');
// 引入模块
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.export = {
	mode: 'development',
	entry: './src/index.js',
	output: {
		filename: 'build.js',
		path: path.resolve('dist'),
	},
	// 配置项
	plugins: [
		new HtmlWebpackPlugin({
			filename: 'index.html', // 生成的文件名称
			template: './src/index.html', // html模版路径
		}),
	],
};

// 这时候编译就会在dist目录下生成一个index.html并且自动引入./build.js
```

添加`webpack-dev-server`

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.export = {
	mode: 'development',
	entry: './src/index.js',
	output: {
		filename: 'build.js',
		path: path.resolve('dist'),
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: './src/index.html',
		}),
	],
	// 开发环境
	devServer: {
		port: 3000, // 端口号
		contentBase: './src',
		compress: true, // 启动gzip压缩
		progress: true, // 显示编译进度
		open: true, // 打开浏览器
	},
};
```

同时在`package.json`中添加对应的配置，这样就可以用 `npm run start` or `yarn start` 来启动服务

```json
  "scripts": {
        "build": "webpack",
        "start": "webpack-dev-server"
    },
```

### css

接下来我们尝试修改` div` 的样式。

首先新建一个在 `src` 目录下` index.css` 文件。

其内容为:

```css
#app {
	font-size: 16px;
	color: red;
}
```

这里我们尝试在 `index.js` 中引入 css 样式,其内容如下。

(因为我们常用 react 框架一般会在 `jsx` 文件中引入 css,所以这里也在 js 中引入)

```js
require('./index.css');
// or
import './index.css';
const show = require('./show.js');
show('Webpack');
```

然后我们使用 `style-loader` 和 `css-loader` 来对其进行编译.

安装

```
npm install style-loader css-loader -D
```

然后在`wbepack.config.js`中添加 loader 配置

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.export = {
	mode: 'development',
	entry: './src/index.js',
	output: {
		filename: 'build.js',
		path: path.resolve('dist'),
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: './src/index.html',
		}),
	],
	devServer: {
		port: 3000,
		contentBase: './src/index.js',
		compress: true,
		progress: true,
		open: true,
	},
	// 编译的模块
	module: {
		// 匹配请求的规则
		rules: [
			// test 匹配的文件 use 使用说明loader加载 加载顺序从右到左
			{ test: /\.css$/, use: ['style-loader', 'css-loader'] },
		],
	},
};
```

添加完这个后,我们在使用`yarn start`就会发现对应的文字变成了红色,并且样式是通过 `style` 放入在页面 `head` 中显示的.

如果我们想把 css 样式通过 `link` 标签引入的话需要使用`mini-css-extract-plugin`.

安装

```
npm install mini-css-extract-plugin -D
```

同时需要修改`webpack.config.js`中的配置

```js
const path =require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 引入模块
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
module.export={
  mode:"development",
  entry:"./src/index.js",
  output:{
    filename:'build.js',
    path:path.resolve('dist')
  },
  plugins:[
    new HtmlWebpackPlugin({
      filename:"index.html",
      template:"./src/index.html"
    }),
    // 添加配置项
    new MiniCssExtractPlugin({
    	 // 文件名称
       filename: "index.css";
    })
	],
	devServer:{
   port:3000,
	 contentBase:'./src/index.js',
   compress:true,
   progress:true,
   open:true,
	},
	module:{
		rules:[
		//  用HtmlWebpackPlugin.loader 替换 style-loader
		-   {test:/\.css$/,use:['style-loader','css-loader']}
		+   {test:/\.css$/,use:[MiniCssExtractPlugin.loader,'css-loader']}
		]
	}
}
```

这样在 `run build` 就会发现在 `dist` 目录下新生成了一个 index.css

有时间我们还需要考虑 css 的兼容性问题,希望在编译的时候能够自动帮我们补全前缀。这时候我们可以使用下面这些插件

```powershell
npm install autoprefixer postcss-loader postcss -D
```

在项目根目录创建 `postcss.config.js`，并且设置支持哪些浏览器，`必须设置支持的浏览器才会自动添加添加浏览器兼容`

```js
module.exports = {
	plugins: [require('autoprefixer')],
};
```

我们还需要在`package.json`添加`browserslist`属性

```json
  "browserslist": [
        "defaults",
        "not ie < 11",
        "last 2 versions",
        "> 1%",
        "iOS 7",
        "last 3 iOS versions"
    ]
```

然后修改`webpack.config.js`的配置

```js
module: {
	rules: [
		// 添加 postcss-loader
		-{ test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] } +
			{
				test: /\.css$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
			},
	];
}
```

在平常项目中我们也会使用`less`或者`scss`,webpack 也是同样可以编译的 , 下面以`scss`举例

安装编译 scss 需要的 loader

```cmd
// 因为历史原因,这是我们安装的包名都叫sass
// sass 3.0以下的版本叫 sass 3.0以上叫scss

npm install node-sass sass-loader -D
```

新建`index.scss`

```scss
#app {
	font-size: 32px;
	color: pink;
}
```

`index.js`中引入`index.scss`文件

```js
import './index.scss'
...
```

然后在`rules`中添加配置项

```js
module: {
	rules: [
		{
			test: /\.css$/,
			use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
		},
		{
			test: /\.scss$/,
			use: [
				MiniCssExtractPlugin.loader,
				'css-loader',
				'sass-loader',
				'postcss-loader',
			],
		},
	];
}
```

### js

##

## 3. 解析 webpack 是如何编译的

# 需提前熟悉 API
