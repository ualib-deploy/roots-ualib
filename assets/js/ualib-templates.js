angular.module('ualib.templates', ['../assets/js/_ualib-home.tpl.html']);

angular.module("../assets/js/_ualib-home.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../assets/js/_ualib-home.tpl.html",
    "<div ng-controller=\"NewsTodayCtrl\">\n" +
    "    <div class=\"home-slice\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-6 col-md-push-6\">\n" +
    "                <div class=\"front-page-card hours-list\"></div>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-6 col-md-pull-6\">\n" +
    "                <div class=\"front-page-card\">\n" +
    "                    <h2>News</h2>\n" +
    "                    <div class=\"animate-repeat\" news-card=\"item\" ng-repeat=\"item in news\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"home-slice\" ng-if=\"events\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-12\">\n" +
    "                <div class=\"front-page-card\">\n" +
    "                    <h2>Events</h2>\n" +
    "                    <div class=\"row\">\n" +
    "                        <div class=\"animate-repeat\" ng-repeat=\"item in events\" ng-class=\"{'col-md-6': events.length == 2,'col-md-4': events.length == 3, 'col-md-3': events.length == 4}\">\n" +
    "                            <div news-card=\"item\" news-type=\"event\">\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);
