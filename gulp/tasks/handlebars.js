module.exports = new function () {
	var handlebars = require('handlebars');
		//handlebarsHelpers = require('../handlebars-helpers');



	return function() {
		return gulp
			.src(cfg.src.markups + '/**/*.hbs')
			.pipe(handlebars())
			.pipe(gulp.dest(cfg.dest.html));
	};
	// gulp.task('handlebarsInit', function (cb) {
	// 	return gulp
	// 		.src(cfg.src.markups + '/**/*.hbs')
	// 		.pipe(foreach(function (stream, file) {
	// 			fs.readFile(file.path, {encoding: 'utf8'}, function (err, data) {
	// 				if (err) {
	// 					throw new Error(err);
	// 				}
	// 				else {
	// 					var partialName = file.path.replace(/(\.tpl)*\.hbs$/, '')
	// 						.substring(path.resolve(cfg.src.markups).length + path.sep.length)
	// 						.trim().replace(/(\\|\/)+/g, '/');
	// 					handlebars.registerPartial(
	// 						partialName,
	// 						data
	// 					);
	// 				}
	// 			});
	// 			return stream;
	// 		}));
	// });

	// gulp.task('handlebarsRun', function () {
	// 	return gulp.src(cfg.src.markups + '/*.hbs')
	// 		.pipe(foreach(function (stream, file) {
	// 			var template = handlebars.compile(fs.readFileSync(file.path, 'utf8')),
	// 				output = template(_.extend(
	// 					{
	// 						'env': env,
	// 						isProd: cfg.isProd,
	// 						jsBundlePath: cfg.destTemplate.jsPath + '/' + cfg.jsBundle + '.js'
	// 					}, cfg.destTemplate));
	// 			fs.writeFile(cfg.dest.html + '/' + path.basename(file.path.replace(/\.hbs$/, '.html')), output);
	// 			return stream;
	// 		}));
	// });

	// return function () {
	// 	return gulpSequence('handlebarsInit', 'handlebarsRun').call();
	// };
};