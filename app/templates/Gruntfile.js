module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    compass: {
      dist: {
        options: {
          sassDir: 'css/sass',
          cssDir: 'css',
          imagesDir: 'images',
          javascriptsDir: 'js',
          fontsDir: 'fonts',
          outputStyle: 'compact',
          relativeAssets: true,
          noLineComments: true
        }
      }
    },
    watch: {
      options: {
        livereload: true
      },
      compass: {
        files: ['css/sass/*.scss'],
        tasks: ['compass']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['compass', 'watch']);
};