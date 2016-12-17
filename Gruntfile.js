module.exports = function(grunt) {
  grunt.registerTask('default', ['copy', 'uglify', 'cssmin', 'htmlmin', 'connect']);
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
      build: {
        cwd: 'src',
        src: [ 'assets/*' ],
        dest: 'build',
        expand: true
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      dist: {
        src: 'src/*.js',
        dest: 'build/index.min.js'
      }
    },
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: [{
          expand: true,
          cwd: 'src',
          src: ['*.css', 'css/*.css', '!*.min.css'],
          dest: 'build',
          ext: '.min.css'
        }]
      }
    },
    htmlmin: {
      options: {
        removeComments: true,
        collapseWhitespace: true
      },
      target: {
        files: {
          'build/index.html': 'src/index.html',
          'build/partials/answer.html': 'src/partials/answer.html',
          'build/partials/intro.html': 'src/partials/intro.html',
          'build/partials/quiz.html': 'src/partials/quiz.html',
          'build/partials/results.html': 'src/partials/results.html',
          'build/partials/success-prompt.html': 'src/partials/success-prompt.html'
        }
      }
    },
    connect: {
      server: {
        options: {
          port: 8000,
          protocol: 'http',
          directory: 'build',
          keepalive: true
        }
      }
    }
  });
}