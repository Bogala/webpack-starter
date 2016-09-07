# Etape 3 : HMR, WebComponents & LazyLoad 

Ce document est la suite directe de deux étape du tutoriel. Si vous n'avez pas suivi les étapes précédentes, je vous conseille de partir d'un clone de la 'Step2'. 

## Hot Module Replacement (HMR)

Le HMR (pour 'Hot Module Replacement', aussi appelé 'hot module swapping') est, à mon sens, l'outil ultime des développeurs.

En effet, contrairement aux rumeurs, il n'est pas réservé à ReactJS, n'est pas si difficile d'accès et, surtout, ce n'est pas la même chose que le live reload !
Je vais eclaircir ce dernier point : le live reload rafraîchit la page lorsque le code est mis à jour, le HMR remplace le code en place et met à jour le site sans refresh.

Assez de blabla, passons à la pratique. Commençons sa mise en place.

### Première possibilité : CLI

Cette façon de faire est la plus courante et la plus facile à mettre en place. Elle consiste à utiliser directement le webpack-dev-server en ligne de commande avec ces deux paramètres supplémentaires :

``` shell
 --hot --inline
``` 

Ces paramètres ajoutent les bons plugins et configurent webpack pour activer le HMR (Plus de détails sur la [doc officielle](https://webpack.github.io/docs/webpack-dev-server.html#webpack-dev-server-cli))  

Ce qui donnerait, pour notre task 'devserver' :
``` javascript
    "devserver": "webpack-dev-server --port 9100 --progress --colors --hot --inline"
``` 

Pour tester, vous n'avez qu'à lancer la task devserver et changer la valeur des variables utilisées dans notre controller. Une fois le fichier modifié et enregistré, la mise à jour des bundles se lance et vous verrez votre pagge se mettre à jour toute seule.

### Deuxième possibilité : API

Dans certains cas (présence d'une task gulp/grunt, webpack lancé par script ou app sous express), l'utilisation du CLI n'est pas approprié. 
Nous devrons donc passer par l'API.

Pour se faire, c'est plutôt simple. Nous allons créer une application NodeJS qui mettra à disposition notre site web tout en gérant notre Webpack et HMR.
Créons un fichier server.js à coté de nos fichiers de configuration :
``` javascript
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
``` 

Dans ce fichier, nous récupérons Webpack et son dev-server puis, nous les lançons. Le résultat obtenu est identique au CLI (dans notre cas).
Attention, dans notre exemple, j'ai volontairement modifié la configuration de webpack dans le fichier server.js uniquement dans un but pédagogique. En effet, vous le pouvez utiliser le CLI si la référence au 'ebpack/hot/dev-server' et au HotModuleReplacementPlugin existent dans votre webpack.config.js.

## Components & Routes

Maintenant que le HMR est fin prêt, il nous faut revoir un peu l'organisation de notre code.

### Components
Pour se faire, passons en mode composants et ajoutons un système de gestion de routes adapté.


Revoyons un peu notre application AngularJS, à commencer par notre page d'index :
``` pug
doctype html
html
    head
        title Testons Webpack
    body(ng-cloak)
        app
``` 

Vous aurez remarqué une nouvelle balise "app". Celle-ci correspond à un nouveau composant angularJS.
Travaillons son template avant de le déclarer (app.pug) :
``` pug
md-toolbar(layout="row")
    .md-toolbar-tools
        h1 Webpack Starter
div(flex,layout="row")
    md-content(flex, id="content")
        hello-world
``` 


Ajoutons maintenant le composant en tant que tel dans l'index.js :
``` javascript
        let app  = angular
            .module( appName, [ angularAnimate, angularMaterial, helloWorld ] )
            .component('app', {
                template: require('./app.pug')
            });
``` 

Nous pouvons donc remarquer que l'application est ici directement utilisable.

Profitons-en pour transformer notre HelloWorldController en composant :
Commençons par le déclarer via HelloWorld.js
``` javascript
import HelloWorldController from "./HelloWorldController";

let moduleName = angular
    .module( "helloWorld", [ ] )
    .component("helloWorld", {
        template: require('./HelloWorld.pug'),
        controller: HelloWorldController
    })
    .name;

export default moduleName;
``` 

Nous avons retiré la déclaration .controller(...) pour le remplacer par un component.
Puisque nous avons ajouté un 'require' sur un nouveau fichier pug, créons-le :
``` pug
span {{$ctrl.nonScopedData}}
``` 

Le contenu est simple mais nous permettra de voir si ça fonctionne : Lancez le devserver, allez sur l'URL http://localhost:9100/, changez la valeur de 'nonScopedData' dans le code puis admirez.
La page change d'elle-même sans se recharger (rien de tel pour briller en société !)

Qu'en est-il des résultats de tests unitaire? Evidemment, nos deux tests sont en erreur puisque le controller n'existe plus.
Pour corriger, il suffit juste de revoir les injections dans le beforeEach :
``` javbascript
    beforeEach(angular.mock.inject(function($rootScope, $componentController) {
        $scope = $rootScope.$new();
        $controller = $componentController;
    }));
``` 
Nous attaquons ainsi directement le controller du component, ce qui permet de garder tous nos tests intacts.

### ngComponentRoute
Pour jouer avec les routes, nous avons l'embaras du choix : ngRoute, ui-route ou ngComponentRouter.
Il y a déjà beaucoup de tutoriels sur ngRoute ou ui-route. Utilisons quelque chose de moins commun : ngComponentRouter.
De plus, son utilisation nous donnera un aperçu de qui existera sur Angular2.

Commençons par l'installer :
``` shell
npm install @angular/router@0.1.0 --save
``` 


Ensuite, un peu de préparation s'impose sur l'index.js.
Importons notre nouveau module
``` javascript
import '@angular/router/angular1/angular_1_router';
``` 

Activons le mode html5 et définissons notre composant web principal pour la gestion des routes
``` javascript
        let app  = angular
            .module( appName, [ angularAnimate, angularMaterial, 'ngComponentRouter', helloWorld ] )
            .config(function($locationProvider) {
                $locationProvider.html5Mode(true)
            })
            .value('$routerRootComponent', 'app')
``` 

Ajoutons nos routes : 
``` javascript
            .component('app', {
                template: require('./app.pug'),
                $routeConfig: [
                    {path: '/hello-world', name: 'HelloWorld', component: 'helloWorld', useAsDefault: true}
                ]
            });
```

Il ne nous reste plus qu'à dynamiser notre composant 'app' via son template en remplaçant la balise hello-world par ng-outlet :
``` pug
md-toolbar(layout="row")
    .md-toolbar-tools
        h1 Webpack Starter
div(flex,layout="row")
    md-content(flex, id="content")
        ng-outlet
``` 
"ng-outlet" correspond aux composants routés (un peu comme un ng-view).

## Lazy loading
Il ne nous reste qu'à charger dynamiquement nos modules selon le besoin.
Pour se faire, il faut d'abord revoir légèrement notre configuration webpack en ajoutant un bundle pour HelloWorld
``` javascript
    config.entry = isTest ? {} : {
            app: './src/index.js',
            'hello-world': './src/HelloWorld/HelloWorld.js'
        };
``` 

et vérifier, dans le HtmlWebpackPlugin, que nous ne chargeons QUE le bundle principal :
``` javascript
        new HtmlWebpackPlugin({
            inject: "head",
            filename: 'index.html',
            template: './src/index.pug',
            chunks: ['app']
        })
``` 

Maintenant que le module helloWorld est dans un autre bundle, il faut retirer l'import puis sa référence dans le module principal (index.js)
``` javascript
import 'angular-material/angular-material.css'

// Load Angular libraries

import angular from 'angular'
// Animation
import angularAnimate from 'angular-animate';
// Materail Design lib
import angularMaterial from 'angular-material';

import '@angular/router/angular1/angular_1_router';


/**
 * Manually bootstrap the application when AngularJS and
 * the application classes have been loaded.
 */
angular
    .element( document )
    .ready( function() {

        let appName = 'starter-app';

        let body = document.getElementsByTagName("body")[0];
        let app  = angular
            .module( appName, [ angularAnimate, angularMaterial, 'ngComponentRouter' ] )
            .config(function($locationProvider) {
                $locationProvider.html5Mode(true)
            })
            .value('$routerRootComponent', 'app')
            .component('app', {
                template: require('./app.pug'),
                $routeConfig: [
                    {path: '/hello-world', name: 'HelloWorld', component: 'helloWorld', useAsDefault: true}
                ]
            });

        angular.bootstrap( body, [ app.name ], { strictDi: false })

    });
``` 

Le souci, c'est que cette action a totalement supprimé helloWorld. Il nous faut donc charger se composant depuis le $routeConfig.
Mais ce n'est pas si facile car il nous faut un nouveau module à charger (ocLazyLoad) et un service angular à référencer.

Commençons par installer ocLazyLoad :
``` shell
npm install --save oclazyload
``` 

Créons un Controller pour notre composant 'app' dans un fichier AppController.js:
``` javascript
export default class AppController {
    constructor($router, $ocLazyLoad) {
        $router.config([
            {
                path: '/',
                name: 'HelloWorld',
                loader: function() {
                    // lazy load the user module
                    return $ocLazyLoad.load('hello-world.bundle.js')
                        .then(function() {
                            // return the helloWorld component name
                            return 'helloWorld';
                        });
                }
            }
        ]);
    }
};
AppController.$inject = ['$router', '$ocLazyLoad'];
``` 
Ici, le controller servira à remplacer le $routeConfig et pour lui permettre d'utiliser l'ocLazyLoad.

Revenons sur l'index.js pour y ajouter la référence ocLazyLoad ainsi qu'à notre nouveau controller
``` javascript
// Lazy load file system
import "oclazyload/dist/ocLazyLoad";

// App component controller
import AppController from './AppController';
``` 

et remplacer le $routeConfig du component 'app' par son nouveau controller
Revenons sur l'index.js pour y ajouter la référence ocLazyLoad
``` javascript
            .component('app', {
                template: require("./app.pug"),
                controller: AppController
            });
``` 

Et voilà, il vous reste plus qu'à tester le résultat et y ajouter quelques fonctionnalités de votre cru !

C'était donc la dernière partie de ce tutoriel. Sachez, néanmoins, qu'il ne s'agit là que d'une partie des fonctionnalités de Webpack.
Pour en savoir plus, je vous conseille leur [documentation](http://webpack.github.io/docs/) qui n'est pas parfaite mais qui s'améliore de jour en jour.

Il existe aussi des outils d'analyse des bondles :
* [L'analyseur officiel Webpack](http://webpack.github.io/analyse/) qui vous donnera des recommendations ainsi que de bonne idées pour mieux gérer vos dépendances
* [Webpack Visualizer](https://chrisbateman.github.io/webpack-visualizer/) qui, lui, vous offrira un graphique sur la composition de vos bundles

A noter aussi qu'une v2 de webpack est en cours. En apportera, la gestion de l'ES2015 en natif, le mode promise, des loaders plus complets et bien d'autres choses...