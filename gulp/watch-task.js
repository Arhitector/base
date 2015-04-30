module.exports = new function () {
	var gulp					= require('gulp'),
		autowatch				= require('gulp-autowatch');
		browserSync				= require('browser-sync'),
		reload					= browserSync.reload;			// Prevent pipe breaking caused by errors

	return function (cfg) {
		var cssBuilder				= cfg.cssBuilder,
			htmlCompiller			= cfg.htmlCompiller;
		// Watch styles files
	gulp.watch(cfg.src.root + '/**/*.' + cssBuilder, [cssBuilder, reload]);
	// Watch html compiller files
	gulp.watch(cfg.src.root + '/**/*.' + htmlCompiller, [htmlCompiller, reload]);
	// Watch .json files
	gulp.watch(cfg.src.root + '/**/*.json', [htmlCompiller, reload]);
	//Watch image files
	gulp.watch([
		cfg.src.img + '/*.{jpg,jpeg,png,gif}',
		cfg.src.tempImg + '/*.{jpg,jpeg,png,gif}',
		cfg.src.markups + '/**/**/images/sprites/*.{jpg,jpeg,png,gif}'
	], ['imagemin', reload]);
	// Watch image files
	// gulp.watch('src/images/*.{jpg,jpeg,png,gif}', ['imagemin']).on("add", browserSync.reload);
	// gulp.watch('src/images/*.{jpg,jpeg,png,gif}', ['imagemin']).on("change", browserSync.reload);
	// gulp.watch('src/images/*.{jpg,jpeg,png,gif}', ['cleanDest']).on("unlink", browserSync.reload);
	};
};