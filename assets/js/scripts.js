angular.module('ualib.templates', ['../assets/js/_ualib-alerts.tpl.html', '../assets/js/_ualib-home.tpl.html']);

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
    "<div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "        <div ualib-alerts></div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div ng-controller=\"NewsTodayCtrl\" class=\"animate\">\n" +
    "    <div class=\"home-slice\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-6\">\n" +
    "                <div class=\"card front-page-card\">\n" +
    "                    <div class=\"card-heading\">\n" +
    "                        <h2>Hours <small>today</small></h2>\n" +
    "                    </div>\n" +
    "                    <div class=\"card-body\">\n" +
    "                        <div class=\"hours-list\"></div>\n" +
    "                    </div>\n" +
    "                    <div class=\"card-footer\">\n" +
    "                        <a href=\"/#/hours\" class=\"more-link\">All Hours</a>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"card front-page-card\" ng-if=\"events\">\n" +
    "                    <div class=\"card-heading\">\n" +
    "                        <h2>Events</h2>\n" +
    "                    </div>\n" +
    "                    <div class=\"card-body\">\n" +
    "                        <div news-card=\"item\" news-type=\"event\" ng-repeat=\"item in events | limitTo : 3\">\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"card-footer\">\n" +
    "                        <a href=\"http://events.ua.edu/category/22/view/month/\" class=\"more-link\">More Events</a>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"col-md-6\">\n" +
    "\n" +
    "\n" +
    "                <div class=\"card front-page-card\">\n" +
    "                    <div class=\"card-body\">\n" +
    "                        <div class=\"row\">\n" +
    "                            <div class=\"col-sm-6\">\n" +
    "                                <a href=\"/#/databases\" class=\"service-card\">\n" +
    "                                    <span class=\"fa fa-3x fa-database\"></span>\n" +
    "                                    <h4>Databases</h4>\n" +
    "                                </a>\n" +
    "\n" +
    "                                <a href=\"http://qs7qk6ub8p.search.serialssolutions.com\" class=\"service-card\">\n" +
    "                                    <span class=\"fa fa-book\"></span>\n" +
    "                                    <h4>E-Journals</h4>\n" +
    "                                </a>\n" +
    "                                <a href=\"http://library.ua.edu/vwebv/searchBasic\" class=\"service-card\">\n" +
    "                                    <span class=\"fa fa-search\"></span>\n" +
    "                                    <h4>Libraries' Catalog</h4>\n" +
    "                                </a>\n" +
    "                                <a href=\"https://ua.illiad.oclc.org/illiad/\" class=\"service-card\">\n" +
    "                                    <span class=\"fa fa-exchange\"></span>\n" +
    "                                    <h4>Interlibrary Loan</h4>\n" +
    "                                </a>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div class=\"col-sm-6\">\n" +
    "                                <a href=\"/research-tools/e-resources/\" class=\"service-card\">\n" +
    "                                    <span class=\"fa fa-bolt\"></span>\n" +
    "                                    <h4>E-Resources</h4>\n" +
    "                                </a>\n" +
    "\n" +
    "                                <a href=\"/scout/\" class=\"service-card\">\n" +
    "                                    <span class=\"fa fa-binoculars\"></span>\n" +
    "                                    <h4>Scout</h4>\n" +
    "                                </a>\n" +
    "                                <a href=\"/#/staffdir\" class=\"service-card\">\n" +
    "                                    <span class=\"fa fa-users\"></span>\n" +
    "                                    <h4>Staff Directory</h4>\n" +
    "                                </a>\n" +
    "\n" +
    "                                <a href=\"http://ask.lib.ua.edu/\" class=\"service-card\">\n" +
    "                                    <span class=\"fa fa-question-circle\"></span>\n" +
    "                                    <h4>Ask A Librarian</h4>\n" +
    "                                </a>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"card front-page-card\">\n" +
    "                    <div class=\"card-heading\">\n" +
    "                        <h2>News</h2>\n" +
    "                    </div>\n" +
    "                    <div class=\"card-body\">\n" +
    "                        <div class=\"animate-repeat\" news-card=\"item\" ng-repeat=\"item in news\">\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"card-footer\">\n" +
    "                        <a href=\"/#/news-exhibits\" class=\"more-link\">More News</a>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);
;/* ========================================================================
 * DOM-based Routing
 * Based on http://goo.gl/EUTi53 by Paul Irish
 *
 * Only fires on body classes that match. If a body class contains a dash,
 * replace the dash with an underscore when adding it to the object below.
 *
 * .noConflict()
 * The routing is enclosed within an anonymous function so that you can 
 * always reference jQuery with $, even when in .noConflict() mode.
 *
 * Google CDN, Latest jQuery
 * To use the default WordPress version of jQuery, go to lib/config.php and
 * remove or comment out: add_theme_support('jquery-cdn');
 * ======================================================================== */
/*
(function($) {

// Use this variable to set up the common and page specific functions. If you 
// rename this variable, you will also need to rename the namespace below.
var Roots = {
  // All pages
  common: {
    init: function() {
      // JavaScript to be fired on all pages
    }
  },
  // Home page
  home: {
    init: function() {
      // JavaScript to be fired on the home page
    }
  },
  // About us page, note the change from about-us to about_us.
  about_us: {
    init: function() {
      // JavaScript to be fired on the about us page
    }
  }
};

// The routing fires all common scripts, followed by the page specific scripts.
// Add additional events for more control over timing e.g. a finalize event
var UTIL = {
  fire: function(func, funcname, args) {
    var namespace = Roots;
    funcname = (funcname === undefined) ? 'init' : funcname;
    if (func !== '' && namespace[func] && typeof namespace[func][funcname] === 'function') {
      namespace[func][funcname](args);
    }
  },
  loadEvents: function() {
    UTIL.fire('common');

    $.each(document.body.className.replace(/-/g, '_').split(/\s+/),function(i,classnm) {
      UTIL.fire(classnm);
    });
  }
};

$(document).ready(UTIL.loadEvents);

})(jQuery); // Fully reference jQuery after this point.*/
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
    'ualib.alerts'
])


    .config(['$routeProvider', '$compileProvider', function($routeProvider, $compileProvider) {
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

        // Extend $compileProvider to allow mailto/file/ftp in ng-href - without this, links render as "unsafe:mailto:..."
        // This is only requires for Angular 1.2.28 - after upgrade, remove this
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file):/);

    }])



    .run(['$routeParams', '$location', '$rootScope', '$document', 'duScrollOffset', function($routeParams, $location, $rootScope, $document, duScrollOffset){
        $rootScope.$on('$routeChangeSuccess', function(e, current, pre) {
            $rootScope.appStyle = {};
            $rootScope.appClass = $location.path().split('/')[1];
            if ($rootScope.appClass === 'home') {
                $rootScope.appClass = 'front-page';
                var bgNum = (Math.floor(Math.random() * 1000) % 16) + 1;
                $rootScope.appStyle = {"background-image": "url('wp-content/themes/roots-ualib/assets/img/quad-sunset-lg_" + bgNum + ".jpg')"};
                //console.log('Background 1.');
            }
            $rootScope.appClass += ' webapp';
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
