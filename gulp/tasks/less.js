module.exports = new function () {
	var gulp 			= require('gulp'),
		plumber			= require('gulp-plumber'),
		gulpIf 			= require('gulp-if'),
		notify 			= require('gulp-notify'),
		less			= require('gulp-less'),
		lessImport		= require('gulp-less-import'),
		csso 			= require('gulp-csso'),
		autoprefixer	= require('gulp-autoprefixer'),
		base64			= require('gulp-base64'),
		size			= require('gulp-size'),
		sourcemaps		= require('gulp-sourcemaps'),		// js/css sourcemap
		bless			= require('gulp-bless');

	return function () {
		return gulp.src([
			cfg.src.vendor + '/vendor.less',
			cfg.src.styles + '/less/helpers/*.less',
			cfg.src.styles + '/**/*.less',
			cfg.src.markups + '/**/*.less'
		])
		.pipe(lessImport(cfg.minifiedCssFilename))
		.pipe(sourcemaps.init())
		.pipe(plumber({
			errorHandler: function (err) {
				console.log(err.message);
				this.emit('end');
			}
		}))
		.pipe(less({
			modifyVars: {
				'@font-path'	: '"' + cfg.lessOverrides.fonts + '"',
				'@img-path'		: '"' + cfg.lessOverrides.img + '"',
				'@temp-path'	: '"' + cfg.lessOverrides.imgTemp + '"',
				'@sprites-path'	: '"' + cfg.lessOverrides.imgSprites + '"',
				'@modules-path'	: '"' + cfg.lessOverrides.imgModules + '"'
			}
		})).on('error', notify.onError(function (error) {
			return "Error on: " + error	.filename + " in " + error.line + ' line';
		}))
		.pipe(autoprefixer({
			browsers: [cfg.autoprefixerBrowserSupport],
			cascade: true
		}))
		.pipe(csso())
		.pipe(gulpIf(
			cfg.base64Enable,
			base64({
				baseDir: cfg.dest.img,
				extensions: ['svg', 'png', 'jpg'],
				maxImageSize: cfg.base64Size,
				debug: true
			})
		))
		.pipe(sourcemaps.write('./'))
		.pipe(size({showFiles: true}))
		.pipe(bless())
		.pipe(gulp.dest(cfg.dest.css))
		.pipe(gulpIf(
			cfg.systemNotify,
			notify("File <%= file.relative %> compiled!")
		));
	};
};