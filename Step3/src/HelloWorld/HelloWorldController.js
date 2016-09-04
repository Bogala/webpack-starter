export default class HelloWorldController {
    constructor($scope) {
        this.nonScopedData = "My main application";
    }
};
HelloWorldController.$inject = ['$scope'];