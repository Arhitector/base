module.exports = function (cfg) {
	var gulp              = require('gulp'),
		gulpSequence      = require('gulp-sequence'),
		foreach           = require('gulp-foreach'),
		fs                = require('fs'),
		path              = require('path'),
		handlebars        = require('handlebars'),
		handlebarsLayouts = require('handlebars-layouts'),
		underscore        = require('underscore');

	gulp.task('handlebarsInit', function () {
		handlebars.registerHelper(handlebarsLayouts(handlebars));

		handlebars.registerHelper('mixin', function (name, options) {
			var context  = underscore.clone(this),
				output   = '',
				template,
				filePath = cfg.src.markups +
					(name.indexOf('/') === -1 ? '/mixins/' + name : '/' + name);

			if (filePath.indexOf('.stache') === -1) {
				filePath += '.stache';
			}
			if (fs.existsSync(filePath)) {
				context = underscore.extend(context, options.hash || {});
				template = handlebars.compile(fs.readFileSync(filePath, 'utf8'));
				output = new handlebars.SafeString(template(context));
			}
			return output;
		});

		return gulp
			.src(cfg.src.markups + '/**/*.partial.stache')
			.pipe(foreach(function (stream, file) {
				try {
					fs.readFile(file.path, {encoding: 'utf8'}, function (err, data) {
						if (err) {
							console.log(err);
						}
						else {
							try {
								var partialName = path.basename(file.path).replace(/\.partial\.stache$/, '').trim();
								handlebars.registerPartial(
									partialName,
									data
								);
							}
							catch (err) {
								console.log(err);
							}
						}
					});
				}
				catch (err) {
					console.log(err);
				}
				return stream;
			}));
	});

	gulp.task('handlebarsRun', function () {
		return gulp.src(cfg.src.markups + '/*.stache')
			.pipe(foreach(function (stream, file) {
				try {
					var template = handlebars.compile(fs.readFileSync(file.path, 'utf8')),
					    output   = template({
						    pageTitle  : cfg.destJade.title,
						    cssPath    : cfg.destJade.css,
						    jsPath     : cfg.destJade.js,
						    imgPath    : cfg.destJade.img,
						    tempPath   : cfg.destJade.imgTemp,
						    spritesPath: cfg.destJade.imgSprites
					    });
					fs.writeFile(file.path.replace(/\.stache$/, '.html'), output);
				}
				catch (err) {
					console.log(err);
				}
			}));
	});

	return function () {
		return gulpSequence('handlebarsInit', 'handlebarsRun')();
	};
};