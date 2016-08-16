[![license](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)]()
# Etape 2 : les tests 

## Petite aparté. 
Voyons un peu l'état de notre configuration Webpack :
``` javascript
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
``` 

Tout ceci est pas mal pour un environnement de développement mais beaucoup moins pour un environnement de production.

Webpack nous offre la possibilité de gérer les différents environnments et il serait utile d'ajouter un peu de configuration destinée à la production.
