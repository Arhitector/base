module.exports = new function () {
	var jade				= require('gulp-jade'),
		jadeInheritance		= require('gulp-jade-inheritance');
		sourcemaps			= require('gulp-sourcemaps');

	return function () {
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
			data: _.extend({
					'env'		: env,
					isProd		: cfg.isProd,
					jsBundlePath: cfg.destTemplate.jsPath + '/' + cfg.jsBundle + '.js'
				}, cfg.destTemplate,
				{
					getData: function (dataPath) {
						return require('../' + cfg.src.markups + '/' + dataPath);
					}
				}
			)
		})).on('error', notify.onError(function (error) {
			return "Error: " + error.message ;
		}))
		.pipe(gulp.dest(cfg.dest.html))
		.pipe(gulpIf(
			cfg.systemNotify,
			notify('JADE task complete')
		));
	};
};