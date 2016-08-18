var webpack = require("webpack");
var path = require('path');
var HtmlWebpackPlugin = require("html-webpack-plugin");
var CleanWebpackPlugin = require('clean-webpack-plugin');

var ENV = process.env.npm_lifecycle_event;
var isTest = ENV === 'test' || ENV === 'test-watch';
var isProd = ENV === 'build';

module.exports = function makeWebpackConfig () {
    var config = {};
    var outputPath = path.join(__dirname, "dist");

    config.entry = isTest ? {} : {
            app: './src/index.js'
        };

    config.output = {
        path: outputPath,

        // Filename for entry points
        // Only adds hash in build mode
        filename: isProd ? '[name].[hash].js' : '[name].bundle.js',

        // Filename for non-entry points
        // Only adds hash in build mode
        chunkFilename: isProd ? '[name].[hash].js' : '[name].bundle.js'
    };

    /**
     * Devtool
     * Reference: http://webpack.github.io/docs/configuration.html#devtool
     * Type of sourcemap to use per build type
     */
    if (isTest) {
        config.devtool = 'inline-source-map';
    } else if (isProd) {
        config.devtool = 'source-map';
    } else {
        config.devtool = 'eval-source-map';
    }

    config.babel = {
        presets: ['es2015']
    };

    if (isTest)
        config.babel.plugins = [
            ["istanbul", {
                "exclude": [
                    "**/*.spec.js"
                ]
            }]
        ];

    config.module = {
        preLoaders:[],
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel"
            },
            {
                test: /\.css$/,
                loader: "style!css"
            },
            {
                test: /\.pug$/,
                loader: 'pug-html'
            }
        ]
    };

    config.plugins =  [
        new CleanWebpackPlugin([outputPath], {
            verbose: true,
            dry: false
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.pug'
        })
    ];

    // Add build specific plugins
    if (isProd) {
        config.plugins.push(
            // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
            // Minify all javascript, switch loaders to minimizing mode
            new webpack.optimize.UglifyJsPlugin()
        )
    }

    return config;
}();