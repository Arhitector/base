module.exports = function (cfg) {
	var gulp              = require('gulp'),
	    gulpSequence      = require('gulp-sequence'),
		fs                = require('fs'),
	    handlebars        = require('handlebars'),
	    handlebarsLayouts = require('handlebars-layouts');

	gulp.task('hbInit', function () {
		handlebars.registerHelper(handlebarsLayouts(handlebars));

		return gulp
			.src(cfg.src.markups + '/**/*.partial.stache')
			.pipe(
				foreach(function (stream, file) {
					handlebars.registerPartial(
						path.basename(file.path).replace(/\.partial\.stache$/, ''),
						fs.readFileSync(file.path, 'utf8')
					);
					return stream;
				})
			);
	});

	gulp.task('hbRun', function () {
		return gulp
			.src(cfg.src.markups + '/*.stache')
			.pipe(
				foreach(function (stream, file) {
					var template = handlebars.compile(fs.readFileSync(file.path, 'utf8')),
					    output = template({
						    pageTitle   : cfg.destJade.title,
						    cssPath     : cfg.destJade.css,
						    jsPath      : cfg.destJade.js,
						    imgPath     : cfg.destJade.img,
						    tempPath    : cfg.destJade.imgTemp,
						    spritesPath : cfg.destJade.imgSprites
					    });

					fs.writeFile(file.path.replace(/\.stache$/, '.html'), output);
					return stream;
				})
			);
	});

	return function () {
		return gulpSequence('hbInit', 'hbRun')();
	};
};