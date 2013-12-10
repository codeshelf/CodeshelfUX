module.exports = function(config){
  config.set({
    basePath : '../',

    files : [
      //'app/lib/angular/angular.js',
      //'app/lib/angular/angular-*.js',
      'lib/GoogleClosureLibrary/closure/goog/base.js',
      'src/js_uncompiled/deps.js',
      'lib/AngularJS/angular.js',
      'lib/AngularJS/angular-*.js',
      'src/js_uncompiled/angular-test.js',
      'test/unit/**/*.js'
    ],

    exclude : [
      'lib/AngularJS/angular-loader.js',
      'lib/AngularJS/*.min.js',
      'lib/AngularJS/angular-scenario.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-junit-reporter',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-script-launcher',
            'karma-jasmine'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }
  });
};
