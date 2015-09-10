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
    "                    <div class=\"card-body\">\n" +
    "                        <div class=\"row\">\n" +
    "                           <div class=\"ualib-image-carousel\"></div>\n" +
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

angular.module("../assets/js/_ualib-image-carousel.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../assets/js/_ualib-image-carousel.tpl.html",
    "<div class=\"text-center\" ng-if=\"images.length > 0\">\n" +
    "    <ul rn-carousel rn-carousel-auto-slide=\"9\" rn-carousel-buffered rn-carousel-transition=\"hexagon\"\n" +
    "        rn-carousel-index=\"curImage\" class=\"image news-carousel-small\">\n" +
    "        <li ng-repeat=\"img in images\">\n" +
    "            <div class=\"layer text-center\">\n" +
    "                <div class=\"news-carousel-image-small\"\n" +
    "                     ng-style=\"{'background-image':'url('+img+')'}\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "    <div rn-carousel-indicators ng-if=\"images.length > 1\" slides=\"images\" rn-carousel-index=\"curImage\">\n" +
    "    </div>\n" +
    "</div>");
}]);
