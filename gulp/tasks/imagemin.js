module.exports = new function () {
	var gulp		= require('gulp'),
		gulpIf 		= require('gulp-if'),
		notify 		= require('gulp-notify'),
		imagemin	= require('gulp-imagemin'),
		size		= require('gulp-size'),
		pngquant	= require('imagemin-pngquant'),
		changed		= require('gulp-changed');

	return function () {
		return gulp.src([
			cfg.src.img + '/*.' + IMAGE_FORMATS,
			cfg.src.tempImg + '/*.' + IMAGE_FORMATS,
			cfg.src.blocks + '/**/images/*.' + IMAGE_FORMATS,
			cfg.src.modules + '/**/images/*.' + IMAGE_FORMATS,
			!cfg.src.dataUri + '*.' + IMAGE_FORMATS
		])
			.pipe(changed(cfg.dest.img))
			.pipe(gulpIf(cfg.imagesMin, imagemin({
				optimizationLevel: 1,
				progressive: true,
				interlaced: true,
				svgoPlugins: [{removeViewBox: false}],
				use: [pngquant()]
			})))
			.pipe(gulp.dest(cfg.dest.img))
			.pipe(size({showFiles: true}))
			.pipe(
			gulpIf(
				cfg.systemNotify,
				notify("File <%= file.relative %> minify!")
			)
		);
	};
};