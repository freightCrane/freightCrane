module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		qunit: {
			src: [
				'tests/index.htm?module=Core',
				'tests/index.htm?module=localstorage'
				]
		}
	});

	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.registerTask('test', 'qunit:src');

	// Default task(s).
	grunt.registerTask('default', ['test']);
};
