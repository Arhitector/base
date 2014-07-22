var jadeInherit = require('./tasks/jadeInherit.js');

module.exports = function(grunt) {
	var CSSBuilder	= 'less', //less, sass
		pkg			= grunt.file.readJSON('package.json');

	grunt.initConfig({
		loc : {
			build				: 'build',
			root				: 'app',
			markup				: '<%= loc.root %>/markup',
			jade				: '<%= loc.root %>/jade',
			css					: '<%= loc.root %>/css',
			less				: '<%= loc.css %>/less',
			sass				: '<%= loc.css %>/sass',
			json				: '<%= loc.jade %>/source/json',
			images				: '<%= loc.root %>/images',
			img_sprite			: '<%= loc.images %>/for_sprite',

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
					ptimizationLevel	: 7,
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
				livereload: true
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
				tasks: ['merge-json']
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
					port		: 8080,
					livereload	: true,
					base		: '<%= loc.root %>'
				}
			}
		},
		copy : {
			main : {
				files : [
					{
						expand	: true,
						flatten	: true,
						src		: ['<%= loc.cssMin %>', '<%= loc.cssMapPath %>'],
						dest	: '<%= loc.build %>'
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
					'npm-debug.log'
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


//JADE inherit
	jadeInherit(grunt);

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

	grunt.registerTask('default', ['connect', 'merge-json', 'sprites', CSSBuilder, 'jade', 'watch']);
	grunt.registerTask('all', ['sprites', CSSBuilder, 'jade', 'imagemin']);

	grunt.registerTask('copy', [CSSBuilder, 'jade', 'imagemin', 'copy']);
	grunt.registerTask('clear', ['clean:clear']);
};