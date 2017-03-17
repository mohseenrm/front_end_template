const path = require('path');

// var HtmlWebpackPlugin = require('html-webpack-plugin')
// var HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
// 	template: path.join(__dirname, 'src', 'html', 'index.html'),
// 	filename: 'index.html',
// 	inject: 'body'
// });

module.exports = {
	entry: {
		common: path.join(__dirname, 'src', 'js', 'entry.js')	
	},
	output: {
		path: path.join(__dirname, 'dist', 'js'),
		filename: "[name].bundle.js"
	},
	module: {
		loaders: [
			{ test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
			{ test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ }
		]
	}
	// plugins: [HTMLWebpackPluginConfig]
}