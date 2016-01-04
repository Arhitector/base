module.exports = new function () {
	var autowatch	= require('gulp-autowatch');
		reload		= require('browser-sync').reload;

	return function () {
		var cssBuilder				= cfg.cssBuilder,
			htmlCompiler			= cfg.htmlCompiler;
		// Watch styles files
		gulp.watch(cfg.src.root + '/**/*.' + cssBuilder, [cssBuilder, reload]);
		// Watch html compiler files
		// to enable fast render in handlebars we should initialize templates separately
		if (htmlCompiler === 'handlebars') {
			gulp.watch(cfg.src.markups + '/**/*.hbs', ['handlebars', reload]);
		}
		else {
			gulp.watch(cfg.src.root + '/**/*.' + htmlCompiler, [htmlCompiler, reload]);
		}
		// js
		gulp.watch('/(bower|package).json', ['js', reload]);
		gulp.watch([cfg.src.js + '/**/*.js', cfg.src.markups + '/modules/**/*.js'], ['js', reload]);
		// Watch .json files
		gulp.watch(cfg.src.root + '/**/*.json', [htmlCompiler, reload]);
		//Watch image files
		gulp.watch([
			cfg.src.img + '/*.{jpg,jpeg,png,gif}',
			cfg.src.tempImg + '/*.{jpg,jpeg,png,gif}',
			cfg.src.markups + '/**/**/images/sprites/*.{jpg,jpeg,png,gif}'
		], ['imagemin', reload]);
		//Watch sprite files
		gulp.watch([
			cfg.src.sprites + '/**/*.png',
			cfg.src.markups + '/**/images/sprite/*.png'
		], ['sprite', reload]);
		// Watch image files
		// gulp.watch('src/images/*.{jpg,jpeg,png,gif}', ['imagemin']).on("add", browserSync.reload);
		// gulp.watch('src/images/*.{jpg,jpeg,png,gif}', ['imagemin']).on("change", browserSync.reload);
		// gulp.watch('src/images/*.{jpg,jpeg,png,gif}', ['cleanDest']).on("unlink", browserSync.reload);
	};
};