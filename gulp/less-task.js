module.exports = new function () {
	var gulp					= require('gulp'),
		less					= require('gulp-less'),
		lessImport				= require('gulp-less-import'),
		csso 					= require('gulp-csso'),
		autoprefixer			= require('gulp-autoprefixer'),

	return function (cfg) {
		return gulp.src([
			cfg.src.lib + '/lib.less',
			cfg.src.styles + '/**/*.less',
			cfg.src.markups + '/**/*.less'
		])
		.pipe(lessImport(cfg.src.allCss))
		.pipe(sourcemaps.init())
		.pipe(plumber({
			errorHandler: function (err) {
				console.log(err.message);
				this.emit('end');
			}
		}))
		.pipe(less({
			modifyVars: {
				'@img_path'		: cfg.destLess.img,
				'@temp_path'	: cfg.destLess.imgTemp,
				'@sprites_path'	: cfg.destLess.imgSprites,
				'@modules_path'	: cfg.destLess.imgModules
			}
		})).on('error', notify.onError(function (error) {
			return "Error on: " + error.filename + " in " + error.line + ' line';
		}))
		.pipe(autoprefixer({
			browsers: [cfg.src.browserSupport],
			cascade: true
		}))
		//.pipe(csso())
		.pipe(gulpif(
			cfg.base64Enable,
			base64({
				baseDir: cfg.dest.img,
				extensions: ['svg', 'png', 'jpg'],
				maxImageSize: cfg.src.base64Size,
				debug: true
			})
		))
		.pipe(sourcemaps.write('./'))
		.pipe(size({showFiles: true}))
		.pipe(gulp.dest(cfg.dest.css))
		.pipe(gulpif(
			cfg.SystemNotify,
			notify("File <%= file.relative %> compiled!")
		));
	};
};