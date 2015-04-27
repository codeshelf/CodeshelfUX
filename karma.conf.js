// Karma configuration
// Generated on Tue Apr 21 2015 09:23:26 GMT-0700 (PDT)
var IS_TEST = true;
var IS_PRODUCTION = false;
var webpackConfig = require('./webpack/makeconfig')(IS_PRODUCTION, IS_TEST);

var karmaWebpackConfig = {
    module: webpackConfig.module,
    resolve: webpackConfig.resolve,
    plugins: webpackConfig.plugins,
    devtool: 'inline-source-map'

};

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'src/companion/**/__tests__/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        '**/__tests__/*.js': ['webpack', "sourcemap"]
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    webpack: karmaWebpackConfig,

    plugins : ["karma-jasmine", "karma-webpack", "karma-sourcemap-loader",  "karma-firefox-launcher", "karma-chrome-launcher"],


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [
        'Chrome'
        //'Firefox'
        //'Safari'
],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
