[![license](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)]()
#Ma première application web via Webpack

##Entrons dans le vif du sujet. 
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
##Passons au vif du sujet
Nous allons maintenant configurer notre Webpack.
###Création du fichier bundle.js
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
