var path = require("path");
var webpack = require("webpack");

module.exports = {
	context: path.resolve(__dirname, "./src"),
	entry: ["p5/lib/p5.min.js", "./js/sketch.js"],
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "./js/sketch.bundle.js"
	},
	devServer: {
		contentBase: path.join(__dirname, "dist"),
		compress: true,
		port: 8000
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			comments: false,
			mangle: false
		})
	]
}