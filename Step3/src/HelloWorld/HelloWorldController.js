export default class HelloWorldController {
    constructor($scope) {
        this.nonScopedData = "The AngularJS Way...";
        $scope.scopedData = "Hello World !!!";
    }
};
HelloWorldController.$inject = ['$scope'];