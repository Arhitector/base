module.exports = new function () {
	var spritesmith		= require('gulp.spritesmith'),
		gulp			= require('gulp'),
		gulpif			= require('gulp-if'),
		sourcemaps		= require('gulp-sourcemaps'),		// js/css sourcemap
		notify			= require("gulp-notify"),			// notification plugin
		uglify			= require('gulp-uglify'),			//Minify files with UglifyJS.
		jshint			= require('gulp-jshint'),			//JSHint plugin for gulp
		concat			= require('gulp-concat'),			//Concatenates files
		plumber			= require('gulp-plumber');			// Prevent pipe breaking caused by errors

	return function (cfg) {
		return gulp.src([
			cfg.src.lib + '/**/*.js',
			cfg.src.js + '/*.js',
			cfg.src.markups + '/**/**/*.js'
		])
		.pipe(sourcemaps.init())
		.pipe(
			plumber({
				errorHandler: function (err) {
					console.log(err.message);
					this.emit('end');
				}
			})
		)
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(uglify())
		.pipe(concat(cfg.dest.jsFile))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(cfg.dest.js))
		.pipe(gulpif(
			cfg.SystemNotify,
			notify('JS task complete')
		));
	};
};