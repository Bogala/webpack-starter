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

Pour se faire, passons en mode composants et ajoutons un système de gestion de routes adapté.

Tout d'abord, installons la gestion des routes par composants :
``` shell
npm install @angular/router@0.2.0 --save
``` 

Puis, revoyons un peu notre application AngularJS, à commencer par notre page d'index :
``` pug
doctype html
html
    head
        base(href="/")
        title Testons Webpack
    body(ng-cloak)
        app
``` 