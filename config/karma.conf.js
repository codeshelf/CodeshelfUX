module.exports = function (config) {
	config.set({
		frameworks: ['jasmine', 'closure'],
		basePath : '../',

		//Add your new application code file here when you add a new test
		files : [

			// closure base
			{pattern: 'lib/GoogleClosureLibrary/closure/goog/base.js'},
			// external deps
			{pattern: 'lib/GoogleClosureLibrary/closure/goog/deps.js', included: false, served: false},
			'lib/AngularJS/angular.js',
			'lib/AngularJS/angular-*.js',
			'lib/UIBootstrap/ui-bootstrap-tpls-0.7.0.js',

			{pattern: 'src/js_uncompiled/codeshelf.controllers.js'},

			//watch files but do not include them; files using closure require mechanism will get
			// included during the preprocessor step
			{pattern: 'lib/GoogleClosureTemplates/*.js', included: false},

			{pattern: 'lib/JQuery/*.js', included: false},
			{pattern: 'lib/Bacon/bacon.js', included: false},
			{pattern: 'lib/Raphael/*.js', included: false},
			{pattern: 'lib/SlickGrid/**/*.js', included: false},



			{pattern: 'src/js_uncompiled/*.js', included: false},

			//This line will automatically pick up your new file if it is in the test/unit/** directory
			'test/unit/**/*.js'
		],

		//Shouldn't have to touch this unless you add a new library with different formats of the code like min versions
		exclude: [
			'lib/AngularJS/angular-loader.js',
			'lib/AngularJS/*.min.js',
			'lib/AngularJS/angular-scenario.js'
//TODO renable these tests
			,'test/unit/controllers.spec.js'
		],

		preprocessors: {
			'lib/JQuery/*.js': ['closure'],
			'lib/Bacon/bacon.js': ['closure'],
			'lib/Raphael/*.js': ['closure'],
			'lib/SlickGrid/**/*.js' : ['closure'],
			'lib/GoogleClosureTemplates/*.js' : ['closure'],

			'lib/GoogleClosureLibrary/closure/goog/deps.js': ['closure-deps'],
			'src/js_uncompiled/*.js': ['closure'],
			'test/unit/**/*.js': ['closure', 'closure-iit']

	   },


	   autoWatch: true,

	   //Uncomment to test in other browsers
	   browsers: [
		   'PhantomJS'
		   //'Chrome'
		   //'config/xvfb_chrome.sh'
                   //,'Firefox'
		   //,'Safari'
	   ],

	   plugins: [
		   'karma-closure',
		   'karma-junit-reporter',
                   'karma-teamcity-reporter',
		   'karma-script-launcher',
		   'karma-jasmine',
		   //These plugins must be included for each of the browser types that get run
		   'karma-chrome-launcher',
		   'karma-firefox-launcher',
		   'karma-phantomjs-launcher'
	   ],

	   junitReporter: {
		   outputFile: 'test_out/unit.xml',
		   suite: 'unit'
	   },

           // Continuous Integration mode
           singleRun: true
	});
};
