[![license](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)]()
# Ma première application web via Webpack

## Entrons dans le vif du sujet. 
Avant toute chose, il nous faut de quoi travailler :
 - Un IDE (VS Code, WebStorm ou encore Visual Studio)
 - NodeJS installé (6.2+)

Pour mettre un minimum de piquant sans pour autant aller trop loin : une page web via l'outil de templating [Pug](https://github.com/pugjs/pug) et un fichier Javascript qui lancemra une alerte.

Première chose à faire, se trouver un répertoire bien confortable sur son disque et y lancer l'initialisation du package.json :
```shell
$ npm init
``` 
Installons ensuite webpack :
 ```shell
$ npm install webpack --save-dev
``` 
Puisque le templating sera sous Pug, il nous faut de quoi l'interpréter puis le transformer en HTML 
 ```shell
$ npm install pug pug-html-loader --save-dev
``` 
Il est à savoir que la vocation première de webpack est de créer des bundles JS. Il nous faut donc donc un plugin pour générer notre fichier `index.html`.
 ```shell
$ npm install pug html-webpack-plugin --save-dev
``` 
##Nous voilà donc prêts pour le début des développements.
Créons, dans un répertoire `src`, un fichier `index.pug` avec le contenu suivant :
```jade
doctype html
html
    head
        title Testons Webpack
    body
        div
            span Hello World
```
Ajoutons-y un fichier index.js
```javascript
alert("It work !");
```
## Passons au vif du sujet
Nous allons maintenant configurer notre Webpack.
### Création du fichier bundle.js
Créons notre fichier de configuration Webpack (`webpack.config.js`)
```javascript
var path = require('path');
module.exports = {
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, "dist"),
        filename: 'bundle.js'
    }
};
```
En lançant la commande 
```shell
$ webpack
```

Vous devriez voir apparaître un nouveau répertoire `dist` contenant un fichier `bundle.js` comme suit :

``` javascript
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	"use strict";
	alert("It work !");

/***/ }
/******/ ]);
```
Vous pouveez remarquer quelques lignes préfixées de `/******/`.
En fait, Webpack encapsule le code des différents fichiers du bundle pour gérer au mieux les dépendances.

Aux vues du code d'origine, l'intérêt n'est pas flagrand mais nous aurons l'occasion d'y revenir.

## Création du fichier index.html
Attaqons maintenant notre `index.pug`. Souvenez-vous, Webpack n'est pas prévu, d'origine, à s'attaquer à des fichiers autres que `js` autrement que par dépendance.

Pour corriger ce manquement, il existe un plugin que nous avons déjà installé (`html-webpack-plugin`).

Il suffit donc maintenant de le déclarer et l'utiliser dans notre `webpack.conf.js`
```javascript
var HtmlWebpackPlugin = require("html-webpack-plugin");

[...]

    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.pug'
        })
    ]
```

Puisque nous utilisons un outil de templating (`pug`), nous devons aussi le déclarer

```javascript
    module: {
        loaders: [
            {
                test: /\.pug$/,
                loader: 'pug-html'
            }
        ]
    },
```

L'ensemble de ces lignes nous permettra de compiler notre `./src/index.pug` vers `./dist/index.html`

Si nous relançons la commande 
```shell
$ webpack
```

Nous obtenons un fichier index.html contenant le pug compilé plus une référence au bundle javascript généré précédemment.

## Création des tâches
Bon, lancer la commande `webpack` à chaque modification de code mais ça risque de fatiguer à la longue.

Je vous propose donc de se créer deux tâches NPM pour nous aider.

Dans votre `package.json`, modifions le noeud script comme suit :
```javascript
  "scripts": {
    "build": "webpack --bail --progress --profile",
    "dev": "webpack --bail --progress --profile --watch"
  },
```
Comme vous avez dû le comprendre, la tâche build fait exactement la même chose que ce que nous faisions précédemment.
La tâche dev, en revenche, y ajoute le mode `watch` qui scrute les fichiers sources et met à jour les bundles à chaque modification de code.

Une question devrait vous taroder : "Mais que sont ces arguments bail, progress et profile?"
 - `--profile` permet d'afficher le détail des actions effectuées par Webpack
 - `--progress` permet d'afficher la progression globale (en pourcentage)

D'autres options sont possible, vous aurez plus de détails sur cette [page](http://webpack.github.io/docs/cli.html).

Vous pouvez tester en lançant la task `dev` et en modifiant votre code javascript
```shell
$ npm run dev
```

## Plus loin... Un peu de javascript avec AngularJS?
Voilà, il est temps, maintenant, de passer la seconde et de créer une vraie application Javascript via [AngularJS](https://angularjs.org/) et [Angular Material](https://material.angularjs.org/).

Pour commencer, importons les packages npm nécessaires :

```shell
npm install angular angular-route angular-animate angular-aria angular-material --save
```
Il est à noter que angular-animate et angular-aria sont des pré-requis à angular-material. En effet, si vous oubliez
de les importer, l'installation d'angular-material vous le rappellera.

Nous pouvons donc maintenant modifier notre fichier index.js pour y créer notre application angularJS.

```javascript
import angular from 'angular'

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
            .module( appName, [] );

        angular.bootstrap( body, [ app.name ], { strictDi: false })

    });
```
Nous n'aurons pas besoin de modifier spécifiquement notre pug puisque notre code JavaScript le fait pour nous.

Bon, c'est bien joli tout ça mais il va aussi nous falloir de quoi faire du design. Et pour ça, rien de mieux qu'Angular Material.
Ajoutons donc ce qu'il nous faut pour charger le style et les directives Angular Material en remplaçant 

```javascript
import angular from 'angular'
```

par 

```javascript

import 'angular-material/angular-material.css!'


import angular from 'angular'
import material from 'angular-material'
```

puis ajoutons le module dans l'application AngularJS

```javascript
        let app  = angular
            .module( appName, [ material ] );
```

Mince, notre configuration actuelle de Webpack ne sait pas interpréter le CSS!
Installons les modules npm
 ```shell
 $ npm install css-loader style-loader --save-dev
 ```