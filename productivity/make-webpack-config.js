var webpack = require('webpack');
var basePath = __dirname;

module.exports = function(options) {
    var entry = {
        app: ['./js/app.js'],
        components: ['./js/components-display.jsx']
    };
    if (options['development']) {
        //add hot deploy module under development
        for(var key in entry) {
            entry[key].unshift('webpack/hot/dev-server');
        }

    }

    return {
        // Entry point for static analyzer to include all required modules:
        entry: entry,

        output: {
            // Where to put build results when doing production builds:
            // (Server doesn't write to the disk, but this is required.)
            path: __dirname,

            // JS filename you're going to use in HTML
            filename: '[name].bundle.js'

            // Path you're going to use in HTML
            //publicPath: '/js/'
        },
        resolve: {
            // Allow to omit extensions when requiring these files
            extensions: ['', '.js', '.jsx'],
            //Look for files in these locations
            root: [basePath + '/js',
                   basePath]
        },
        module: {
            loaders: [
                // Pass *.jsx files through jsx-loader transform
                { test: /\.jsx$/, loader: 'jsx-loader?harmony' }
            ]
        },
        plugins: [
            new webpack.ResolverPlugin(
                new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"]))
        ],
        externals: {
            // e.g. Showdown is not is node_modules,
            // so we tell Webpack to resolve it to a global
            //'showdown': 'window.Showdown'
        },
        devtool : 'inline-source-map'
    };
};
