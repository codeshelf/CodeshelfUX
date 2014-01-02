module.exports = function(config){
  config.set({
    basePath : '../',

    //Add your new application code file here when you add a new test
    files : [
      'lib/GoogleClosureLibrary/closure/goog/base.js',
      'src/js_uncompiled/deps.js',
      'lib/AngularJS/angular.js',
      'lib/AngularJS/angular-*.js',
      'lib/UIBootstrap/ui-bootstrap-tpls-0.7.0.js',
        //TODO not sure why this had to be explicitly listed instead of being picked up by deps.js
      'src/js_uncompiled/websession.js',
      'src/js_uncompiled/codeshelf.controllers.js',
      //This line will automatically pick up your new file if it is in the test/unit/** directory
      'test/unit/**/*.js'
    ],

    //Shouldn't have to touch this unless you add a new library with different formats of the code like min versions
    exclude : [
      'lib/AngularJS/angular-loader.js',
      'lib/AngularJS/*.min.js',
      'lib/AngularJS/angular-scenario.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    //Uncomment to test in other browsers
    browsers : ['PhantomJS'/*,'Chrome'*/],

    plugins : [
        'karma-junit-reporter',
        'karma-script-launcher',
        'karma-jasmine',
        //These plugins must be included for each of the browser types that get run
        'karma-chrome-launcher',
        'karma-firefox-launcher',
        'karma-phantomjs-launcher'
    ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }
  });
};
