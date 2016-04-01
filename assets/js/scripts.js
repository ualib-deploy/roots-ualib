angular.module('ualib.templates', ['../assets/js/_ualib-alerts.tpl.html', '../assets/js/_ualib-home.tpl.html', '../assets/js/_ualib-image-carousel.tpl.html']);

angular.module("../assets/js/_ualib-alerts.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../assets/js/_ualib-alerts.tpl.html",
    "<alert class=\"animate\" ng-repeat=\"alert in list.alerts\" type=\"{{alert.typeStr}}\" close=\"closeAlert($index)\">\n" +
    "    <span class=\"fa fa-exclamation-triangle\"></span> {{alert.message}}\n" +
    "    <span ng-if=\"alert.url\"><a ng-href=\"{{alert.url}}\">More...</a></span>\n" +
    "</alert>\n" +
    "");
}]);

angular.module("../assets/js/_ualib-home.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../assets/js/_ualib-home.tpl.html",
    "<div class=\"container\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-md-12\">\n" +
    "            <div ualib-alerts></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div ng-controller=\"NewsTodayCtrl\" class=\"animate\">\n" +
    "        <div class=\"home-slice\">\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col-md-6\">\n" +
    "                    <div class=\"card front-page-card\">\n" +
    "                        <div class=\"card-heading\">\n" +
    "                            <h2>Hours <small>today</small></h2>\n" +
    "                        </div>\n" +
    "                        <div class=\"card-body\">\n" +
    "                            <div class=\"hours-list\"></div>\n" +
    "                        </div>\n" +
    "                        <div class=\"card-footer\">\n" +
    "                            <a href=\"/#/hours\" class=\"more-link\">All Hours</a>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"card front-page-card\" ng-show=\"events\">\n" +
    "                        <div class=\"card-heading\">\n" +
    "                            <h2>Events</h2>\n" +
    "                        </div>\n" +
    "                        <div class=\"card-body\">\n" +
    "                            <div news-card=\"item\" news-type=\"event\" ng-repeat=\"item in events | limitTo : 3\">\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"card-footer\">\n" +
    "                            <a href=\"http://events.ua.edu/category/22/view/month/\" class=\"more-link\">More Events</a>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"col-md-6\">\n" +
    "\n" +
    "\n" +
    "                    <div class=\"card front-page-card\">\n" +
    "                        <div class=\"card-body\">\n" +
    "                            <div class=\"row\">\n" +
    "                                <div class=\"col-sm-6\">\n" +
    "                                    <a href=\"/#/databases\" class=\"service-card\">\n" +
    "                                        <span class=\"fa fa-3x fa-database\"></span>\n" +
    "                                        <h4>Databases</h4>\n" +
    "                                    </a>\n" +
    "\n" +
    "                                    <a href=\"http://guides.lib.ua.edu/\" class=\"service-card\">\n" +
    "                                        <span class=\"fa fa-book\"></span>\n" +
    "                                        <h4>Research Guides</h4>\n" +
    "                                    </a>\n" +
    "                                    <a href=\"http://library.ua.edu/vwebv/searchBasic\" class=\"service-card\">\n" +
    "                                        <span class=\"fa fa-search\"></span>\n" +
    "                                        <h4>Libraries' Catalog</h4>\n" +
    "                                    </a>\n" +
    "                                    <a href=\"https://ua.illiad.oclc.org/illiad/\" class=\"service-card\">\n" +
    "                                        <span class=\"fa fa-exchange\"></span>\n" +
    "                                        <h4>Interlibrary Loan</h4>\n" +
    "                                    </a>\n" +
    "                                </div>\n" +
    "\n" +
    "                                <div class=\"col-sm-6\">\n" +
    "                                    <a href=\"/research-tools/e-resources/\" class=\"service-card\">\n" +
    "                                        <span class=\"fa fa-bolt\"></span>\n" +
    "                                        <h4>E-Resources</h4>\n" +
    "                                    </a>\n" +
    "\n" +
    "                                    <a href=\"/scout/\" class=\"service-card\">\n" +
    "                                        <span class=\"fa fa-binoculars\"></span>\n" +
    "                                        <h4>Scout</h4>\n" +
    "                                    </a>\n" +
    "                                    <a href=\"/#/staffdir\" class=\"service-card\">\n" +
    "                                        <span class=\"fa fa-users\"></span>\n" +
    "                                        <h4>Staff Directory</h4>\n" +
    "                                    </a>\n" +
    "\n" +
    "                                    <a href=\"http://ask.lib.ua.edu/\" class=\"service-card\">\n" +
    "                                        <span class=\"fa fa-question-circle\"></span>\n" +
    "                                        <h4>Ask A Librarian</h4>\n" +
    "                                    </a>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"card front-page-card\">\n" +
    "                        <div class=\"card-heading\">\n" +
    "                            <h2>News</h2>\n" +
    "                        </div>\n" +
    "                        <div class=\"card-body\">\n" +
    "                            <div class=\"animate-repeat\" news-card=\"item\" ng-repeat=\"item in news\">\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"card-footer\">\n" +
    "                            <a href=\"/#/news-exhibits\" class=\"more-link\">More News</a>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <!--\n" +
    "                    <div class=\"card front-page-card\">\n" +
    "                        <div class=\"card-body\">\n" +
    "                            <div class=\"row\">\n" +
    "                                <div class=\"ualib-image-carousel\"></div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    -->\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("../assets/js/_ualib-image-carousel.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../assets/js/_ualib-image-carousel.tpl.html",
    "<div class=\"text-center\" ng-if=\"images.length > 0\">\n" +
    "    <ul rn-carousel rn-carousel-auto-slide=\"8\" rn-carousel-buffered rn-carousel-transition=\"slide\"\n" +
    "        rn-carousel-index=\"curImage\" class=\"image news-carousel-small\">\n" +
    "        <li ng-repeat=\"img in images\">\n" +
    "            <div class=\"layer text-center\">\n" +
    "                <div class=\"news-carousel-image-small\"\n" +
    "                     ng-style=\"{'background-image':'url('+img+')'}\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "    <div class=\"rn-carousel-indicator custom-indicator\">\n" +
    "        <span ng-repeat=\"img in images\" ng-click=\"$parent.curImage = $index\">&nbsp;\n" +
    "            <span class=\"fa fa-circle-o\" ng-show=\"$index != $parent.curImage\"></span>\n" +
    "            <span class=\"fa fa-circle\" ng-show=\"$index == $parent.curImage\"></span>\n" +
    "        </span>\n" +
    "    </div>\n" +
    "</div>");
}]);
;angular.module('ualib', [
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
                templateUrl: '../assets/js/_ualib-home.tpl.html',
                controller: ['$scope' ,'$rootScope', function($scope, $rootScope){
                    //$rootScope.appClass = 'front-page';
                    var testVar = 1;
                    var bgNum = (Math.floor(Math.random() * 1000) % 16) + testVar;
                    $rootScope.appStyle = {"background-image": "url('wp-content/themes/roots-ualib/assets/img/quad-sunset-lg_" + bgNum + ".jpg')"};
                }]
            })
            .otherwise({
                redirectTo: '/home'
            });

        // Extend $compileProvider to allow mailto/file/ftp in ng-href - without this, links render as "unsafe:mailto:..."
        // This is only requires for Angular 1.2.28 - after upgrade, remove this
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|mailto|file|blob|tel):/);

    }])



    .run(['$routeParams', '$location', '$rootScope', '$document', 'duScrollOffset',
    function($routeParams, $location, $rootScope, $document, duScrollOffset){
        $rootScope.appClass = 'page-loaded';
        $rootScope.$on('$routeChangeSuccess', function(e, current, pre) {

            // Check if changing from another angular route, and if the previous route is different.
            // We should only force page views in GA when navigating from one app to another.
            // Otherwise the page view will have already be sent to GA via the WP base.php template
            if (pre && pre.hasOwnProperty('$$route') && pre.$$route.hasOwnProperty('originalPath') && current.$$route.originalPath !== pre.$$route.originalPath){
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
            templateUrl: '../assets/js/_ualib-alerts.tpl.html'
        };
    }]);
;angular.module('ualib.imageCarousel', ['angular-carousel'])
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
