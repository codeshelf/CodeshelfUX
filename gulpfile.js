/* eslint-env node */

'use strict';

var bg = require('gulp-bg');
var eslint = require('gulp-eslint');
var gulp = require('gulp');
var harmonize = require('harmonize');
var jest = require('jest-cli');
var makeWebpackConfig = require('./webpack/makeconfig');
var runSequence = require('run-sequence');
var webpackBuild = require('./webpack/build');
var webpackDevServer = require('./webpack/devserver');
var yargs = require('yargs');
var closureCompiler = require('gulp-closure-compiler');
var path = require('path');
var karma = require('karma');
// Enables node's --harmony flag programmatically for jest.
harmonize();

var args = yargs
  .alias('p', 'production')
  .argv;

function runKarma(options, done) {
    var singleRun = options.singleRun;
    var server = new karma.Server({
        configFile: path.join(__dirname, 'karma-companion.conf.js'), // eslint-disable-line no-undef
        singleRun: singleRun
    }, function() {
        done();
    });
    server.start();
};

gulp.task('env', function() {
  process.env.NODE_ENV = args.production ? 'production' : 'development';
  process.env.NODE_PATH = process.cwd() + '/src/companion';
  console.log("Node path changed to: ", process.env.NODE_PATH);
});

gulp.task('build-webpack-production', function(done) {
    var outputDir = 'target/web';
    gulp.src(['src/companion/index.html']).pipe(gulp.dest(outputDir));
    webpackBuild(makeWebpackConfig(false))(done);

});
gulp.task('build-webpack-dev', webpackDevServer(makeWebpackConfig(true)));
gulp.task('build-webpack', [args.production ? 'build-webpack-production' : 'build-webpack-dev']);
gulp.task('build', ['build-webpack']);

gulp.task('eslint', function() {
  return gulp.src([
      'gulpfile.js',
      'src/companion/**/*.js',
      'webpack/*.js'
    ])
    .pipe(eslint())
    .pipe(eslint.format());
    //.pipe(eslint.failOnError());
});

gulp.task('karma-ci', function(done) {
    runKarma({singleRun: true}, done);
});

gulp.task('karma', function(done) {
    runKarma({singleRun: false}, done);
});

gulp.task('jest', function(done) {
  var rootDir = './src/companion';
  jest.runCLI({config: {
    'rootDir': rootDir,
    'scriptPreprocessor': '../../node_modules/babel-jest',
    'testFileExtensions': ['es6', 'js'],
    'moduleFileExtensions': ['js', 'json', 'es6'],
    "unmockedModulePathPatterns": ["react"]
  }}, rootDir, function(success) {
    /* eslint no-process-exit:0 */
    done(success ? null : 'jest failed');
    process.on('exit', function() {
      process.exit(success ? 0 : 1);
    });
  });
});

gulp.task('test', function(done) {
  // Run test tasks serially, because it doesn't make sense to build when tests
  // are not passing, and it doesn't make sense to run tests, if lint has failed.
  // Gulp deps aren't helpful, because we want to run tasks without deps as well.
  runSequence('eslint', 'jest', 'build-webpack-production', done);
});

gulp.task('tdd', function (done) {
    // Run karma configured for TDD.
    runSequence('server', 'karma', done);
});


gulp.task('server', ['env', 'build'], bg('node', 'src/server'));

gulp.task('default', ['server']);

gulp.task('closure', function() {
    return gulp.src([
        'bower_components/closure-library/closure/**/*.js',
        'src/lib/closure/src/**/*.js'
    ])
        .pipe(closureCompiler({
            compilerPath: 'bower_components/compiler-latest/compiler.jar',
            fileName: 'index.js',
            continueWithWarnings: true,
            compilerFlags: {
                language_in: 'ECMASCRIPT6',
                language_out: 'ES5',
                closure_entry_point: 'index',
                compilation_level: 'ADVANCED_OPTIMIZATIONS',
                define: [
                    'goog.DEBUG=false',
                    'goog.dom.animationFrame.polyfill.ENABLED=false'
                ],
                externs: ['src/lib/closure/externs.js'],
                only_closure_dependencies: true,
                output_wrapper: '(function(){%output%})();',
                warning_level: 'VERBOSE'
            }
        }))
        .pipe(gulp.dest('src/lib/closure'));
});
