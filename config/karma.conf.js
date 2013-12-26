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
      'lib/UIBootstrap/ui-bootstrap-tpls-0.7.0.js',
      //'src/js_uncompiled/application.js',
      'src/js_uncompiled/websession.js',
      'src/js_uncompiled/codeshelf.controllers.js',
      'test/unit/**/*.js'
    ],

    exclude : [
      'lib/AngularJS/angular-loader.js',
      'lib/AngularJS/*.min.js',
      'lib/AngularJS/angular-scenario.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    //browsers : ['Chrome'],
    browsers : ['PhantomJS'],

    plugins : [
            'karma-junit-reporter',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-phantomjs-launcher',
            'karma-script-launcher',
            'karma-jasmine'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }
  });
};
