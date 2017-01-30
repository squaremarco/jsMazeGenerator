"use strict";

const gulp = require("gulp");
const gutil = require("gulp-util");
const webpack = require("webpack");
const webpackConfig = require("./webpack.config.js");

gulp.task("copyHTML", function(){
	return gulp.src("./src/index.html")
	.pipe(gulp.dest("./dist/"));
});

gulp.task("webpackBuild", function(callback){
	webpack(webpackConfig, function(err, stats){
		gutil.log("[Webpack]", stats.toString({
			colors: true
		}));
		callback();
	});
});

gulp.task("default", gulp.parallel("copyHTML", "webpackBuild"));