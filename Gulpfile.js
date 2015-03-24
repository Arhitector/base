// cloudinary, marge json
// newer need help
//imagemin problem with folder modules/
// spritesmith need optimization
var
	// load variables file
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
	// js
	uglify					= require('gulp-uglify'), //Minify files with UglifyJS.
	jshint					= require('gulp-jshint'), //JSHint plugin for gulp
	concat					= require('gulp-concat'), //Concatenates files
	//browserify				= require('browserify'),
	// jade
	jade					= require('gulp-jade'),
	jadeInheritance			= require('gulp-jade-inheritance'),
	extend					= require('gulp-extend'), // combine json
	// image
	imagemin				= require('gulp-imagemin'),
	pngquant				= require('imagemin-pngquant'),
	flatten					= require('gulp-flatten'), // remove or replace relative path for files
	// other
	sourcemaps				= require('gulp-sourcemaps'), // js/css sourcemap
	notify					= require("gulp-notify"), // notification plugin
	cache					= require('gulp-cache'), // caching proxy task
	print					= require('gulp-print'), // print files in pipe
	clean					= require('gulp-clean'); // Removes files and folders.

gulp.task('less', function () {
	return gulp.src([
			cfg.src.styles + '/**/*.less',
			cfg.src.markups + '/modules/**/*.less',
			cfg.src.markups + '/mixins/**/*.less'
		])
		.pipe(lessImport('all.min.less'))
		.pipe(sourcemaps.init())
		.pipe(less({
			compress			: false
		}))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: true
		}))
		.pipe(csso())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(cfg.dest.css))
		.pipe(notify("File <%= file.relative %> compiled!"));
		//.pipe(notify({ message: 'Less task complete' }));
});
gulp.task('mergeJson', function() {
	return gulp.src(cfg.src.markups + '/**/**/*.json')
		.pipe(extend('commonJson.json'))
		.pipe(gulp.dest(cfg.src.root + '/simple-data'));
});
gulp.task('jade', function() {
	return gulp.src(cfg.src.markups + '/*.jade')
		.pipe(jadeInheritance({basedir: cfg.src.markups}))
		.pipe(print(this))
		.pipe(jade({
			pretty: true
		}))
		.pipe(gulp.dest(cfg.dest.root))
		.pipe(notify({ message: 'Jade task complete' }));
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
			cache(//
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
	var spriteData = 
		gulp.src(cfg.src.sprites + '**/*.*')
			.pipe(spritesmith({
				imgName: cfg.dest.root + 's-' + folderName + '.png',
				cssName: cfg.src.styles + 's' + folderName + '.less',
				cssFormat: 'less',
				algorithm: 'binary-tree',
				cssTemplate: cfg.src.styles + 'helpers/less.template.mustache'
			}));

	spriteData.img.pipe(gulp.dest(cfg.dest.img));
	spriteData.css.pipe(gulp.dest(cfg.src.styles + '/components'));
});

gulp.task('connect', function() {
	browserSync({
		notify		: false,
		directory	: true,
		server: {
			baseDir: cfg.dest.root
			},
		port: 8050
	});
});

gulp.task('watch', ['connect'], function() {
	// Watch .less files
	gulp.watch(cfg.src.styles + '/**/*.less', ['less', browserSync.reload]);
	// Watch .json files
	gulp.watch(cfg.src.markups + '/**/*.json', ['mergeJson', browserSync.reload]);
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
	gulp.src(['src/*'])
	.pipe(gulp.dest('./dest'))
	gulp.src(['src/**/*'])
	.pipe(gulp.dest('./dest'))
});

gulp.task('default', ['jade']);
gulp.task('devcompil', function() {
	 gulp.start('jade', 'less', 'js', 'imagemin');
});