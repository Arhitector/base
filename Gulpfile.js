// cloudinary
//imagemin problem with folder modules/
// spritesmith need optimization
var
	// load variables file
	CSSBuilder				= "less"
	cfg						= require('./config.js'),
	// load plugins
	gulp					= require('gulp'),
	// servar/watch
	browserSync				= require('browser-sync'),
	reload					= browserSync.reload,
	// css
	less					= require('gulp-less'),
	lessImport				= require('gulp-less-import'),
	csso 					= require('gulp-csso'),
	autoprefixer 			= require('gulp-autoprefixer'),
	replace					= require('gulp-replace-task'),
	// js
	uglify					= require('gulp-uglify'),			//Minify files with UglifyJS.
	jshint					= require('gulp-jshint'),			//JSHint plugin for gulp
	concat					= require('gulp-concat'),			//Concatenates files
	//browserify				= require('browserify'),
	// jade
	jade					= require('gulp-jade'),
	jadeInheritance			= require('gulp-jade-inheritance'),
	// image
	imagemin				= require('gulp-imagemin'),
	spritesmith				= require("gulp-spritesmith"),
	pngquant				= require('imagemin-pngquant'),
	foreach					= require('gulp-foreach'),
	gulpif					= require('gulp-if'),
	flatten					= require('gulp-flatten'),			// remove or replace relative path for files
	// other
	path					= require('path'),
	sourcemaps				= require('gulp-sourcemaps'),		// js/css sourcemap
	notify					= require("gulp-notify"),			// notification plugin
	through					= require('gulp-through'),			// stream transform factory
	cache					= require('gulp-cache'),			// caching proxy task
	print					= require('gulp-print'),			// print files in pipe
	clean					= require('gulp-clean');			// Removes files and folders.

gulp.task('less', function () {
	return gulp.src([
			cfg.src.styles + '/**/*.less',
			cfg.src.markups + '/modules/**/*.less',
			cfg.src.markups + '/mixins/**/*.less'
		])
		.pipe(lessImport(cfg.src.allCss))
		.pipe(sourcemaps.init())
		.pipe(less({
			modifyVars: {
				'@bg_path'		: cfg.destPath.img,
				'@temp_path'	: cfg.destPath.imgTemp,
				'@sprites_path'	: cfg.destPath.imgSprites
			}
		}))
		.pipe(autoprefixer({
			browsers: [cfg.src.browserSupport],
			cascade: true
		}))
		.pipe(csso())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(cfg.dest.css))
		.pipe(notify("File <%= file.relative %> compiled!"));;
});
gulp.task('jade', function() {
	return gulp.src(cfg.src.markups + '/*.jade')
		.pipe(jadeInheritance({basedir: cfg.src.markups}))
		.pipe(jade({
			pretty: true,
			data: {
				getData: function (dataPath) {
					return require('./' + cfg.src.markups + '/' + dataPath);
				},
				page_title		: 'Omnigon',
				css_path		: cfg.destPath.css,
				js_path			: cfg.destPath.js,
				img_path		: cfg.destPath.img,
				temp_path		: cfg.destPath.imgTemp,
				sprites_path	: cfg.destPath.imgSprites
			}
		}))
		.pipe(gulp.dest(cfg.dest.root))
		.pipe(notify('Jade task complete'));
});
gulp.task('js', function() {
	return gulp.src([cfg.src.js + '/*.js', cfg.src.markups + '/**/**/*.js'])
		.pipe(sourcemaps.init())
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(uglify())
		.pipe(concat(cfg.dest.jsFile))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(cfg.dest.js));
});
gulp.task('imagemin', function () {
	return gulp.src([
			cfg.src.img + '/*',//base image folder
			cfg.src.img + '/temp/*',//temp image folder
			cfg.src.markups + '/**/**/img/*'//modules and mixins images
			])
		.pipe(
			cache(
				imagemin({
					progressive: true,
					interlaced: true,
					svgoPlugins: [{removeViewBox: false}],
					use: [pngquant()]
				})
			)
		)
		.pipe(flatten())
		.pipe(gulp.dest(cfg.dest.img))
		.pipe(notify({ message: 'Imagemin task complete.'}));// as example of notification
});

gulp.task('sprite', function() {
	return gulp.src([
		cfg.src.sprites + '/*/',//base sprites folder
		cfg.src.markups + '/**/img/sprite/'//module's sprites folder
	])
	.pipe(foreach(function(stream, file) {
		var truePath = file.path.lastIndexOf('src')
		truePath = file.path.substring(truePath)
		return gulp.src(truePath)

			.pipe(spritesmith({
				imgName: cfg.dest.root + 's-' + path.basename(file.history) + '.png',
				cssName: cfg.src.styles + '/components/' + 's-' + path.basename(file.history) + '.less',
				cssFormat: 'less',
				algorithm: 'binary-tree',
				cssTemplate: cfg.src.styles + '/helpers/less.template.mustache'
			}))
			.pipe(gulpif('*.png', gulp.dest(cfg.dest.img)))
	}));
});

gulp.task('connect', function() {
	browserSync({
		notify		: false,
		directory	: true,
		open		: false,
		port		: cfg.dest.cPort,
		server: {
			baseDir: cfg.dest.root
		}
	});
});

gulp.task('watch', ['connect'], function() {
	// Watch .less files
	gulp.watch(cfg.src.styles + '/**/*.less', ['less', browserSync.reload]);
	gulp.watch(cfg.src.markups + '/**/**/*.less', ['less', browserSync.reload]);
	// Watch .jade files
	gulp.watch(cfg.src.markups + '/**/*.jade', ['jade', browserSync.reload]);
	// Watch image files
	gulp.watch('src/images/**/*', ['imagemin', browserSync.reload]);
});

gulp.task('clearCache', function (done) {
	return cache.clearAll(done);
});
gulp.task('cleanDest', function () {
	return gulp.src(cfg.dest.root, {read: false})
		.pipe(clean());
});
gulp.task('copy', function() {
	gulp.src(cfg.src.fonts)
	.pipe(gulp.dest(cfg.dest.fonts))
});

gulp.task('default', ['less', 'jade', 'js', 'imagemin', 'watch']);
gulp.task('prod', function() {
	cfg = require('./prod-config.js')
	gulp.start('jade', CSSBuilder, 'js', 'imagemin');
});