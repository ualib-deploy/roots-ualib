angular.module('ualib.templates', ['../assets/js/_ualib-home.tpl.html']);

angular.module("../assets/js/_ualib-home.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../assets/js/_ualib-home.tpl.html",
    "<div ng-controller=\"NewsTodayCtrl\">\n" +
    "    <div class=\"home-slice\">\n" +
    "        <div class=\"row\">\n" +
    "          <div class=\"col-md-6\">\n" +
    "            <div class=\"card front-page-card\">\n" +
    "              <div class=\"card-heading\">\n" +
    "                <h2>Hours <small>today</small></h2>\n" +
    "              </div>\n" +
    "              <div class=\"card-body\">\n" +
    "                <div class=\"hours-list\"></div>\n" +
    "              </div>\n" +
    "              <div class=\"card-footer\">\n" +
    "                <a href=\"https://wwwdev2.lib.ua.edu/#/hours\" class=\"more-link\">All Hours</a>\n" +
    "              </div>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "\n" +
    "          <div class=\"col-md-6\">\n" +
    "            <div class=\"card front-page-card\">\n" +
    "              <div class=\"card-heading\">\n" +
    "                <h2>News</h2>\n" +
    "              </div>\n" +
    "              <div class=\"card-body\">\n" +
    "                <div class=\"animate-repeat\" news-card=\"item\" ng-repeat=\"item in news\">\n" +
    "                </div>\n" +
    "              </div>\n" +
    "              <div class=\"card-footer\">\n" +
    "                <a href=\"https://wwwdev2.lib.ua.edu/#/hours\" class=\"more-link\">More News</a>\n" +
    "              </div>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "\n" +
    "          <div class=\"col-md-6\">\n" +
    "            <div class=\"card front-page-card\">\n" +
    "              <div class=\"card-body\">\n" +
    "                <div class=\"row\">\n" +
    "                  <div class=\"col-xs-6\">\n" +
    "                    <a href=\"http://wwwdev2.lib.ua.edu/#/databases\" class=\"service-card\">\n" +
    "                      <span class=\"fa fa-3x fa-database\"></span>\n" +
    "                      <h4>Databases</h4>\n" +
    "                    </a>\n" +
    "\n" +
    "                    <a href=\"http://qs7qk6ub8p.search.serialssolutions.com\" class=\"service-card\">\n" +
    "                      <span class=\"fa fa-exchange\"></span>\n" +
    "                      <h4>E-Journals</h4>\n" +
    "                    </a>\n" +
    "                    <a href=\"http://library.ua.edu/vwebv/searchBasic\" class=\"service-card\">\n" +
    "                      <span class=\"fa fa-search\"></span>\n" +
    "                      <h4>Libraries' Catalog</h4>\n" +
    "                    </a>\n" +
    "                    <a href=\"https://ua.illiad.oclc.org/illiad/\" class=\"service-card\">\n" +
    "                      <span class=\"fa fa-exchange\"></span>\n" +
    "                      <h4>Interlibrary Loan</h4>\n" +
    "                    </a>\n" +
    "                  </div>\n" +
    "\n" +
    "                  <div class=\"col-xs-6\">\n" +
    "                    <a href=\"https://wwwdev2.lib.ua.edu/research-tools/e-resources/\" class=\"service-card\">\n" +
    "                      <span class=\"fa fa-bolt\"></span>\n" +
    "                      <h4>E-Resources</h4>\n" +
    "                    </a>\n" +
    "\n" +
    "                    <a href=\"http://lib.ua.edu/scout/\" class=\"service-card\">\n" +
    "                      <span class=\"fa fa-binoculars\"></span>\n" +
    "                      <h4>Scout</h4>\n" +
    "                    </a>\n" +
    "                    <a href=\"https://wwwdev2.lib.ua.edu/#/staffdir\" class=\"service-card\">\n" +
    "                      <span class=\"fa fa-users\"></span>\n" +
    "                      <h4>Staff Directory</h4>\n" +
    "                    </a>\n" +
    "                  </div>\n" +
    "                </div>\n" +
    "              </div>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "\n" +
    "          <div class=\"col-md-6\" ng-if=\"events\">\n" +
    "            <div class=\"card front-page-card\">\n" +
    "             <div class=\"card-heading\">\n" +
    "               <h2>Events</h2>\n" +
    "             </div>\n" +
    "              <div class=\"card-body\">\n" +
    "                <div class=\"row\">\n" +
    "                  <div class=\"animate-repeat\" ng-repeat=\"item in events\" ng-class=\"{'col-md-12': events.length == 1, 'item': events.length == 2,'col-md-4': events.length == 3, 'col-md-3': events.length == 4}\">\n" +
    "                    <div news-card=\"item\" news-type=\"event\">\n" +
    "                    </div>\n" +
    "                  </div>\n" +
    "                </div>\n" +
    "              </div>\n" +
    "              <div class=\"card-footer\">\n" +
    "                <a href=\"http://events.ua.edu/category/22/view/month/\" class=\"more-link\">More Events</a>\n" +
    "              </div>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "");
}]);
