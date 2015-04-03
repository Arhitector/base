// cloudinary
//imagemin problem with folder modules/
// spritesmith need optimization
var
	// load variables file
	cfg						= require('./config.js'),
	CSSBuilder				= cfg.CSSBuilder
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
	clean					= require('gulp-clean');			// Removes files and folders.
	// other
	size					= require('gulp-size'),
	path					= require('path'),
	sourcemaps				= require('gulp-sourcemaps'),		// js/css sourcemap
	notify					= require("gulp-notify"),			// notification plugin
	plumber					= require('gulp-plumber');			// Prevent pipe breaking caused by errors
	print					= require('gulp-print'),			// print files in pipe
	gulpif					= require('gulp-if');				// 

gulp.task('less', function () {
	return gulp.src([
			cfg.src.styles + '/**/*.less',
			cfg.src.markups + '/**/*.less',
		])
		.pipe(lessImport(cfg.src.allCss))
		.pipe(sourcemaps.init())
		.pipe(plumber({
				errorHandler: function (err) {
					console.log(err.message);
					this.emit('end');
				}
		}))
		.pipe(less({
			modifyVars: {
				'@img_path'		: cfg.destLess.img,
				'@temp_path'	: cfg.destLess.imgTemp,
				'@sprites_path'	: cfg.destLess.imgSprites
			}
		})).on('error', notify.onError(function (error) {
			return "Error on: " + error.filename + " in " + error.line + ' line';
		}))
		
		.pipe(autoprefixer({
			browsers: [cfg.src.browserSupport],
			cascade: true
		}))
		.pipe(csso())
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
		.pipe(gulp.dest(cfg.dest.root))
		.pipe(gulpif(
			cfg.SystemNotify,
			notify('JADE task complete')
		));
});
gulp.task('js', function() {
	return gulp.src([cfg.src.js + '/*.js', cfg.src.markups + '/**/**/*.js'])
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
			cfg.src.img + '/temp/*',//temp image folder
			cfg.src.markups + '/mixins/img/*',//mixins images
			cfg.src.markups + '/modules/img/*'//modules images
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
gulp.task('sprite', ['spriteTask'], function(){
	gulp.start(CSSBuilder);
});
gulp.task('spriteTask', function() {
	return gulp.src([
		cfg.src.sprites + '/*',
		cfg.src.markups + '/modules/**/img/*',
		cfg.src.markups + '/mixins/**/img/*'
	])
	.pipe(foreach(function(stream, file) {
		var foldername = '',
			truePath = file.path.lastIndexOf('src'),
			truePathRetina = file.path.substring(truePath) + "/*-2x.png",
			truePath = file.path.substring(truePath) + "/*!(-2x).png",
			moduleSpritePathParts = file.path.match(/modules\/([^\/]+)\/img\/sprite/);
			mixinsSpritePathParts = file.path.match(/mixins\/([^\/]+)\/img\/sprite/);
			if (file.path.search('/images/sprites/') != -1) {
				foldername = path.basename(file.history)
			} else if (moduleSpritePathParts) {
				foldername = moduleSpritePathParts[1];
			} else if (mixinsSpritePathParts) {
				foldername = mixinsSpritePathParts[1];
			}
		return gulp.src(truePath)
			.pipe(spritesmith({
				//retinaSrcFilter: truePathRetina,
				imgName: 's-' + foldername + '.png',
				//retinaImgName: 's-' + foldername + '-2x.png',
				cssName: 's-' + foldername + '.' + CSSBuilder,
				cssFormat: CSSBuilder,
				algorithm: 'binary-tree',
				padding: 10,
				cssTemplate: cfg.src.styles + '/helpers/' + CSSBuilder + '.template.mustache'
			}))
			.pipe(gulpif('*.png', gulp.dest(cfg.dest.img)))
			.pipe(gulpif('*.less', gulp.dest(cfg.src.styles + '/sprites')));
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
	// Watch .less files
	gulp.watch(cfg.src.root + '/**/*.less', ['less', reload]);
	// Watch .jade files
	gulp.watch(cfg.src.root + '/**/*.jade', ['jade', reload]);
	gulp.watch([
		cfg.src.img + '/*.{jpg,jpeg,png,gif}',
		cfg.src.tempImg + '/*.{jpg,jpeg,png,gif}',
		cfg.src.markups + '/**/*.{jpg,jpeg,png,gif}'
	], ['imagemin', reload]);
	// Watch .jade files
	// Watch image files
	// gulp.watch('src/images/*.{jpg,jpeg,png,gif}', ['imagemin']).on("add", browserSync.reload);
	// gulp.watch('src/images/*.{jpg,jpeg,png,gif}', ['imagemin']).on("change", browserSync.reload);
	// gulp.watch('src/images/*.{jpg,jpeg,png,gif}', ['cleanDest']).on("unlink", browserSync.reload);
});
gulp.task('clearCache', function (done) {
	return cache.clearAll(done);
});
gulp.task('cleanDest', function () {
	return gulp.src([cfg.dest.root,cfg.src.styles + '/sprites'], {read: false})
	.pipe(clean());
});
gulp.task('copy', function() {
	gulp.src(cfg.src.fonts)
	.pipe(gulp.dest(cfg.dest.fonts))
});

gulp.task('default', [CSSBuilder, 'jade', 'js', 'imagemin'], function() {
	gulp.start('watch');
});
gulp.task('prod', function() {
	cfg = require('./prod-config.js')
	gulp.start('jade', CSSBuilder, 'js', 'imagemin');
});