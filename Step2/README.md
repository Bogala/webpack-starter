[![license](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)]()
# Etape 2 : les tests 

## Petit aparté. 
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
commençons par installer les modules npm pour karma et jasmine :
``` shell
npm install --save-dev angular-mocks jasmine-core phantomjs-prebuilt karma karma-coverage karma-jasmine karma-junit-reporter karma-phantomjs-launcher karma-sourcemap-loader karma-spec-reporter karma-verbose-reporter
``` 

Puis ajoutons le connecteur karma - webpack
``` shell
npm install --save-dev karma-webpack
``` 

Pour ne pas avoir à ajouter chaque fichier de test dans la configuration Karma, je vous propose d'ajouter un fichier 'tests.webpack.js' dans le répertoire 'src' :
``` javascript
import "angular";
import "angular-mocks/angular-mocks";

const testsContext = require.context(".", true, /.spec$/);
testsContext.keys().forEach(testsContext);
``` 

Ce petit bout de code permet de référencer directement angular et angular-mocks mais aussi d'importer automatiquement chaque fichier '*.spec.js'.

Ceci permet de simplifier mais aussi de ne pas avoir à relancer karma lors d'ajout de fichiers.

Passons maintenant à la configuration Karma (karma.conf.js) :
``` javascript
// Reference: http://karma-runner.github.io/0.12/config/configuration-file.html
module.exports = function karmaConfig (config) {
    config.set({
        frameworks: [
            // Reference: https://github.com/karma-runner/karma-jasmine
            // Set framework to jasmine
            'jasmine'
        ],

        reporters: [
            // Reference: https://github.com/mlex/karma-spec-reporter
            // Set reporter to print detailed results to console
            'progress',

            // Reference: https://github.com/karma-runner/karma-coverage
            // Output code coverage files
            'coverage'
        ],

        files: [
            // Grab all files in the app folder that contain .spec.
            'src/tests.webpack.js'
        ],

        preprocessors: {
            // Reference: http://webpack.github.io/docs/testing.html
            // Reference: https://github.com/webpack/karma-webpack
            // Convert files with webpack and load sourcemaps
            'src/tests.webpack.js': ['webpack', 'sourcemap']
        },

        browsers: [
            // Run tests using PhantomJS
            'PhantomJS'
        ],

        singleRun: true,

        // Configure code coverage reporter
        coverageReporter: {
            dir: 'coverage/',
            reporters: [
                {type: 'text-summary'},
                {type: 'html'}
            ]
        },

        webpack: require('./webpack.config'),

        // Hide webpack build information from output
        webpackMiddleware: {
            noInfo: 'errors-only'
        }
    });
};

``` 

Ajoutons les scripts npm pour lancer karma :
``` json
  "scripts": {
    "test": "karma start karma.conf.js",
    "test-watch": "karma start karma.conf.js --auto-watch --no-single-run",
    "build": "webpack --bail --progress --profile -p",
    "dev": "webpack --bail --progress --profile -d --watch",
    "devserver": "webpack-dev-server --port 9100 --progress --colors"
  },
``` 

Tel quel, vous devriez pouvoir faire tourner Karma  mais je conseille d'aporter quelques modifications spécifiques aux tests dans la configuration Webpack.

Déjà, il faut savoir si le process en cours correspond au test :
``` javascript
var ENV = process.env.npm_lifecycle_event;
var isTest = ENV === 'test' || ENV === 'test-watch';
var isProd = ENV === 'build';
``` 

Avec karma, pas besoin de point d'entrée
``` javascript
config.entry = isTest ? {} : {
        app: './src/index.js'
    };
``` 

Ensuite, pour faciliter les corrections, utilisons un inline-source-map :
``` javascript
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
``` 

Pour finir cette phase de préparation, ajoutons un instrumenter pour le code coverage via webpack et babel.
``` shell
npm install --save-dev karma-babel-preprocessor babel-plugin-istanbul
``` 

``` javascript
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
``` 

Cette dernière petite modif permet aussi de décentraliser la configuration babel.

Nous voilà donc prêts pour écrire notre premier test unitaire !

## Premiers tests

Bon, nous avons donc une application fonctionnelle et testable. Il ne nous reste qu'à tester notre Controller HelloWorld.

Créons un fichier 'HelloWorldController.spec.js' à coté du fichier qu'il testera, à savoir 'HelloWorldController.js'
``` javascript
import helloWorld from './HelloWorld';

describe('Controller: HelloWorld', function() {
});
``` 

Ainsi, nous avons un fichier de tests basé sur un module angular (le module HelloWorld créé dans HelloWorld.js et injecté depuis notre main.js).

Initions maintenant le module via :
``` javascript
beforeEach(angular.mock.module(helloWorld));
```

Ceci nous déclare le module spécifiquement pour tests, permettant ainsi d'utiliser les fonctions d'injection d'angular mocks.

De quoi avons nous besoin tester notre controller? D'une méthode d'exécution du controller ainsi que de sa dépendance. Souvenez-vous,
nous utilisons '$scope' dans notre controller.

``` javascript
let $controller, $scope;

beforeEach(angular.mock.inject(function(_$controller_, $rootScope) {
    $controller = _$controller_;
    $scope = $rootScope.$new();
}));
``` 
Vous aurez remarqué que nous n'injectons pas le $scope directement, nous en créons un depuis le $rootScope. Ceci est logique puisqu'il ne sagit pas d'une vraie application angular (pas d'exécution de template).

Pour tester et exécuter notre controller, il suffit donc d'utiliser la méthode $controller en injectant notre scope créé avant chaque test:
``` javascript
let ctrl = $controller('HelloWorldController', {'$scope' : $scope});
``` 

Nous y sommes ! Il ne reste qu'à tester les deux propriétés de notre controller.
Ce qui nous donne au final :

``` javascript
import helloWorld from './HelloWorld';

describe('Controller: HelloWorld', function() {
    let $controller, $scope;

    beforeEach(angular.mock.module(helloWorld));

    beforeEach(angular.mock.inject(function(_$controller_, $rootScope) {
        $controller = _$controller_;
        $scope = $rootScope.$new();
    }));

    it('nonScopedData is initialized to "The AngularJS Way..."', function() {
        let ctrl = $controller('HelloWorldController', {'$scope' : $scope});
        expect(ctrl.nonScopedData).toBe("The AngularJS Way...");
    });

    it('scopedData is initialized to "Hello World !!!"', function() {
        let ctrl = $controller('HelloWorldController', {'$scope' : $scope});
        expect($scope.scopedData).toBe("Hello World !!!");
    });
});

``` 
