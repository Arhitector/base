module.exports = function(grunt) {
	var CSSBuilder	= 'less', //less, sass
		portHtml	= 8080,
		portLivereload	= 31510,
		pkg			= grunt.file.readJSON('package.json');


	grunt.initConfig({
		loc : {
			build				: 'build',
			root				: 'app',
			/* html template */
			markup				: '<%= loc.root %>/markup',
			jade				: '<%= loc.root %>/jade',
			/* style */
			css					: '<%= loc.root %>/css',
			less				: '<%= loc.css %>/less',
			sass				: '<%= loc.css %>/sass',
			/* json */
			json				: '<%= loc.jade %>/source/json',
			/* image */
			images				: '<%= loc.root %>/images',
			img_sprite			: '<%= loc.images %>/for_sprite',
			/* js */
			js				: '<%= loc.root %>/js',

			cssMinName			: 'all.min.css',
			cssMapName			: '<%= loc.cssMinName %>.map',
			cssMapUrl			: '../css/<%= loc.cssMapName %>',
			cssMapPath			: '<%= loc.css %>/<%= loc.cssMapName %>',
			cssMin				: '<%= loc.css %>/<%= loc.cssMinName %>',
			
			lessMain			: '<%= loc.less %>/all.less',
			sassMain			: '<%= loc.sass %>/all.scss',
			
			imagesMin			: '<%= loc.build %>/images'
		},
		"merge-json": {
			"common": {
				src: ["<%= loc.json %>/collection/*.json"],
				dest: "<%= loc.json %>/common.json"
			}
		},
		less : {
			dist : {
				files : {
					'<%= loc.cssMin %>' : '<%= loc.lessMain %>'
				}
			},
			options : {
				sourceMap			: true,
				compress			: true,
				sourceMapFilename	: '<%= loc.cssMapPath %>',
				sourceMapBasepath	: '<%= loc.less %>',
				sourceMapURL		: '<%= loc.cssMapUrl %>'
			}
		},
		sass : {
			dist : {
				files : {
					'<%= loc.cssMin %>' : '<%= loc.sassMain %>'
				}
			},
			options : {
				sourcemap	: '<%= loc.cssMapPath %>', //require sass ver 3.3.0, gem install sass --pre
				style		: 'compressed'
			}
		},
		imagemin : {
			dynamic : {
				options : {
					optimizationLevel	: 7,
					cache				: false
				},
				files: [{
					expand	: true,						// Enable dynamic expansion
					cwd		: '<%= loc.images %>',		// Src matches are relative to this path
					src		: ['**/*.{png,jpg,gif}'],	// Actual patterns to match
					dest	: '<%= loc.imagesMin %>'	// Destination path prefix
				}]
			}
		},
		jade : {
			compile: {
				options:{
					pretty	: true,
					client	: false,
					data	: function () {
						var loc = grunt.config('loc');
						return grunt.file.readJSON(loc.json + '/common.json');
					}
				},
				files: [{
					src : [
						'*.jade',
						'!source/**/*.jade'
					],
					dest	: '<%= loc.markup %>',
					cwd		: '<%= loc.jade %>',
					expand	: true,
					ext		: '.html',
					rename: function(destBase, destPath) {
						var index = destPath.lastIndexOf('/');
						if (index !== -1 && destPath.slice) {
							destPath = destPath.slice(index + 1, destPath.length);
						}
						return destBase + '/' + destPath.replace(/\.jade$/, '.html');
					}
				}]
			}
		},
		watch : {
			options: {
				livereload: portLivereload
			},
			all: {
				files: ['./Gruntfile.js'],
				tasks: ['all']
			},
			jade: {
				files: ['<%= loc.jade %>/**/*.jade'],
				tasks: ['jade'],
				options: {
					nospawn: true
				}
			},
			css: {
				files: [
					'<%= loc.css %>/**/*.less',
					'<%= loc.sass %>/**/*.scss',
					//Ignore files
					'!<%= loc.cssMin %>',
					'!<%= loc.cssMapPath %>'
				],
				tasks: [CSSBuilder]
			},
			json: {
				files: [
					'<%= loc.json %>/**/*.json'
				],
				tasks: ["merge-json", 'jade'],
				options: {
					nospawn: false
				}
			},
			sprites: {
				files: [
					'<%= loc.img_sprite %>/**/*.png',
					'<%= loc.img_sprite %>',
					'!<%= loc.images %>/sprites/**/*.png'
				],
				tasks: ['sprites', CSSBuilder]
			}
		},
		connect : {
			server : {
				options: {
					port		: portHtml,
					livereload	: portLivereload,
					base		: '<%= loc.root %>'
				}
			}
		},
		copy : {
			main : {
				files : [
					/* copy css */
					{
						expand	: true,
						flatten: true,
						src		: ['<%= loc.cssMin %>'],
						dest	: '<%= loc.build %>/css/'
					},
					/* copy image */
					{
						expand	: true,
						cwd		: '<%= loc.images %>',
						src		: '**',
						dest	: '<%= loc.imagesMin %>'
					},
					/* copy js */
					{
						expand	: true,
						cwd		: '<%= loc.js %>',
						src		: '**',
						dest	: '<%= loc.build %>/js'
					},
					/* copy html */
					{
						expand	: true,
						cwd		: '<%= loc.markup %>',
						src		: '**',
						dest	: '<%= loc.build %>/html'
					}
				]
			}
		},
		clean : {
			clear : {
				src : [
					'<%= loc.cssMin %>',
					'<%= loc.cssMapPath %>',
					'<%= loc.build %>',
					'node_modules',
					'build',
					'<%= loc.root %>/markup',
					'npm-debug.log'
				]
			},
			startClear : {
				src : [
					'<%= loc.build %>',
					'<%= loc.cssMin %>',
					'<%= loc.markup %>'
				]
			}
		},
		sprites : {
			options : {
				baseDir : '<%= loc.img_sprite %>',
				initSpritesmithConfig : function(folderName) {
					var loc = grunt.config('loc');

					return {
						engine : 'pngsmith',
						cssTemplate: loc.css + '/sprites/' + CSSBuilder + '.template.mustache',
						destImg : loc.images + '/sprites/' + folderName + '.png',
						imgPath: '../images/sprites/' + folderName + '.png',
						destCSS : loc.css + '/' + CSSBuilder + '/modules/' + '_sprite_' + folderName + '.' + CSSBuilder,
						cssFormat : CSSBuilder
					};
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');		//clean other files
	grunt.loadNpmTasks('grunt-contrib-less');		//convert less files to css
	grunt.loadNpmTasks('grunt-contrib-sass');		//convert sass files to css
	grunt.loadNpmTasks('grunt-contrib-watch');		//watching file change
	grunt.loadNpmTasks('grunt-contrib-connect');	//local server run
	grunt.loadNpmTasks('grunt-contrib-copy');		//copy files
	grunt.loadNpmTasks('grunt-contrib-imagemin');	//min images
	grunt.loadNpmTasks('grunt-contrib-jade');		//convert jade templates to html
	grunt.loadNpmTasks('grunt-sprites');			//make sprites
	grunt.loadNpmTasks('grunt-merge-json');			//include json
	grunt.loadNpmTasks('grunt-jade-inheritance');

	grunt.registerTask('default', ['clean:startClear', 'connect', 'merge-json', 'sprites', CSSBuilder, 'jade', 'watch']); // base
	grunt.registerTask('all', ['merge-json', 'sprites', CSSBuilder, 'jade']); // build progect without start server and wath
	grunt.registerTask('build', ['clean:startClear', 'merge-json', 'sprites', CSSBuilder, 'jade', 'copy']); //send project files to build folder
	grunt.registerTask('clear', ['clean:clear']); // clear progect files

};