(function(){
    "use strict";

    angular.module("General").controller("AdwerdController", AdwerdController);

    AdwerdController.$inject = ['$scope','$routeParams']
    function AdwerdController ($scope, $routeParams) {
        console.log('ADWERD');
        console.log($routeParams);
    }
})();