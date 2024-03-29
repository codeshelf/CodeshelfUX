/* eslint-env node */

'use strict';

var bg = require('gulp-bg');
var eslint = require('gulp-eslint');
var gulp = require('gulp');
var harmonize = require('harmonize');
var makeWebpackConfig = require('./webpack/makeconfig');
var runSequence = require('run-sequence');
var webpackBuild = require('./webpack/build');
var webpackDevServer = require('./webpack/devserver');
var yargs = require('yargs');
var closureCompiler = require('gulp-closure-compiler');
var path = require('path');
var karma = require('karma');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var nightwatch = require('gulp-nightwatch');

var args = yargs
  .alias('p', 'production')
  .argv;

function runKarma(options, done) {
    var singleRun = options.singleRun;
    var server = new karma.Server({
        configFile: path.join(__dirname, 'karma.conf.js'), // eslint-disable-line no-undef
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
      //'gulpfile.js',
      'src/companion/pages/Mobile/**/*.js',
      //'webpack/*.js'
    ])
    .pipe(eslint({
        'parserOptions': {
            'ecmaVersion': 6,
            'sourceType': 'module',
            'ecmaFeatures': {
                'jsx': true,
                'impliedStrict': true,
                'experimentalObjectRestSpread': true
            }
        },
        'parser': 'babel-eslint',
        'env': {
            'jasmine': true,
            'mocha': true,
            'browser': true,
            'node': true,
            'es6': true
        },
        'plugins': [
            'react'   
        ],
        'rules': {
            'no-empty': 1,
            'no-debugger': 2,
            'no-alert': 1,
            'no-delete-var': 1,
            'no-undef': 2,
            'no-unused-vars': 1,
            'no-this-before-super': 2,
            'constructor-super': 2,
            'react/jsx-no-undef': 2,
            'react/jsx-uses-vars': 2,
            'no-dupe-keys': 1,
            'no-duplicate-case': 1,
            'no-sparse-arrays': 1,
            'no-unreachable': 1,
            'use-isnan': 1,
            'valid-typeof': 1,
            //'indent': [1, 2],
            //'quotes': [1, 'single', 'avoid-escape'],
            'curly': 1,
            'max-len': [1, 100, 4],
            'eol-last': 1,
            'no-trailing-spaces': 1
        }
    }))
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('karma-ci', function(done) {
    runKarma({singleRun: true}, done);
});

gulp.task('karma', function(done) {
    runKarma({singleRun: false}, done);
});

gulp.task('test', function(done) {
  // Run test tasks serially, because it doesn't make sense to build when tests
  // are not passing, and it doesn't make sense to run tests, if lint
  // has failed. Gulp deps aren't helpful, because we want to run tasks
  // without deps as well.
  runSequence('eslint', 'jest', 'build-webpack-production', done);
});

gulp.task('tdd', function (done) {
    // Run karma configured for TDD.
    runSequence('server', 'karma', done);
});

gulp.task('server', ['env', 'build'], bg('node', 'src/server'));

gulp.task('default', ['server']);


// var testDirs = ['test/selenium', 'test/pages'];
// var allTestJS = testDirs.map(function(path) {
//   return path + "**/*.js";
// });

// gulp.task("watch-tests", function() {
//   gulp.watch(allTestJS, ["build-tests", "build-pages"]);
// });


gulp.task('build-tests', function() {
  return gulp.src('test/selenium/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
      plugins: ["add-module-exports"]
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('target/test/selenium'));
});

gulp.task('build-pages', function() {
  return gulp.src('test/pages/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
      plugins: ["add-module-exports"]
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('target/test/pages'));
});

gulp.task('nightwatch', ['build-tests', 'build-pages'], function() {
  return gulp.src('')
    .pipe(nightwatch({
      configFile: 'nightwatch.json'
    }));
});
