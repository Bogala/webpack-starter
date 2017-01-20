[![license](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)]() 
[![codebeat badge](https://codebeat.co/badges/a8f2a4ff-ad5a-4304-95f7-b35469243510)](https://codebeat.co/projects/github-com-bogala-webpack-starter)
# Webpack
[![webpack](https://webpack.github.io/assets/logo.png)](https://webpack.github.io)

Au détour d'une réunion technique, j'entends parler de Webpack. 
Il est présenté comme un facilitateur, un outil permettant de nous sortir de nos 
taks-runners `gulp` ou `grunt`, qui peut rappeler, par moments, 
la grande époque du développement logiciel où beaucoup était fait à la main.

Projet déjà très populaire au sein de la communauté ReactJs, il apporte des fonctionnalités plutôt pratiques :
- disposer de toutes les `ressources statiques` (CSS, images, fontes) en tant que module,
- intégrer et consommer des `bibliothèques tierces` très simplement en tant que module,
- séparer votre build en plusieurs morceaux, `chargés à la demande`,
- adapté pour les `gros projets`. 

## Qu'est-ce que Webpack?
Comme son nom nous le laisse deviner, il permet de packager pour le web.

A l'origine, celui-ci n'était prévu que pour le javascript mais il existe une grande quantité le loaders, 
pulgins et autres personnalisations.

Aujourd'hui, un simple `require` ou `import`dans votre code permet d'intégrer le fichier dans votre lot web.
```javascript
//Importer un module npm
import angular from "angular";

//Importer du style
import "./style/my-style.css";

//Importer du html ou même dans un language de template
require("layout.pug");
```

![webpack module bundler](https://webpack.github.io/assets/what-is-webpack.png)

Comme vous pourrez le remarquer, il peut aussi bien s'occuper de vos modules JavaScript(AngularJS, CommonJS, etc.) que de vos modules CSS ou encore vos fichiers PNG, JSON, HTML...
Il peut aussi compiler vos fichiers TypeScript, Pug, mustache, sass, etc. avant de les intégrer.

De plus, il a été pensé pour permettre diviser votre package en plusieurs bundles pour jouer avec le lazy loading, notemment grâce au [Hot Module Replacement](http://webpack.github.io/docs/hot-module-replacement-with-webpack.html).

## Comment utiliser Webpack ?
Webpack est déjà très populaire mais majoritairement dans la communauté ReactJS.

Je vous proposerai donc, plutôt, un petit Tutoriel avec `AngularJS` en trois étapes :
- [__Etape 1__ : Les bases pour une première application](https://github.com/Bogala/webpack-starter/tree/master/Step1)
- [__Etape 2__ : La gestion des tests unitaires avec `Karma` pour `Webpack`](https://github.com/Bogala/webpack-starter/tree/master/Step2)
- [__Etape 3__ : Routing et Lazy Loading](https://github.com/Bogala/webpack-starter/tree/master/Step3)
