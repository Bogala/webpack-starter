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
            .component('app', {
                template: require('./app.pug')
            });
``` 

[SPOIL]Une autre nouvelle balise : "ng-outlet" correspondant aux composants routés (un peu comme un ng-view).