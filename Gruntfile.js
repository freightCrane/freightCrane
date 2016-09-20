module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		qunit: {
			all: {
        options: {
          urls: [
            'http://localhost:9001/tests/index.htm?module=Core',
            'http://localhost:9001/tests/index.htm?module=localstorage'
          ]
        }
      }
		},
    connect: {
      server: {
        options: {
          port: 9001,
          base: '.'
        }
      }
    },
	});
  grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-qunit');

  grunt.registerTask('test', ['connect', 'qunit']);

  // Default task(s).
	grunt.registerTask('default', ['test']);
};
