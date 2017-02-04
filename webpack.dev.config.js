const path = require("path");
const webpackMerge = require("webpack-merge");
const commonConfig = require("./webpack.common.config.js");

module.exports = function(){
	return webpackMerge(commonConfig, {
		devServer : {
			contentBase: path.join(__dirname, "dist"),
			compress: true,
			port: 8000,
			host: "localhost",
			stats: "minimal",
			noInfo: false
		}
	});
};
