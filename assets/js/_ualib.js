angular.module('ualib', [
    'ngRoute',
    'ngAnimate',
    'ualib.templates',
    'ualib.ui',
    'ualib.hours',
    'oneSearch',
    'ualib.imageCarousel',
    'ualib.databases',
    'musicSearch',
    'ualib.staffdir',
    'ualib.softwareList',
    'ualib.news',
    'ualib.alerts',
    'oc.lazyLoad'
])
// Default offset for ui-scrollfix elements.
    .value('duScrollOffset', 100)

    .config(['$httpProvider', '$routeProvider', '$compileProvider', function($httpProvider, $routeProvider, $compileProvider) {

        //HTML tags are stripped after JSON data in all AJAX responses
        function stripHTMLFromJSON(data) {
            if (typeof data === 'string'){
                data = data.trim();
                if (data[0] === '{' || data[0] === '[' || data[0] === ')'){
                    console.log("Stripping HTML data from JSON in AJAX response...");
                    data = angular.fromJson(data.replace(/<\/?[^>]+(>|$)/g, ""));
                }
            }
            return data;
        }
        $httpProvider.defaults.transformResponse.push(function(responseData){
            return stripHTMLFromJSON(responseData);
        });

        /**
         * Register Bento Box display route with ngRoute's $routeProvider
         */
        $routeProvider
            .when('/home', {
                templateUrl: '_ualib-home.tpl.html',
                controller: ['$scope' ,'$rootScope', function($scope, $rootScope){
                    //$rootScope.appClass = 'front-page';
                    var testVar = 1;
                    var bgNum = (Math.floor(Math.random() * 1000) % 16) + testVar;
                    $rootScope.appStyle = {"background-image": "url('wp-content/themes/roots-ualib/assets/img/quad-sunset-lg_" + bgNum + ".jpg')"};
                }]
            })
            .otherwise({redirectTo:'/home'});

        // Extend $compileProvider to allow mailto/file/ftp in ng-href - without this, links render as "unsafe:mailto:..."
        // This is only requires for Angular 1.2.28 - after upgrade, remove this
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|mailto|file|blob|tel):/);
    }])

    .run(['$routeParams', '$location', '$rootScope', '$ocLazyLoad', '$http',
    function($routeParams, $location, $rootScope, $ocLazyLoad, $http){

        $http({
            method: 'POST',
            url: wp.ajaxurl,
            params: {action: 'is_user_logged_in'}
        }).then(function(data){
            if (data.data === 'yes'){
                var jsExt = wp.env === 'live' ? '.min.js' : '.js';
                var cssExt = wp.env === 'live' ? '.min.css' : '.css';

                $ocLazyLoad.load({
                    files: [
                        wp.templateUrl + '/assets/js/manage' + jsExt,
                        wp.templateUrl + '/assets/css/manage' + cssExt
                    ],
                    cache: false
                });
            }
        });

        $rootScope.appClass = 'page-loaded';
        $rootScope.$on('$routeChangeSuccess', function(e, current, pre) {

            // Check if changing from another angular route, and if the previous route is different.
            // We should only force page views in GA when navigating from one app to another.
            // Otherwise the page view will have already be sent to GA via the WP base.php template
            // TODO: make this better - seems a bit long winded ya?
            if (pre && pre.hasOwnProperty('$$route') && pre.$$route.hasOwnProperty('originalPath') && current.hasOwnProperty('$$route') && current.$$route.hasOwnProperty('originalPath') && current.$$route.originalPath !== pre.$$route.originalPath){
                // Send Google Analytics page view when routes are accessed
                ga('require', 'linkid');
                ga('send', 'pageview', $location.url());
            }

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
