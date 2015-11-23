angular.module('ualib', [
    'ngRoute',
    'ngAnimate',
    'ualib.templates',
    'ualib.ui',
    'hours',
    'oneSearch',
    'manage',
    'ualib.databases',
    'musicSearch',
    'ualib.staffdir',
    'ualib.softwareList',
    'ualib.news',
    'ualib.alerts',
    'ualib.imageCarousel'
])


    .config(['$routeProvider', '$compileProvider', function($routeProvider, $compileProvider) {
        /**
         * Register Bento Box display route with ngRoute's $routeProvider
         */
        $routeProvider
            .when('/home', {
                templateUrl: '../assets/js/_ualib-home.tpl.html',
                controller: ['$scope' ,'$rootScope', function($scope, $rootScope){
                    //$rootScope.appClass = 'front-page';
                    //test comment 3
                    var bgNum = (Math.floor(Math.random() * 1000) % 16) + 1;
                    $rootScope.appStyle = {"background-image": "url('wp-content/themes/roots-ualib/assets/img/quad-sunset-lg_" + bgNum + ".jpg')"};
                }]
            })
            .otherwise({
                redirectTo: '/home'
            });

        // Extend $compileProvider to allow mailto/file/ftp in ng-href - without this, links render as "unsafe:mailto:..."
        // This is only requires for Angular 1.2.28 - after upgrade, remove this
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|mailto|file|blob):/);

    }])



    .run(['$routeParams', '$location', '$rootScope', '$document', 'duScrollOffset', function($routeParams, $location, $rootScope, $document, duScrollOffset){
        $rootScope.appClass = 'page-loaded';
        $rootScope.$on('$routeChangeSuccess', function(e, current, pre) {
            //Send Google Analytics page view when routes are accessed
            ga('send', 'pageview', $location.url());
            var appRoute = $location.path().split('/')[1];
            $rootScope.appStyle = {};
            $rootScope.appClass = 'webapp ' + appRoute + '-webapp';

            //TODO: Temporary!! Remove when either removing or pushing new home/webapp CSS animations
            angular.element(document.querySelector('body')).addClass('webapp');

            //if ($rootScope.appClass === 'home') {
            //    $rootScope.appClass = 'front-page';
            //    var bgNum = (Math.floor(Math.random() * 1000) % 16) + 1;
            //    $rootScope.appStyle = {"background-image": "url('wp-content/themes/roots-ualib/assets/img/quad-sunset-lg_" + bgNum + ".jpg')"};
            //    //console.log('Background 1.');
            //}
            //$rootScope.appClass += ' webapp';
        });

    }]);
