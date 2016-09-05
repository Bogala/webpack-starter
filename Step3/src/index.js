// Load the Angular Material CSS associated with ngMaterial
// then load the main.css to provide overrides, etc.

import 'angular-material/angular-material.css'

// Load Angular libraries

import angular from 'angular'
// Animation
import angularAnimate from 'angular-animate';
// Materail Design lib
import angularMaterial from 'angular-material';

import '@angular/router/angular1/angular_1_router';

import helloWorld from './helloWorld/HelloWorld';


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
            .module( appName, [ angularAnimate, angularMaterial, 'ngComponentRouter', helloWorld ] )
            .config(function($locationProvider) {
                $locationProvider.html5Mode(true)
            })
            .value('$routerRootComponent', 'app')
            .component('app', {
                template: require('./app.pug')
            });

        angular.bootstrap( body, [ app.name ], { strictDi: false })

    });

/*,
 $routeConfig: [
 {path: '/hello-world/...', name: 'HelloWorld', component: 'helloWorld', useAsDefault: true}
 ]*/