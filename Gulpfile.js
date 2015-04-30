var
	// load variables file
	cfg						= require('./config.js'),
	cssBuilder				= cfg.cssBuilder,
	htmlCompiller			= cfg.htmlCompiller,
	// server
	browserSync				= require('browser-sync'),
	reload					= browserSync.reload,
	// load plugins
	gulp					= require('gulp'),
	// claening
	clean					= require('gulp-clean'),
	glob                    = require('glob'),
	fs                      = require('fs'),
	path                    = require('path'),
	handlebars              = require('handlebars'),
	handlebarsLayouts       = require('handlebars-layouts');

gulp.task('less', ['sprite'], function () {
	gulp.start('lessTask');
});
gulp.task('lessTask', function () {
	return require('./gulp/less-task')(cfg);
});
gulp.task('sass', function () {
	return require('./gulp/sass-task')(cfg);
});
gulp.task('hb', function() {
	handlebars.registerHelper(handlebarsLayouts(handlebars))
	return gulp.src(cfg.src.markups + '/**/*.partial.stache')
	.pipe(foreach(function (er, files) {
		files.forEach(function (file) {
			try {
				var partialName = path.basename(file).replace(/\.partial\.stache$/, '').trim();

				handlebars.registerPartial(
					partialName,
					fs.readFileSync(file, 'utf8')
				);
			}
			catch (err) {
				console.log(err);
			}
		});
	}));
	/*glob(cfg.src.markups + '/*.stache', function (er, files) {
		files.forEach(function (file) {
			try {
				console.log(file);
				var template = handlebars.compile(fs.readFileSync(file, 'utf8')),
				    output = template({
					    pageTitle   : cfg.destJade.title,
					    cssPath     : cfg.destJade.css,
					    jsPath      : cfg.destJade.js,
					    imgPath     : cfg.destJade.img,
					    tempPath    : cfg.destJade.imgTemp,
					    spritesPath : cfg.destJade.imgSprites
				    });

				fs.writeFile(file.replace(/\.stache$/, '.html'),  output);
			}
			catch (err) {
				console.log(err);
			}
		});*/
	//});
});
gulp.task('jade', function() {
	return require('./gulp/jade-task')(cfg);
});
gulp.task('js', function() {
	return require('./gulp/js-task')(cfg);
});
gulp.task('imagemin', function () {
	return require('./gulp/imagemin-task')(cfg);
});
gulp.task('sprite', function() {
	return require('./gulp/sprite-task')(cfg);
});
gulp.task('connect', function() {
	browserSync({
		notify		: false,
		directory	: true,
		open		: false,
		port		: cfg.cPort,
		server: {
			baseDir: cfg.dest.root
		}
	});
});
gulp.task('watch', ['connect'], function() {
	return require('./gulp/watch-task')(cfg);
});
gulp.task('cleanCache', function (done) {
	return cache.clearAll(done);
});
gulp.task('cleanDest', function () {
	return gulp.src([cfg.dest.root,cfg.src.styles + '/sprites'], {read: false}).pipe(clean());
});
gulp.task('cleanAll', function () {
	return gulp.src(['bower_components','node_modules',cfg.dest.root,cfg.src.styles + '/sprites',], {read: false}).pipe(clean());
	gulp.start('cleanCache');
});
gulp.task('fonts', function() {
	gulp.src(cfg.src.fonts)
	.pipe(gulp.dest(cfg.dest.fonts))
});
gulp.task('hook', function () {
	gulp.src('pre-commit')
	.pipe(gulp.dest('.git/hooks/'));
});
gulp.task('pre-commit', [cssBuilder, htmlCompiller, 'js', 'imagemin'], function() {
	//gulp.start(cssBuilder);
});
gulp.task('default', [cssBuilder, htmlCompiller, 'js', 'imagemin'], function() {
	gulp.start('watch');
});
gulp.task('build', [cssBuilder, htmlCompiller, 'js', 'imagemin'], function() {});
gulp.task('prod', function() {
	cfg = require('./prod-config.js')
	gulp.start(htmlCompiller, cssBuilder, 'js', 'imagemin');
});