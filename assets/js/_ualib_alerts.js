angular.module('ualib.alerts', [])
    .constant('ALERTS_URL', '//wwwdev2.lib.ua.edu/alerts/api/today')

    .factory('alertFactory', ['$http', 'ALERTS_URL', function newsFactory($http, url){
        return {
            getData: function(){
                return $http({method: 'GET', url: url, params: {}});
            }
        };
    }])
    .controller('alertsCtrl', ['$scope', 'alertFactory',
    function alertsCtrl($scope, alertFactory){
        $scope.list = {};

        alertFactory.getData()
            .success(function(data) {
                for (var i = 0; i < data.alerts.length; i++) {
                    switch (data.alerts[i].type) {
                        case 0:
                            data.alerts[i].typeStr = 'success';
                            break;
                        case 1:
                            data.alerts[i].typeStr = 'warning';
                            break;
                        case 2:
                            data.alerts[i].typeStr = 'danger';
                            break;
                        default:
                            data.alerts[i].typeStr = 'default';
                            break;
                    }
                }
                $scope.list = data;
            })
            .error(function(data, status, headers, config) {
                console.log(data);
            });

        $scope.closeAlert = function(index) {
            $scope.list.alerts.splice(index, 1);
        };
    }])
    .directive('ualibAlerts', [ function() {
        return {
            restrict: 'AC',
            scope: {},
            controller: 'alertsCtrl',
            link: function(scope, elm, attrs){
            },
            templateUrl: '../assets/js/_ualib-alerts.tpl.html'
        };
    }]);
