import HelloWorldController from "./HelloWorldController";

let moduleName = angular
    .module( "helloWorld", [ ] )
    .component("helloWorld", {
        template: require('./HelloWorld.pug'),
        controller: HelloWorldController
    })
    .name;

export default moduleName;