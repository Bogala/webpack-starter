import helloWorld from './HelloWorld';

describe('Controller: HelloWorld', function() {
    let $controller, $scope;

    beforeEach(angular.mock.module(helloWorld));

    beforeEach(angular.mock.inject(function(_$controller_, $rootScope) {
        $controller = _$controller_;
        $scope = $rootScope.$new();
    }));

    it('nonScopedData is initialized to "The AngularJS Way..."', function() {
        let ctrl = $controller('HelloWorldController', {'$scope' : $scope});
        expect(ctrl.nonScopedData).toBe("The AngularJS Way...");
    });

    it('scopedData is initialized to "Hello World !!!"', function() {
        let ctrl = $controller('HelloWorldController', {'$scope' : $scope});
        expect($scope.scopedData).toBe("Hello World !!!");
    });
});
