(function(){
    "use strict";

    angular.module("General").controller("ListController", ListController);

    ListController.$inject = ['$scope','$routeParams']
    function ListController ($scope, $routeParams) {
        console.log('LIST');
        console.log($routeParams);

        var spacesOption = {
            material: [{
                    key: 'aluminum',
                    value: 'aluminum'
                },{
                    key: 'steel',
                    value: 'steel'
                }
            ],
            width: [{
                    key: '10',
                    value: '10'
                },{
                    key: '15',
                    value: '15'
                }
            ],
            fp: [{
                    key: '3',
                    value: '3'
                },{
                    key: '4',
                    value: '4'
                },{
                    key: '5',
                    value: '5'
                },{
                    key: '6',
                    value: '6'
                }
            ], // Fixing points
            dia: [{
                    key: '98',
                    value: '98'
                },{
                    key: '100',
                    value: '100'
                },{
                    key: '108',
                    value: '108'
                },{
                    key: '110',
                    value: '110'
                },{
                    key: '112',
                    value: '112'
                },{
                    key: '120',
                    value: '120'
                }
            ]
        };
        $scope.optMaterial = spacesOption.material;
        $scope.optWidth = spacesOption.width;
        $scope.optFp = spacesOption.fp;
        $scope.optDia = spacesOption.dia;

    }
})();