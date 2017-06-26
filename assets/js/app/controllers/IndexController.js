(function(){
    "use strict";

    angular.module("General").controller("IndexController", IndexController);

    IndexController.$inject = ['$scope','$routeParams']
    function IndexController ($scope, $routeParams) {
        console.log('INDEX');
        console.log($routeParams);
    }
})();