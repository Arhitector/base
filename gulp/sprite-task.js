module.exports = new function () {
	var spritesmith		= require('gulp.spritesmith'),
		gulp			= require('gulp'),
		gulpif			= require('gulp-if'),
		foreach			= require('gulp-foreach'),
		path			= require('path'),
		normalizePath	= require('./utils').normalizePath,
		print			= require('gulp-print')
		notify			= require('gulp-notify');

	return function (cfg) {
		return gulp.src([
			cfg.src.sprites + '/*',
			cfg.src.markups + '/**/images/sprites/',
		])
		//.pipe(print())
		.pipe(foreach(function (stream, file) {
			var folderName            = '',
				truePath              = file.path.substring(file.path.lastIndexOf('src')) + '/*.png',
				folderSpritePathParts = normalizePath(file.path).match(/images\/sprites/),
				moduleSpritePathParts = normalizePath(file.path).match(/modules\/([^\/]+)\/images\/sprites/),
				blocksSpritePathParts = normalizePath(file.path).match(/blocks\/([^\/]+)\/images\/sprites/);
			if (moduleSpritePathParts !== null) {
				folderName = moduleSpritePathParts[1];
			}
			else if (blocksSpritePathParts !== null) {
				folderName = blocksSpritePathParts[1];
			}
			else if (folderSpritePathParts !== null) {
				folderName = path.basename(file.history)
			}
			return gulp.src(truePath)
				.pipe(spritesmith({
					imgName    : 'sprite-' + folderName + '.png',
					cssName    : 'sprite-' + folderName + '.' + cfg.cssBuilder,
					imgPath    : '../' + cfg.destJade.imgSprites + '/sprite-' + folderName + '.png',
					cssFormat  : cfg.cssBuilder,
					algorithm  : 'binary-tree',
					padding    : 10,
					cssTemplate: cfg.src.styles + '/helpers/' + cfg.cssBuilder + '.template.mustache'
				}))
				.pipe(gulpif('*.png', gulp.dest(cfg.dest.img)))
				.pipe(gulpif('*.' + cfg.cssBuilder, gulp.dest(cfg.src.styles + '/sprites')));
		}))
		.pipe(
			gulpif(
				cfg.SystemNotify,
				notify('Sprite <%= file.relative %> created!')
			)
		);
	};
};