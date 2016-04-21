/* @flow weak */

'use strict';

var ExtractTextPlugin = require('extract-text-webpack-plugin');
var NotifyPlugin = require('./notifyplugin');
var path = require('path');
var webpack = require('webpack');

var loaders = {
  'css': '',
  'less': '!less-loader',
  'scss|sass': '!sass-loader',
  'styl': '!stylus-loader'
};

module.exports = function(isDevelopment, isTest) {
  var isTest = (isTest) ? isTest : false;

  var mainFile = './src/companion/main.js';
  var outputDir = './target/web/build';

  function stylesLoaders() {
    return Object.keys(loaders).map(function(ext) {
      var prefix = 'css-loader!autoprefixer-loader?browsers=last 2 version';
      var extLoaders = prefix + loaders[ext];
      var loader = isDevelopment
        ? 'style-loader!' + extLoaders
        : ExtractTextPlugin.extract('style-loader', extLoaders);
      return {
        loader: loader,
        test: new RegExp('\\.(' + ext + ')$')
      };
    });
  }

  var config = {
    cache: isDevelopment,
    debug: isDevelopment,
    devtool: isDevelopment ? 'cheap-module-eval-source-map' : '',
    entry: {
      app: isDevelopment ? [
        'webpack-dev-server/client?http://localhost:8888',
        // Why only-dev-server instead of dev-server:
        // https://github.com/webpack/webpack/issues/418#issuecomment-54288041
        'webpack/hot/only-dev-server',
        mainFile
      ] : [
        mainFile
      ],
      // For Safari, IE<11, and some old browsers. More languages will need more
      // specific builds.
      appintl: isDevelopment ? [
        'webpack-dev-server/client?http://localhost:8888',
        // Why only-dev-server instead of dev-server:
        // https://github.com/webpack/webpack/issues/418#issuecomment-54288041
        'webpack/hot/only-dev-server',
        './node_modules/intl/Intl.js',
        './node_modules/intl/locale-data/jsonp/en.js',
        mainFile
      ] : [
        './node_modules/intl/Intl.js',
        './node_modules/intl/locale-data/jsonp/en.js',
        mainFile
      ]
    },
    module: {
        loaders: [
          { test: /orb.react.compiled/, loader: "expose?OrbReactClasses" },
          { test: /\.(woff|woff2)([\?]?.*)$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
          { test: /\.ttf([\?]?.*)$/,  loader: "url-loader?limit=10000&mimetype=application/octet-stream" },
          { test: /\.eot([\?]?.*)$/,  loader: "file-loader" },
          { test: /\.svg([\?]?.*)$/,  loader: "url-loader?limit=10000&mimetype=image/svg+xml" },
          { test: /\.(gif|jpg|png)$/, loader: 'url-loader?limit=100000' },
          {
              exclude: [/node_modules/, /web_modules/],
              loaders: isDevelopment ? [
                  'react-hot', 'babel-loader'
                  ] : [
                      'babel-loader'
                  ],
                  test: /\.js$/
          }].concat(stylesLoaders())
    },
    output: isDevelopment ? {
        path: path.join(__dirname, outputDir),
        filename: '[name].js',
        publicPath: 'http://localhost:8888/build/'
      } : {
          path: outputDir,
          filename: '[name].js'
    },
    plugins: (function() {
      var plugins = [
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: JSON.stringify(isDevelopment || isTest ? 'development' : 'production'),
            IS_BROWSER: true,
            USE_TEST: process.env.USE_TEST,
          }
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery",
            "window.React": "react",
            "React": "react"
        })
      ];
      if (isDevelopment)
        plugins.push(
//          NotifyPlugin,
          new webpack.HotModuleReplacementPlugin(),
          // Tell reloader to not reload if there is an error.
          new webpack.NoErrorsPlugin(),
          new webpack.optimize.UglifyJsPlugin({
            compress: {
              warnings: false
            }
          })
        );
      else
        plugins.push(
          // Render styles into separate cacheable file to prevent FOUC and
          // optimize for critical rendering path.
          new ExtractTextPlugin('app.css', {
            allChunks: true
          }),
          new webpack.optimize.DedupePlugin(),
          new webpack.optimize.OccurenceOrderPlugin(),
          new webpack.optimize.UglifyJsPlugin({
            compress: {
              warnings: false
            }
          })
        );
      return plugins;
    })(),
    resolve: {
        alias: {
            "react": path.resolve(process.cwd(), './node_modules/react'),
            "react/addons": path.resolve(process.cwd(), './node_modules/react'),

        },
        root: [ path.resolve(process.cwd(), './src/companion')],
        extensions: ['', '.js', '.json', '.react.js']
    }
  };

  return config;

};
