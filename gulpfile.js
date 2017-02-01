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
	webpack(webpackConfig("build"), function(err, stats){
		gutil.log("[Webpack]", stats.toString({
			colors: true
		}));
		callback();
	});
});

gulp.task("webpackDev", function(callback){
	webpack(webpackConfig("dev"), function(err, stats){
		gutil.log("[Webpack]", stats.toString({
			colors: true
		}));
		callback();
	});
});

gulp.task("build", gulp.parallel("copyHTML", "webpackBuild"));

gulp.task("default", gulp.series("build"));
gulp.task("dev", gulp.parallel("copyHTML", "webpackDev"));