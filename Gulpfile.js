var
	// load variables file
	cfg						= require('./config.js'),
	cssBuilder				= cfg.cssBuilder,
	// load plugins
	gulp					= require('gulp'),
	// servar/watch
	autowatch				= require('gulp-autowatch');
	browserSync				= require('browser-sync'),
	reload					= browserSync.reload,
	// css
	less					= require('gulp-less'),
	lessImport				= require('gulp-less-import'),
	csso 					= require('gulp-csso'),
	autoprefixer 			= require('gulp-autoprefixer'),
	base64					= require('gulp-base64'),
	sass					= require('gulp-ruby-sass'),
	sass2					= require('gulp-sass'),
	compass					= require('gulp-compass'),
	// js
	uglify					= require('gulp-uglify'),			//Minify files with UglifyJS.
	jshint					= require('gulp-jshint'),			//JSHint plugin for gulp
	concat					= require('gulp-concat'),			//Concatenates files
	// jade
	jade					= require('gulp-jade'),
	jadeInheritance			= require('gulp-jade-inheritance'),	// Rebuild a jade file with other files that have extended or included those file
	// imagemin
	imagemin				= require('gulp-imagemin'),
	changed					= require('gulp-changed'),			// Only pass through changed files
	cache					= require('gulp-cache'),			// caching proxy task
	flatten					= require('gulp-flatten'),			// remove or replace relative path for files
	// spritesmith
	spritesmith				= require('gulp.spritesmith'),
	pngquant				= require('imagemin-pngquant'),
	foreach					= require('gulp-foreach'),
	// claening
	clean					= require('gulp-clean'),			// Removes files and folders.
	//bower 
	bower					= require('bower'),
	mainBowerFiles			= require('main-bower-files'),
	// other
	size					= require('gulp-size'),
	path					= require('path'),
	sourcemaps				= require('gulp-sourcemaps'),		// js/css sourcemap
	notify					= require("gulp-notify"),			// notification plugin
	plumber					= require('gulp-plumber'),			// Prevent pipe breaking caused by errors
	print					= require('gulp-print'),			// print files in pipe
	gulpif					= require('gulp-if');				// 

