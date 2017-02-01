const webpack = require("webpack");
const webpackMerge = require("webpack-merge");
const commonConfig = require("./webpack.common.config.js");

module.exports = function(){
	return webpackMerge(commonConfig, {
		plugins: [
			new webpack.optimize.UglifyJsPlugin({
				beautify: false,
				comments: false,
				mangle: {
					screw_ie8: true,
					keep_names: true
				},
				compress: {
					screw_ie8: true
				}
			})
		]	
	});
};
	