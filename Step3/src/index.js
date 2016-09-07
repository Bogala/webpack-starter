// Load the Angular Material CSS associated with ngMaterial
// then load the main.css to provide overrides, etc.

import 'angular-material/angular-material.css'

// Load Angular libraries

import angular from 'angular'
// Animation
import angularAnimate from 'angular-animate';
// Materail Design lib
import angularMaterial from 'angular-material';
// Routing system
import '@angular/router/angular1/angular_1_router';
// Lazy load file system
import "oclazyload/dist/ocLazyLoad";

// App component controller
import AppController from './AppController';



/**
 * Manually bootstrap the application when AngularJS and
 * the application classes have been loaded.
 */
angular
    .element( document )
    .ready( function() {

        let body = document.getElementsByTagName("body")[0];
        let app = angular.module("starter-app", [angularAnimate, angularMaterial, "ngComponentRouter", 'oc.lazyLoad'])
            .config(function($locationProvider) {
                $locationProvider.html5Mode(true)
            })
            .value('$routerRootComponent', 'app')
            .component('app', {
                template: require("./app.pug"),
                controller: AppController
            });

        angular.bootstrap( body, [ app.name ], { strictDi: false });

    });