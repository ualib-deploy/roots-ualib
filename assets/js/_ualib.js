angular.module('ualib', [
    'ngRoute',
    'ualib.templates',
    'ualib.ui',
    'hours',
    'oneSearch',
    'manage',
    'ualib.databases',
    'musicSearch',
    'ualib.staffdir',
    'ualib.softwareList'
])

    .config(['$routeProvider', function($routeProvider, $location) {
        /**
         * Register Bento Box display route with ngRoute's $routeProvider
         */
        $routeProvider
            .when('/home', {
                templateUrl: '../assets/js/_ualib-home.tpl.html'
            })
            .otherwise({
                redirectTo: '/home'
            });
    }])

    .run(['$routeParams', '$location', '$rootScope', function($routeParams, $location, $rootScope){
        $rootScope.$on('$routeChangeSuccess', function(e, current, pre) {
            $rootScope.appClass = $location.path().split('/')[1];
            if ($rootScope.appClass === 'home'){
                $rootScope.appClass = 'front-page';
            }
            $rootScope.appClass += ' webapp';
        });
    }]);
