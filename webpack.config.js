const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
	entry: './src/index.js',
	// 不设置output,会默认输出main.js文件到dist文件夹
	output: {
		filename: 'build.js',
		path: path.resolve('dist'),
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: './src/index.html',
		}),
		// 如果想把css样式通过 `link` 标签引入的话需要使用`mini-css-extract-plugin`,添加配置项
		new MiniCssExtractPlugin({
			filename: 'index.css',
		}),
	],
	// "development"为开发模式，不会压缩buidld.js; "production"为生产模式，会压缩build.js
	mode: 'development',
	// 开发环境
	devServer: {
		port: 3000, // 端口号
		contentBase: './src/index.js',
		compress: true, // 启动gzip压缩
		progress: true, // 显示编译进度
		open: true, // 打开浏览器
	},
	// 编译的模块
	module: {
		// 匹配请求的规则
		rules: [
			// ①使用 `style-loader`  和 `css-loader` 来对其进行编译.
			// test 匹配的文件 use 使用说明loader加载 加载顺序从右到左
			// { test: /\.css$/, use: ['style-loader', 'css-loader'] },

			// ②如果想把css样式通过 `link` 标签引入的话需要使用`mini-css-extract-plugin`
			// { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] },

			// ③考虑css的兼容性问题,希望在编译的时候能够自动帮我们补全前缀----npm install autoprefixer postcss-loader postcss -D
			// {
			// 	test: /\.css$/,
			// 	use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
			// },

			// 编译scss
			{
				test: /\.scss$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					'sass-loader',
					'postcss-loader',
				],
			},
		],
	},
};
