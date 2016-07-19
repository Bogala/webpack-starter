var path = require('path');
var HtmlWebpackPlugin = require("html-webpack-plugin");


module.exports = {
    entry: {
        app: './src/index.js'
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: '[name].bundle.js'
    },
    module: {
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
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.pug'
        })
    ]
};