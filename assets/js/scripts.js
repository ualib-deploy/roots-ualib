angular.module('ualib.templates', ['_ualib-alerts.tpl.html', '_ualib-home.tpl.html']);

angular.module("_ualib-alerts.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("_ualib-alerts.tpl.html",
    "<alert class=animate ng-repeat=\"alert in list.alerts\" type={{alert.typeStr}} close=closeAlert($index)><span class=\"fa fa-exclamation-triangle\"></span> {{alert.message}} <span ng-if=alert.url><a ng-href={{alert.url}}>More...</a></span></alert>");
}]);

angular.module("_ualib-home.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("_ualib-home.tpl.html",
    "<div class=container><div class=row><div class=col-md-12><div ualib-alerts></div></div></div><div ng-controller=NewsTodayCtrl class=animate><div class=home-slice><div class=row><div class=col-md-6><div class=\"card front-page-card hidden-md hidden-lg\"><div class=card-body><div class=row><div class=col-sm-6><a href=/#/databases class=service-card><span class=\"fa fa-3x fa-database\"></span><h4>Databases</h4></a> <a href=\"http://guides.lib.ua.edu/\" class=service-card><span class=\"fa fa-book\"></span><h4>Research Guides</h4></a> <a href=http://library.ua.edu/vwebv/searchBasic class=service-card><span class=\"fa fa-search\"></span><h4>Libraries' Catalog</h4></a> <a href=\"https://ua.illiad.oclc.org/illiad/\" class=service-card><span class=\"fa fa-exchange\"></span><h4>Interlibrary Loan</h4></a></div><div class=col-sm-6><a href=\"/research-tools/e-resources/\" class=service-card><span class=\"fa fa-bolt\"></span><h4>E-Resources</h4></a> <a href=\"/scout/\" class=service-card><span class=\"fa fa-binoculars\"></span><h4>Scout</h4></a> <a href=/#/staffdir class=service-card><span class=\"fa fa-users\"></span><h4>Staff Directory</h4></a> <a href=\"http://ask.lib.ua.edu/\" class=service-card><span class=\"fa fa-question-circle\"></span><h4>Ask A Librarian</h4></a></div></div></div></div><div class=\"card front-page-card\"><div class=card-heading><h2>Hours <small>today</small></h2></div><div class=card-body><div class=hours-list></div></div><div class=card-footer><a href=/#/hours class=more-link>All Hours</a></div></div><div class=\"card front-page-card\" ng-show=events><div class=card-heading><h2>Events</h2></div><div class=card-body><div news-card=item news-type=event ng-repeat=\"item in events | limitTo : 3\"></div></div><div class=card-footer><a href=\"http://events.ua.edu/category/22/view/month/\" class=more-link>More Events</a></div></div></div><div class=col-md-6><div class=\"card front-page-card hidden-sm hidden-xs\"><div class=card-body><div class=row><div class=col-sm-6><a href=/#/databases class=service-card><span class=\"fa fa-3x fa-database\"></span><h4>Databases</h4></a> <a href=\"http://guides.lib.ua.edu/\" class=service-card><span class=\"fa fa-book\"></span><h4>Research Guides</h4></a> <a href=http://library.ua.edu/vwebv/searchBasic class=service-card><span class=\"fa fa-search\"></span><h4>Libraries' Catalog</h4></a> <a href=\"https://ua.illiad.oclc.org/illiad/\" class=service-card><span class=\"fa fa-exchange\"></span><h4>Interlibrary Loan</h4></a></div><div class=col-sm-6><a href=\"/research-tools/e-resources/\" class=service-card><span class=\"fa fa-bolt\"></span><h4>E-Resources</h4></a> <a href=\"/scout/\" class=service-card><span class=\"fa fa-binoculars\"></span><h4>Scout</h4></a> <a href=/#/staffdir class=service-card><span class=\"fa fa-users\"></span><h4>Staff Directory</h4></a> <a href=\"http://ask.lib.ua.edu/\" class=service-card><span class=\"fa fa-question-circle\"></span><h4>Ask A Librarian</h4></a></div></div></div></div><div class=\"card front-page-card ualib-image-carousel\" ng-show=slides><div class=card-body><div class=text-center><ul rn-carousel rn-carousel-auto-slide=6 rn-carousel-buffered rn-carousel-pause-on-hover rn-carousel-index=curImage rn-carousel-locked=isLocked><li ng-repeat=\"slide in slides track by $index\"><a ng-href={{slide.url}} class=\"layer text-center\" title={{slide.title}}><div class=slide-image ng-style=\"{'background-image':slide.styles}\"><div class=slide-title>{{slide.title}}</div></div></a></li></ul><div rn-carousel-indicators ng-if=\"slides.length > 1\" slides=slides rn-carousel-index=curImage></div></div></div></div><div class=\"card front-page-card\"><div class=card-heading><h2>News</h2></div><div class=card-body><div class=animate-repeat news-card=item ng-repeat=\"item in news\"></div></div><div class=card-footer><a href=/#/news-exhibits class=more-link>More News</a></div></div></div></div></div></div></div>");
}]);
;angular.module('ualib', [
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
                    cache: false,
                    reconfig: true
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
;angular.module('ualib.alerts', [])
    .constant('VIEW_ALERTS_URL', '//wwwdev2.lib.ua.edu/alerts/api/today')

    .factory('viewAlerts', ['$http', 'VIEW_ALERTS_URL', function viewAlerts($http, url){
        return {
            getData: function(){
                return $http({method: 'GET', url: url, params: {}});
            }
        };
    }])
    .controller('alertsCtrl', ['$scope', 'viewAlerts',
    function alertsCtrl($scope, viewAlerts){
        $scope.list = {};

        viewAlerts.getData()
            .success(function(data) {
                for (var i = 0; i < data.alerts.length; i++) {
                    switch (data.alerts[i].type) {
                        case '0':
                            data.alerts[i].typeStr = 'success';
                            break;
                        case '1':
                            data.alerts[i].typeStr = 'warning';
                            break;
                        case '2':
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
            templateUrl: '_ualib-alerts.tpl.html'
        };
    }]);
;angular.module('ualib.imageCarousel', ['angular-carousel'])
    .constant('VIEW_IMAGES_URL', '//wwwdev2.lib.ua.edu/erCarousel/api/slides/active')

    .factory('imageCarouselFactory', ['$http', 'VIEW_IMAGES_URL', function imageCarouselFactory($http, url){
        return {
            getData: function(){
                return $http({method: 'GET', url: url, params: {}});
            }
        };
    }])
    .controller('imageCarouselCtrl', ['$scope', '$q', 'imageCarouselFactory',
        function imageCarouselCtrl($scope, $q, imageCarouselFactory){
            $scope.slides = null;

            function loadImages(slides, i, len, deferred){
                i = i ? i : 0;
                len = len ? len : slides.length;
                deferred = deferred ? deferred : $q.defer();

                if (len < 1){
                    deferred.resolve(slides);
                }
                else{
                    var image = new Image();

                    image.onload = function(){
                        slides[i].styles = 'url('+this.src+')';
                        slides[i].image = this;

                        if (i+1 === len){
                            deferred.resolve(slides);
                        }
                        else {
                            i++;
                            loadImages(slides, i, len, deferred);
                        }
                    };
                    image.src = slides[i].image;
                }
                return deferred.promise;
            }

            imageCarouselFactory.getData()
                .success(function(data) {
                    loadImages(data.slides).then(function(slides){
                        $scope.slides = slides;
                    });
                })
                .error(function(data, status, headers, config) {
                    console.log(data);
                });

        }])
    .directive('ualibImageCarousel', [ function() {
        return {
            restrict: 'AC',
            controller: 'imageCarouselCtrl',
            link: function(scope, elm, attrs, Ctrl){

                var toggleLock = false;
                scope.isLocked = false;

                scope.pause = function(){
                    toggleLock = true;
                    scope.isLocked = true;
                };
                scope.play = function(){
                    toggleLock = false;
                    scope.isLocked = false;
                };

                scope.mouseToggle = function(){
                    if (!toggleLock){
                        scope.isLocked = !scope.isLocked;
                    }
                };

            }
        };
    }]);