// Karma configuration
// Generated on Sun Dec 14 2014 21:46:32 GMT-0800 (PST)

module.exports = function(config) {

  var basePath = __dirname;
  var webpack = require("webpack");

  config.set({
    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,


    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: basePath,

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
		'__tests__/index-test.js'
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
		'__tests__/index-test.js': ['webpack']
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

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [
		'Chrome'
	//	,PhantomJS'
	],

	plugins: [
		require("karma-jasmine"),
		require("karma-webpack"),
		require("karma-chrome-launcher")
	],

	webpack: {
		// karma watches the test entry points
        // (you don't need to specify the entry option typical for webpack)
        // webpack watches other dependencies and regenerates the root test entry file causing karma to then reload

		// webpack configuration
		watch: true,
		resolve: {
			// Allow to omit extensions when requiring these files
			extensions: ['', '.js', '.jsx'],
			//Look for files in these locations
			root: [basePath + '/js/components',
				  basePath + '/js/helpers',
				  basePath]
		},
		module: {
			loaders: [
				// Pass *.jsx files through jsx-loader transform
				{ test: /\.jsx$/, loader: 'jsx' }
			]
		},
		plugins: [
			new webpack.ResolverPlugin(
				new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"]))
		]
	},

	webpackServer: {
            // webpack-dev-server configuration
            // webpack-dev-middleware configuration
            // i. e.
		noInfo: true //quieter karma output
		/* or stats: {
			colors: true
		}*/
    }
  });
};
