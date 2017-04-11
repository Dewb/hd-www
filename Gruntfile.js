module.exports = function(grunt) {

  var path = require('path');
  var webpackConfig = require('./webpack.config.js');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    webpack: {
      options: webpackConfig,
      build: {},
    },

    'webpack-dev-server': {
      options: {
        webpack: webpackConfig,
        contentBase: path.resolve(__dirname, 'client'),
        publicPath: '/dist',
        port: 8000
      },
      start: {
        webpack: {
          devtool: 'source-map'
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-webpack');

  grunt.registerTask('default', ['webpack:build']);
  grunt.registerTask('dev', ['webpack-dev-server:start']);

};