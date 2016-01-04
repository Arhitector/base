module.exports = new function () {
	var gulp		= require('gulp'),
		fs			= require('fs'),
		stealTools	= require('steal-tools'),
		mkdirp		= require('mkdirp'),
		_			= require('lodash'),
		glob		= require('glob');

	return function (cb) {
		if (cfg.isProd) {
			var bundle = _.extend({
					main: [],
					include: [],
					exclude: []
				}, cfg.jsBundles[cfg.jsBundle]),
				includes = [],
				files = [];

			if (bundle.include.indexOf('*') !== -1) {
				includes = _.map(glob.sync(cfg.src.modules + '/*'), function (value) {
					return value.substr(cfg.src.markups.length + 1);
				});
				_.forIn(glob.sync(cfg.src.layouts + '/*'), function (value) {
					includes.push(value.substr(cfg.src.markups.length + 1));
				});
			}
			else {
				includes = bundle.include;
			}
			includes.forEach(function (fileName) {
				var filePath = cfg.src.markups + '/' + fileName;

				if (fs.statSync(filePath).isDirectory()) {
					glob.sync(filePath + '/**/*.@(js)').forEach(function (depName) {
						files.push(depName.substr(cfg.src.markups.length + 1));
					});
				}
				else {
					files.push(fileName);
				}
			});
			bundle.exclude.forEach(function (pattern) {
				if (pattern.constructor === RegExp) {
					_.remove(files, function (fileName) {
						return pattern.test(fileName);
					});
				}
				else {
					files = _.without(files, pattern);
				}
			});
			files = _.map(files, function (fileName) {
				return fileName.replace(/\.(js)$/, '');
			});
			_.forEach(bundle.main, function (fileName, i) {
				files.splice(i, 0, [fileName]);
			});
			mkdirp.sync(cfg.dest.temp + '/bundles/' + cfg.jsBundle);
			fs.writeFileSync(cfg.dest.temp + '/bundles/' + cfg.jsBundle + '/' + cfg.jsBundle + '.js', '' +
				'define(' + (files.length > 0 ? '["' + files.join('", "') + '"]' : '') + ', function () {' + "\n" +
				"\t" + '// bundle file' + "\n" +
				'});'
			);
			stealTools.build(
				{
					main:			cfg.jsBundle,
					config:			'./bower.json!bower',
					bundlesPath:	cfg.dest.dist + '/bundles/' + cfg.jsBundle,
					paths: (function () {
						var paths = {};

						paths[cfg.jsBundle] = cfg.dest.temp + '/bundles/' + cfg.jsBundle + '/' + cfg.jsBundle + '.js';
						return paths;
					})()
				},
				{
					bundle: [bundle.main],
					sourceMaps: false,
					bundleSteal: true,
					debug: false,
					minify: false
				}
			).then(function () {
					gulp.src(cfg.dest.dist + '/bundles/' + cfg.jsBundle + '/*')
						.pipe(gulp.dest(cfg.dest.js))
						.on('end', function () {
							cb();
						});
				});
		}
		else {
			cb();
		}
	};
};