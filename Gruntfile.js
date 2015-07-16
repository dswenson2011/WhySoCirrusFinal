module.exports = function (grunt) {
	grunt.config.init({
		concurrent: {
			server: {
				tasks: ['nodemon', 'watch'],
				options: {
					logConcurrentOutput: true
				}
			}
		},
		watch: {
			scripts: {
				files: ['app/scripts/*.js', 'app/scripts/**/*.js'],
				tasks: ['concat', 'uglify']
			}
		},
		nodemon: {
			dev: {
				script: 'server.js',
				options: {
					watch: ['server.js', 'lib/**/*']
				}
			}
		},
		concat: {
			build: {
				files: {
					'app/js/compiled.js': ['app/scripts/string.js', 'app/scripts/core.js', 'app/scripts/route.js', 'app/scripts/services/*.js', 'app/scripts/app.js', 'app/scripts/controllers/*.js']
				}
			}
		},
		uglify: {
			build: {
				options: {
					mangle: false
				},
				files: {
					'app/js/compiled.min.js': ['app/js/compiled.js']
				}
			}
		}
	});

	grunt.task.loadNpmTasks('grunt-nodemon');
	grunt.task.loadNpmTasks('grunt-contrib-watch');
	grunt.task.loadNpmTasks('grunt-contrib-uglify');
	grunt.task.loadNpmTasks('grunt-contrib-concat');
	grunt.task.loadNpmTasks('grunt-concurrent');

	grunt.task.registerTask('default', ['concat', 'uglify', 'concurrent']);
};