angular.module('ualib.templates', ['../assets/js/_ualib-home.tpl.html']);

angular.module("../assets/js/_ualib-home.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../assets/js/_ualib-home.tpl.html",
    "<div class=\"home-slice\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-md-6 col-md-push-6\" style=\"padding: 15px; background-color: rgba(255,255,255,.9);\">\n" +
    "            <div class=\"hours-list\"></div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-6 col-md-pull-6\" style=\"padding: 15px; background-color: rgba(255,255,255,.9); display: table;\">\n" +
    "            <div class=\"view-news-events-exhibitions\"></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);
