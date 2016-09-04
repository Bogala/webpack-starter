/**
 * This file runs a webpack-dev-server, using the API.
 *
 * For more information on the options passed to WebpackDevServer,
 * see the webpack-dev-server API docs:
 * https://github.com/webpack/docs/wiki/webpack-dev-server#api
 */
var WebpackDevServer = require('webpack-dev-server');
var webpack = require('webpack');
var config = require('./webpack.config.js');

config.entry.app = ['webpack/hot/dev-server', 'webpack-dev-server/client?http://localhost:9100/', './src/index.js'];
config.plugins.push(new webpack.HotModuleReplacementPlugin());

var path = require('path');

var compiler = webpack(config);
var server = new WebpackDevServer(compiler, {
    contentBase: 'www',
    hot: true,
    filename: 'bundle.js',
    publicPath: '/',
    stats: {
        colors: true,
    },
});
server.listen(9100, 'localhost', function() {});