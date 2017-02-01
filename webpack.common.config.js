const path = require("path");

module.exports = {
	context: path.join(__dirname, "/src"),
	entry: {
		sketch: "./js/sketch.js"
	},
	output: {
		path: path.join(__dirname, "/dist"),
		filename: "./js/[name].bundle.js",
		sourceMapFilename: "[name].map"
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: "babel-loader",
				options: { 
					presets: [ 
					[ "es2015", { modules: false } ] 
					] 
				}
			}
		]
	}
};