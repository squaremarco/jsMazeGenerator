var path = require("path");

module.exports = {
	context: path.resolve(__dirname, "./src"),
	entry: ["p5", "./js/sketch.js"],
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "./js/sketch.bundle.js"
	},
	devServer: {
		contentBase: path.join(__dirname, "dist"),
		compress: true,
		port: 8000
	}
}