angular.module('ualib.imageCarousel', ['angular-carousel'])
    .constant('VIEW_IMAGES_URL', '//wwwdev2.lib.ua.edu/digitalSigns/api/all')

    .factory('imageCarouselFactory', ['$http', 'VIEW_IMAGES_URL', function imageCarouselFactory($http, url){
        return {
            getData: function(){
                return $http({method: 'GET', url: url, params: {}});
            }
        };
    }])
    .controller('imageCarouselCtrl', ['$scope', 'imageCarouselFactory',
        function imageCarouselCtrl($scope, imageCarouselFactory){
            $scope.images = [];

            imageCarouselFactory.getData()
                .success(function(data) {
                    $scope.images = data.images;
                })
                .error(function(data, status, headers, config) {
                    console.log(data);
                });

        }])
    .directive('ualibImageCarousel', [ function() {
        return {
            restrict: 'AC',
            scope: {},
            controller: 'imageCarouselCtrl',
            link: function(scope, elm, attrs){
            },
            templateUrl: '../assets/js/_ualib-image-carousel.tpl.html'
        };
    }]);
