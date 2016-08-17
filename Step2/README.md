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

Normalement, si tout s'est bien passé, nous devrions avoir ces tâches dans notre configuration npm :
```json
  "scripts": {
    "build": "webpack --bail --progress --profile -p",
    "dev": "webpack --bail --progress --profile -d --watch",
    "devserver": "webpack-dev-server --port 9100 --progress --colors"
  },
``` 

Tout d'abord, dans notre configuration webpack, récupérons le nom de la task lancée :
``` javascript
var ENV = process.env.npm_lifecycle_event;
``` 

Nous savons donc la tache npm "build" correspond à notre production. Expliquons le à notre webpack :
``` javascript
var isProd = (ENV === 'build');
``` 

Maintenant, il va falloir rendre notre configuration un peu plus dynamique. Le JSON n'est donc plus d'actualité. 
Changeons le en méthode, ce qui nous donne ceci :
``` javascript
var path = require('path');
var HtmlWebpackPlugin = require("html-webpack-plugin");

var ENV = process.env.npm_lifecycle_event;
var isProd = ENV === 'build';

module.exports = function makeWebpackConfig () {
    var config = {};
    config.entry = {
            app: './src/index.js'
        };

    config.output = {
        path: path.join(__dirname, "dist"),
            filename: '[name].bundle.js'
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
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.pug'
        })
    ];

    return config;
}();
``` 

Pour l'instant, rien de spécifique à un environnement de production, corrigeons donc ça avec la première chose à faire : minifier (juste avant le return).
``` javascript
if (isProd) {
    config.plugins.push(
        // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
        // Minify all javascript, switch loaders to minimizing mode
        new webpack.optimize.UglifyJsPlugin()
    )
}
```  


Ajoutons aussi une petite fonctionnalité bien pratique : le changement de nom de fichier à chaque build.
Cela permet d'éviter d'éventuels soucis de cache. Remplaçons donc le bloc 'output'

``` javascript
config.output = {
    path: path.join(__dirname, "dist"),
    
    // Filename for entry points
    // Only adds hash in build mode
    filename: isProd ? '[name].[hash].js' : '[name].bundle.js',

    // Filename for non-entry points
    // Only adds hash in build mode
    chunkFilename: isProd ? '[name].[hash].js' : '[name].bundle.js'
};
``` 

Dans le cadre de la build, webpack génèrera un bundle du type 'app.66867a6d2f12b5c521f0.js' où la partie hash changera à chaque build.

Par contre, un problème se pose : que se passe-t-il quand nous enchainons les builds?
Effectivement, nous aurions plusieurs 'app.*.js'...

Il nous faut donc cleaner le répertoire de destination avant de générer notre site.
Utilisons donc le plugin 'CleanWebpackPlugin'

``` shell
npm install --save-dev clean-webpack-plugin
``` 

``` javascript
var CleanWebpackPlugin = require('clean-webpack-plugin');
``` 

``` javascript
config.plugins =  [
    new CleanWebpackPlugin([path.join(__dirname, "dist")], {
        verbose: true,
        dry: false
    }),
    new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './src/index.pug'
    })
];
```

Profitons-en aussi pour inclure nos source-map selon l'environnement.
``` javascript
if (isProd) {
    config.devtool = 'source-map';
} else {
    config.devtool = 'eval-source-map';
}
```  
Ceci aidera grandement en cas de bug et termine notre aparté. 

Nous pouvons donc (enfin?) passer au vif du sujet : Configurer Karma pour nos tests unitaires !

## Configuration de Karma avec Webpack

## Premiers tests
