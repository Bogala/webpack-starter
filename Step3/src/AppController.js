export default class AppController {
    constructor($router, $ocLazyLoad) {
        console.log(this);
        $router.config([
            {
                path: '/',
                name: 'HelloWorld',
                loader: function() {
                    // lazy load the user module
                    return $ocLazyLoad.load('hello-world.bundle.js')
                        .then(function() {
                            // return the user component name
                            return 'helloWorld';
                        });
                }
            }
        ]);
    };
};
AppController.$inject = ['$router', '$ocLazyLoad'];