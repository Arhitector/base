module.exports = new function () {
	var gulp 			= require('gulp'),
		path			= require('path'),
		foreach 		= require('gulp-foreach'),
		gulpIf 			= require('gulp-if'),
		notify 			= require('gulp-notify'),
		spritesmith		= require('gulp.spritesmith'),
		normalizePath	= require('../utils').normalizePath;

	function getSpritesmithConfig(folderName, suffix) {
		suffix = suffix || '';

		return {
			imgName    : 'sprite-' + folderName + suffix + '.png',
			cssName    : 'sprite-' + folderName + suffix + '.' + cfg.cssBuilder,
			imgPath    : '../' + cfg.destTemplate.imageSprites + '/sprite-' + folderName + suffix + '.png',
			cssFormat  : cfg.cssBuilder,
			algorithm  : 'binary-tree',
			padding    : 10,
			cssTemplate: cfg.src.styles + '/helpers/' + cfg.cssBuilder + '.template.mustache'
		};
	}

	return function () {
		return gulp.src([
			cfg.src.sprites + '/*',
			cfg.src.markups + '/**/images/sprites/',
		])
		.pipe(foreach(function (stream, file) {
			var folderName              = '',
				truePath                = file.path.substring(file.path.lastIndexOf('src')) + '/*.png',
				folderSpritePathParts   = normalizePath(file.path).match(/images\/sprites/),
				moduleSpritePathParts   = normalizePath(file.path).match(/modules\/([^\/]+)\/images\/sprites/),
				blocksSpritePathParts   = normalizePath(file.path).match(/blocks\/([^\/]+)\/images\/sprites/);

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
				.pipe(spritesmith(getSpritesmithConfig(folderName)))
				.pipe(gulpIf('*.png', gulp.dest(cfg.dest.img)))
				.pipe(gulpIf('*.' + cfg.cssBuilder, gulp.dest(cfg.src.styles + '/sprites')));
		}))
		.pipe(
			gulpIf(
				cfg.systemNotify,
				notify('Sprite <%= file.relative %> created!')
			)
		);
	};
};