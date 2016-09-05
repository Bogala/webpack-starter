export default class HelloWorldController {
    constructor($scope) {
        this.nonScopedData = "Sample description";
        $scope.scopedData = ""
    }
};
HelloWorldController.$inject = ['$scope'];