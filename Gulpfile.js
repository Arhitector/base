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
	spritesmith				= require('gulp.spritesmith'),
	pngquant				= require('imagemin-pngquant'),
	foreach					= require('gulp-foreach'),
	gulpif					= require('gulp-if'),
	size					= require('gulp-size'),
	flatten					= require('gulp-flatten'),			// remove or replace relative path for files
	// other
	path					= require('path'),
	sourcemaps				= require('gulp-sourcemaps'),		// js/css sourcemap
	notify					= require("gulp-notify"),			// notification plugin
	through					= require('gulp-through'),			// stream transform factory
	changed					= require('gulp-changed');			// Only pass through changed files
	plumber					= require('gulp-plumber');			// Prevent pipe breaking caused by errors
	cache					= require('gulp-cache'),			// caching proxy task
	print					= require('gulp-print'),			// print files in pipe
	clean					= require('gulp-clean');			// Removes files and folders.

gulp.task('less', function () {
	return gulp.src([
			cfg.src.styles + '/**/*.less',
			cfg.src.markups + '/**/*.less',
		])
		.pipe(lessImport(cfg.src.allCss))
		.pipe(sourcemaps.init())
		.pipe(
			plumber({
				errorHandler: function (err) {
					console.log(err.message);
					this.emit('end');
				}
			})
		)
		.pipe(less({
			modifyVars: {
				'@bg_path'		: cfg.destPath.img,
				'@temp_path'	: cfg.destPath.imgTemp,
				'@sprites_path'	: cfg.destPath.imgSprites
			}
		})).on('error', notify.onError(function (error) {
			return "Error on: " + error.filename + " in " + error.line + ' line';
		}))
		.pipe(autoprefixer({
			browsers: [cfg.src.browserSupport],
			cascade: true
		}))
		.pipe(csso())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(cfg.dest.css))
		.pipe(notify("File <%= file.relative %> compiled!"));
});
gulp.task('jade', function() {
	return gulp.src(cfg.src.markups + '/*.jade')
		.pipe(jadeInheritance({basedir: cfg.src.markups}))
		.pipe(
			plumber({
				errorHandler: function (err) {
					console.log(err.message);
					this.emit('end');
				}
			})
		)
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
		})).on('error', notify.onError(function (error) {
			return "Error: " + error.message ;
		}))
		.pipe(gulp.dest(cfg.dest.root))
		.pipe(notify('Jade task complete'));
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
		.pipe(gulp.dest(cfg.dest.js));
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
		.pipe(notify("File <%= file.relative %> minify!"));
});
gulp.task('sprite', function() {
	return gulp.src([
		cfg.src.sprites + '/*',
		cfg.src.markups + '/modules/**/img/*'
		//cfg.src.markups + '/modules/header/img/sprite/*'
	])
	.pipe(foreach(function(stream, file) {
		var truePath = file.path.lastIndexOf('src')
			truePath = file.path.substring(truePath) + "/*.png"
			if (file.path.indexOf('/images/sprites/') != -1) {
				foldername = path.basename(file.history)
			}
			if (file.path.indexOf('/img/sprite') != -1) {
				firstsub = file.path.indexOf('/modules/');
				lastsub = file.path.lastIndexOf('/img/sprite/');
				foldername = file.path.substring(firstsub, lastsub);
			}
			//foldername = path.basename(file.history)
			/*gulpif(file.path.IndexOf('/img/sprite/') == -1), function() {
				foldername = path.basename(file.history)
			})
			gulpif(file.path.IndexOf('/img/sprite/') != -1), function() {
				firstsub = file.path.lastIndexOf('/modules/');
				lastsub = file.path.lastIndexOf('/img/sprite/');
				foldername = file.path.substring(firstsub, lastsub);
			});*/
			console.log(foldername)
		return gulp.src(truePath)
			.pipe(spritesmith({
				imgName: 's-' + foldername + '.png',
				cssName: 's-' + foldername + '.' + CSSBuilder,
				cssFormat: CSSBuilder,
				algorithm: 'binary-tree',
				padding: 10,
				cssTemplate: cfg.src.styles + '/helpers/less.template.mustache'
			}))
			.pipe(gulp.dest(cfg.dest.css));
	}));
	/*.pipe(foreach(function(stream, file) {
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
	}));*/
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

	gulp.watch(cfg.src.root + '/**/*.less', ['less', browserSync.reload]);
	// Watch .jade files
	// Watch image files
	gulp.watch(cfg.src.root + '/**/*.jade', ['jade', browserSync.reload]);
	gulp.watch('src/images/*.{jpg,jpeg,png,gif}', ['imagemin', browserSync.reload]);
	// Watch .jade files
	// Watch image files
	// gulp.watch('src/images/*.{jpg,jpeg,png,gif}', ['imagemin']).on("add", browserSync.reload);
	// gulp.watch('src/images/*.{jpg,jpeg,png,gif}', ['imagemin']).on("change", browserSync.reload);
	// gulp.watch('src/images/*.{jpg,jpeg,png,gif}', ['cleanDest']).on("unlink", browserSync.reload);
	// gulp.watch({
	// 	root: cfg.src.root,
	// 	match: [{
	// 		when: '/**/*.js',
	// 		then: gulp.start('js')
	// 	}, {
	// 		when: '/**/*.less',
	// 		then: gulp.start('less')
	// 	}, {
	// 		when: '/**/*.jade',
	// 		then: gulp.start('jade')
	// 	}]
	// });
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