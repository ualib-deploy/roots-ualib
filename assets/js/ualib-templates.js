angular.module('ualib.templates', ['../assets/js/_ualib-home.tpl.html']);

angular.module("../assets/js/_ualib-home.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../assets/js/_ualib-home.tpl.html",
    "<div class=\"page-slice\">\n" +
    "    <div class=\"row\" ng-controller=\"NewsTodayCtrl\">\n" +
    "        <!--<div class=\"col-md-6 col-md-push-6\" style=\"background-color: rgba(255,255,255,.9);\">\n" +
    "            <div class=\"hours-list\"></div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-6 col-md-pull-6\" style=\"background-color: rgba(255,255,255,.9);\">\n" +
    "            <div class=\"view-news-events-exhibitions\"></div>\n" +
    "        </div>-->\n" +
    "        <div class=\"col-md-6\">\n" +
    "            <h2>News</h2>\n" +
    "            <div class=\"animate-repeat\" news-card=\"item\" ng-repeat=\"item in news\">\n" +
    "            </div>\n" +
    "            <h2>Exhibits</h2>\n" +
    "            <div class=\"animate-repeat\" news-card=\"item\" ng-repeat=\"item in exhibitions\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-6\">\n" +
    "            <div class=\"hours-list\" style=\"padding: 15px; padding-top:0; background-color: rgba(255,255,255,.9);\"></div>\n" +
    "            <h2>Events</h2>\n" +
    "            <div class=\"animate-repeat\" news-card=\"item\" news-type=\"event\" ng-repeat=\"item in events\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);
