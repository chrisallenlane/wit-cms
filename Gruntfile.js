module.exports = function(grunt) {
  grunt.initConfig({

    // linter
    jshint: {
      options: {
        esnext   : true,
        loopfunc : true,
        laxbreak : true,
      },

      all: [
        '*.js',
        'test/*.js',
      ]
    },

    // mocha (unit testing)
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/*.js']
      }
    },
  });

  grunt.registerTask('default', [ 'jshint', 'mochaTest' ]);

  // load the grunt modules
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
};
