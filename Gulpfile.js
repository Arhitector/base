// common used plugins
require('./gulp/consts');
global._ 			= require('lodash');
global.gulp 		= require('gulp');
global.gulpSequence = require('gulp-sequence');
global.glob 		= require('glob');
global.path 		= require('path');
global.fs 			= require('fs');
global.mkdirp		= require('mkdirp');
global.foreach 		= require('gulp-foreach');
global.gulpIf 		= require('gulp-if');
global.noop			= require('gulp-util').noop;
global.notify 		= require('gulp-notify');
global.plumber 		= require('gulp-plumber');
global.gulpSequence = require('gulp-sequence');
global.configLoader	= require('./gulp/config-loader');
global.args			= require('yargs').argv;
global.rimraf		= require('gulp-rimraf');

configLoader.load(args.env ? args.env : 'dev');
//- css preprocessors
gulp.task('less', function () {
	return require('./gulp/tasks/less')();
});
gulp.task('sass', function () {
	return require('./gulp/tasks/sass')();
});
//- html preprocessors
gulp.task('handlebars', function () {
	return require('./gulp/tasks/handlebars')();
});
gulp.task('jade', function () {
	return require('./gulp/tasks/jade')();
});
gulp.task('js', function (cb) {
	return require('./gulp/tasks/js')(cb);
});
gulp.task('imagemin', function () {
	return require('./gulp/tasks/imagemin')();
});
gulp.task('sprite', function () {
	return require('./gulp/tasks/sprite')();
});
gulp.task('connect', function () {
	return require('./gulp/tasks/connect')();
});
gulp.task('watch', function () {
	return require('./gulp/tasks/watch')();
});
gulp.task('cleanCache', function (done) {
	return cache.clearAll(done);
});
gulp.task('cleanDest', function () {
	return gulp.src([cfg.dest.root, cfg.src.styles + '/sprites'], {read: false}).pipe(rimraf());
});
gulp.task('cleanAll', function () {
	return gulp.src(['bower_components', '.sass-cache', 'temp', 'test', 'node_modules', cfg.dest.root, cfg.src.styles + '/sprites'], {read: false}).pipe(rimraf());
	gulp.start('cleanCache');
});
gulp.task('fonts', function () {
	gulp.src(cfg.src.fonts)
		.pipe(gulp.dest(cfg.dest.fonts))
});
gulp.task('default', gulpSequence('sprite', [cfg.cssBuilder, cfg.htmlCompiler, 'js', 'imagemin', 'connect'], 'watch'));
gulp.task('build', gulpSequence('sprite', [cfg.cssBuilder, cfg.htmlCompiler, 'js', 'imagemin']));
gulp.task('prod', function () {
	configLoader.load('prod');
	gulp.start('build');
});