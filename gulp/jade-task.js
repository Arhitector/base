module.exports = new function () {
	var gulp				= require('gulp'),
		jade				= require('gulp-jade'),
		jadeInheritance		= require('gulp-jade-inheritance'),	// Rebuild a jade file with other files that have extended or included those file
		sourcemaps			= require('gulp-sourcemaps'),		// js/css sourcemap
		gulpif				= require('gulp-if'),
		notify				= require("gulp-notify"),			// notification plugin
		plumber				= require('gulp-plumber');			// Prevent pipe breaking caused by errors

	return function (cfg) {
		return gulp.src(cfg.src.markups + '/*.jade')
		.pipe(jadeInheritance({basedir: cfg.src.markups}))
		.pipe(plumber({
				errorHandler: function (err) {
					console.log(err.message);
					this.emit('end');
				}
		}))
		.pipe(jade({
			pretty: true,
			data: {
				getData: function (dataPath) {
					return require('../' + cfg.src.markups + '/' + dataPath);
				},
				page_title		: cfg.destJade.title,
				css_path		: cfg.destJade.css,
				js_path			: cfg.destJade.js,
				img_path		: cfg.destJade.img,
				temp_path		: cfg.destJade.imgTemp,
				sprites_path	: cfg.destJade.imgSprites
			}
		})).on('error', notify.onError(function (error) {
			return "Error: " + error.message ;
		}))
		.pipe(gulp.dest(cfg.dest.html))
		.pipe(gulpif(
			cfg.SystemNotify,
			notify('JADE task complete')
		));
	};
};