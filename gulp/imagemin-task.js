module.exports = new function () {
	var gulp		= require('gulp'),
		imagemin	= require('gulp-imagemin'),
		size		= require('gulp-size'),
		pngquant	= require('imagemin-pngquant'),
		gulpif		= require('gulp-if'),
		changed		= require('gulp-changed'),			// Only pass through changed files
		cache		= require('gulp-cache'),			// caching proxy task
		flatten		= require('gulp-flatten'),			// remove or replace relative path for files
		notify		= require("gulp-notify"),			// notification plugin
		plumber		= require('gulp-plumber');			// Prevent pipe breaking caused by errors

	return function (cfg) {
		return gulp.src([
			cfg.src.img + '/*',//base image folder
			cfg.src.tempImg + '/*',//temp image folder
			cfg.src.markups + '/**/images/*'//images in markups
			])
		.pipe(changed(cfg.dest.img))
		.pipe(
			cache(
				imagemin({
					optimizationLevel: 3,
					progressive: true,
					interlaced: true,
					svgoPlugins: [{removeViewBox: false}],
					use: [pngquant()]
				})
			)
		)
		.pipe(flatten())
		.pipe(gulp.dest(cfg.dest.img))
		.pipe(size({showFiles: true}))
		.pipe(
			gulpif(
				cfg.SystemNotify,
				notify("File <%= file.relative %> minify!")
			)
		);
	};
};