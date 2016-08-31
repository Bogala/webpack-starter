export default class HelloWorldController {
    constructor($scope) {
        $scope.scopedData = "Hello World !!!";
        this.nonScopedData = "The AngularJS ";

    }
};
HelloWorldController.$inject = ['$scope'];