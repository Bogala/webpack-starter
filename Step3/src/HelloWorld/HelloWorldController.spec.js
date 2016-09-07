import helloWorld from './HelloWorld';

describe('Controller: HelloWorld', function() {
    let $controller, $scope;

    beforeEach(angular.mock.module(helloWorld));

    beforeEach(angular.mock.inject(function($rootScope, $componentController) {
        $scope = $rootScope.$new();
        $controller = $componentController;
    }));

    it('nonScopedData is initialized to "The AngularJS Way..."', function() {
        let ctrl = $controller('helloWorld', {'$scope' : $scope});
        expect(ctrl.nonScopedData).toBe("The AngularJS Way...");
    });

    it('scopedData is initialized to "Hello World !!!"', function() {
        let ctrl = $controller('helloWorld', {'$scope' : $scope});
        expect($scope.scopedData).toBe("Hello World !!!");
    });
});
