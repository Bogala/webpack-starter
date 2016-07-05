[![license](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)]()
# First steps to make an AngularJS application with Webpack

Here we create a first project 
[AngularJS](https://angularjs.org/) with 
[Angular Material](https://material.angularjs.org/latest/), 
[Pug](https://github.com/pugjs/pug) and 
[Webpack](https://webpack.github.io/)

## Needed NPM Packages
In first, we have to get our frameworks & tools.

Initiate NPM configuration and install webpack :
```shell
npm init
npm install --save-dev webpack
```

Webpack is a tool for javascript files bundleling. To make html index file, we have to install the HtmlWebpackPlugin.





## Usage

``` javascript
var template = require("jade!./file.jade");
// => returns file.jade content as template function
```

[Documentation: Using loaders](http://webpack.github.io/docs/using-loaders.html)

### Embedded resources

Try to use `require` for all your embedded resources, to process them with webpack.

``` jade
div
  img(src=require("./my/image.png"))
```

You need to configure loaders for these filetypes too. (Take a look at the [file-loader](https://github.com/webpack/file-loader).)
