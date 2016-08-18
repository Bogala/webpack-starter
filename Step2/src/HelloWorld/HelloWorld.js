import HelloWorldController from "./HelloWorldController";

let moduleName = angular
    .module( "helloWorld", [ ] )
    .controller("HelloWorldController" , HelloWorldController )
    .name;

export default moduleName;