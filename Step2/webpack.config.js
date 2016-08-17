var webpack = require("webpack");
var path = require('path');
var HtmlWebpackPlugin = require("html-webpack-plugin");
var CleanWebpackPlugin = require('clean-webpack-plugin');

var ENV = process.env.npm_lifecycle_event;
var isProd = ENV === 'build';

module.exports = function makeWebpackConfig () {
    var config = {};
    var outputPath = path.join(__dirname, "dist");

    config.entry = {
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

    config.module = {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: ['babel?presets[]=es2015']
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

    return config;
}();