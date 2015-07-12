module.exports = function (grunt) {
	grunt.config.init({
		nodemon: {
			dev: {
				script: 'server.js'
			}
		}
	});

	grunt.task.loadNpmTasks('grunt-nodemon');
	grunt.task.loadNpmTasks('grunt-contrib-watch');

	grunt.task.registerTask('default', ['nodemon']);
	grunt.task.registerTask('server', ['nodemon']);
};