gulp.task('less', ['sprite'], function () {
	gulp.start('lessTask');
});
gulp.task('lessTask', function () {
	return gulp.src([
			cfg.src.lib + '/lib.less',
			cfg.src.styles + '/**/*.less',
			cfg.src.markups + '/**/*.less'
		])
		.pipe(lessImport(cfg.src.allCss))
		.pipe(sourcemaps.init())
		.pipe(gulpif(
			check,
			plumber({
				errorHandler: function (err) {
					console.log(err.message);
					this.emit('end');
				}
			}))
		)
		.pipe(less({
			modifyVars: {
				'@img_path'		: cfg.destLess.img,
				'@temp_path'	: cfg.destLess.imgTemp,
				'@sprites_path'	: cfg.destLess.imgSprites,
				'@modules_path'	: cfg.destLess.imgModules
			}
		})).on('error', notify.onError(function (error) {
			return "Error on: " + error.filename + " in " + error.line + ' line';
		}))
		.pipe(autoprefixer({
			browsers: [cfg.src.browserSupport],
			cascade: true
		}))
		//.pipe(csso())
		.pipe(gulpif(
			cfg.base64Enable,
			base64({
				baseDir: cfg.dest.img,
				extensions: ['svg', 'png', 'jpg'],
				maxImageSize: cfg.src.base64Size,
				debug: true
			})
		))
		.pipe(sourcemaps.write('./'))
		.pipe(size({showFiles: true}))
		.pipe(gulp.dest(cfg.dest.css))
		.pipe(gulpif(
			cfg.SystemNotify,
			notify("File <%= file.relative %> compiled!")
		));
});
gulp.task('sass', function () {
	return sass(cfg.src.styles + "/all.scss")
		.pipe(print())
		//.pipe(sass())
		//.pipe(sass({ compass: true, sourcemap: true, style: 'compressed' }))
		/*.pipe(compass({
			//project: path.join(__dirname, '/'),
			css: cfg.dest.css,
			sass: cfg.src.styles
		}))*/
		.pipe(gulp.dest(cfg.dest.css));
});
gulp.task('jade', function() {
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
			data: {
				getData: function (dataPath) {
					return require(cfg.src.markups + '/' + dataPath);
				},
				page_title		: cfg.destJade.title,
				css_path		: cfg.destJade.css,
				js_path			: cfg.destJade.js,
				img_path		: cfg.destJade.img,
				temp_path		: cfg.destJade.imgTemp,
				sprites_path	: cfg.destJade.imgSprites
			}
		})).on('error', notify.onError(function (error) {
			return "Error: " + error.message ;
		}))
		.pipe(gulp.dest(cfg.dest.html))
		.pipe(gulpif(
			cfg.SystemNotify,
			notify('JADE task complete')
		));
});
gulp.task('js', function() {
	return gulp.src([
			cfg.src.lib + '/**/*.js',
			cfg.src.js + '/*.js',
			cfg.src.markups + '/**/**/*.js'
		])
		.pipe(sourcemaps.init())
		.pipe(
			plumber({
				errorHandler: function (err) {
					console.log(err.message);
					this.emit('end');
				}
			})
		)
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(uglify())
		.pipe(concat(cfg.dest.jsFile))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(cfg.dest.js))
		.pipe(gulpif(
			cfg.SystemNotify,
			notify('JS task complete')
		));
});
gulp.task('imagemin', function () {
	return gulp.src([
			cfg.src.img + '/*',//base image folder
			cfg.src.tempImg + '/*',//temp image folder
			cfg.src.markups + '/**/images/*'//images in markups
			])
		.pipe(changed(cfg.dest.img))
		.pipe(
			cache(
				imagemin({
					optimizationLevel: 3,
					progressive: true,
					interlaced: true,
					svgoPlugins: [{removeViewBox: false}],
					use: [pngquant()]
				})
			)
		)
		.pipe(flatten())
		.pipe(gulp.dest(cfg.dest.img))
		.pipe(size({showFiles: true}))
		.pipe(
			gulpif(
				cfg.SystemNotify,
				notify("File <%= file.relative %> minify!")
			)
		);
});
gulp.task('sprite', function() {
	return gulp.src([
		cfg.src.sprites + '/*',
		cfg.src.markups + '/**/**/images/sprites/*',
	])
	.pipe(foreach(function(stream, file) {
		var folderName = '',
			truePath = file.path.substring(file.path.lastIndexOf('src')) + "/*.png",
			foledrSpritePathParts = getPosixPath(file.path).match(/images\/sprites/);
			moduleSpritePathParts = getPosixPath(file.path).match(/modules\/([^\/]+)\/images\/sprites/);
			blockSpritePathParts = getPosixPath(file.path).match(/blocks\/([^\/]+)\/images\/sprites/);
			if (foledrSpritePathParts !== null) {
				folderName = path.basename(file.history)
			} else if (moduleSpritePathParts !== null) {
				folderName = moduleSpritePathParts[1];
			} else if (blockSpritePathParts !== null) {
				folderName = blockSpritePathParts[1];
			};
		return gulp.src(truePath)
			.pipe(spritesmith({
				imgName: 'sprite-' + folderName + '.png',
				cssName: 'sprite-' + folderName + '.' + cssBuilder,
				imgPath: '../' + cfg.destJade.imgSprites + '/sprite-' + folderName + '.png',
				cssFormat: cssBuilder,
				algorithm: 'binary-tree',
				padding: 10,
				cssTemplate: cfg.src.styles + '/helpers/' + cssBuilder + '.template.mustache'
			}))
			.pipe(gulpif('*.png', gulp.dest(cfg.dest.img)))
			.pipe(gulpif('*.' + cssBuilder, gulp.dest(cfg.src.styles + '/sprites')));
	}))
	.pipe(
		gulpif(
			cfg.SystemNotify,
			notify("Sprite <%= file.relative %> created!")
		)
	);
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
	// Watch styles files
	gulp.watch(cfg.src.root + '/**/*.' + cssBuilder, [cssBuilder, reload]);
	// Watch .jade files
	gulp.watch(cfg.src.root + '/**/*.jade', ['jade', reload]);
	// Watch .json files
	gulp.watch(cfg.src.root + '/**/*.json', ['jade', reload]);
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
});
gulp.task('cleanCache', function (done) {
	return cache.clearAll(done);
});
gulp.task('cleanDest', function () {
	return gulp.src([cfg.dest.root,cfg.src.styles + '/sprites'], {read: false})
	.pipe(clean());
});
gulp.task('cleanAll', function () {
	return gulp.src([
		'bower_components',
		'node_modules',
		cfg.dest.root,
		cfg.src.styles + '/sprites',
		cfg.src.lib,
		], {read: false})
	.pipe(clean());
	gulp.start('cleanCache');
});
gulp.task('copy', function() {
	gulp.src(cfg.src.fonts)
	.pipe(gulp.dest(cfg.dest.fonts))
});
gulp.task('hook', function () {
	gulp.src('pre-commit')
	.pipe(gulp.dest('.git/hooks/'));
});
gulp.task('pre-commit', [cssBuilder, 'jade', 'js', 'imagemin'], function() {
	//gulp.start(cssBuilder);
});
function getPosixPath(path) {
	return path.replace(/\\+/g, '/');
}

gulp.task('default', [cssBuilder, 'jade', 'js', 'imagemin'], function() {
	gulp.start('watch');
});
gulp.task('prod', function() {
	cfg = require('./prod-config.js')
	gulp.start('jade', cssBuilder, 'js', 'imagemin');
});