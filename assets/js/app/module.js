(function(){
    "use strict";

    angular
        .module("General", [
            'ngRoute',
            'ngResource'
        ])
        .config(GeneralConfig)
        .directive('answerField', function () {
            var el = {
                scope: true, //чтобы не засорять родительский скоп
                templateUrl: '/templates/ad-small-block.html'
            }
            console.log(el);
            return el;
        });

    GeneralConfig.$inject = ['$routeProvider', '$locationProvider']; // при минификации минификатор не сможет изменить название переменной, если она в строке
    function GeneralConfig ($routeProvider, $locationProvider) {
        $locationProvider
            .html5Mode({
                enabled: true,
                requireBase: false
            });

        $routeProvider
            .when('/', {
                controller: 'IndexController',
                templateUrl: 'view/index.html'
            })
            .when('/list/:type', {
                controller: 'ListController',
                templateUrl: '/view/list/index.html'
            })
            .when('/adverd/wheel/:id', {
                controller: 'AdwerdController',
                templateUrl: 'view/index.html'
            })
            .when('/adverd/tyre/:id', {
                controller: 'AdwerdController',
                templateUrl: 'view/index.html'
            })
            .when('/adverd/space/:id', {
                controller: 'AdwerdController',
                templateUrl: 'view/index.html'
            })
            .when('/adverd/my/', {
                controller: 'AdwerdController',
                templateUrl: 'view/index.html'
            })
            .when('/user/settings', {
                controller: 'IndexController',
                templateUrl: '/view/index.html'
            })
            .when('/user/login', {
                controller: 'IndexController',
                templateUrl: 'view/index.html'
            })
            .when('/user/signup', {
                controller: 'IndexController',
                templateUrl: 'view/index.html'
            })
            .when('/adverd/new', {
                controller: 'AdwerdController',
                templateUrl: '/view/index.html'
            })
            .otherwise({
                redirectTo: '/'
            });
    }
})();