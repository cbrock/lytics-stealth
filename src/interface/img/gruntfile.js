module.exports = function(grunt) {
  require('jit-grunt')(grunt);

  grunt.initConfig({
    sass: {
        options: {
            sourceMap: true
        },
        dist: {
            files: {
                'css/main.css': 'sass/main.scss'
            }
        }
    },
    watch: {
      styles: {
        files: ['sass/**/*.scss', '*.html'], // which files to watch
        tasks: ['sass'],
        options: {
          nospawn: true,
          livereload: true
        }
      }
    }
  });

  grunt.registerTask('default', ['sass', 'watch']);
};