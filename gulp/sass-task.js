module.exports = new function () {
	var gulp					= require('gulp'),
		sass					= require('gulp-ruby-sass'),
		sass2					= require('gulp-sass'),
		compass					= require('gulp-compass'),
		notify					= require("gulp-notify"),			// notification plugin
		plumber					= require('gulp-plumber'),			// Prevent pipe breaking caused by errors
		print					= require('gulp-print');

	return function (cfg) {
		return sass(cfg.src.styles + "/all.scss")
		.pipe(print())
		//.pipe(sass())
		//.pipe(sass({ compass: true, sourcemap: true, style: 'compressed' }))
		/*.pipe(compass({
			//project: path.join(__dirname, '/'),
			css: cfg.dest.css,
			sass: cfg.src.styles
		}))*/
		.pipe(gulp.dest(cfg.dest.css));
	};
};