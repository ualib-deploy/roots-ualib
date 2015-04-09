angular.module('ualib.templates', ['../assets/js/_ualib-home.tpl.html']);

angular.module("../assets/js/_ualib-home.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../assets/js/_ualib-home.tpl.html",
    "<div class=\"home-slice\">\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"col-md-6 col-md-push-6\" style=\"padding: 15px; background-color: rgba(255,255,255,.9);\">\n" +
    "        <div class=\"hours-list\"></div>\n" +
    "      </div>\n" +
    "        <div class=\"col-md-6 col-md-pull-6\" style=\"padding: 15px; background-color: rgba(255,255,255,.9); display: table;\">\n" +
    "            <div class=\"event-card\" style=\"display: table-row\">\n" +
    "                <div style=\"text-align: right; font-size: 20px; color: #999; display: table-cell; vertical-align: top; padding-right: 15px;\">          News        </div>\n" +
    "                <div style=\"display: table-cell; vertical-align: top;\">\n" +
    "                    <div class=\"media\">\n" +
    "                        <div class=\"media-left\">\n" +
    "                            <a href=\"#\">\n" +
    "                                <div class=\"media-object\" style=\"background-color: #999; height: 64px; width: 64px;\"/>\n" +
    "                            </a>\n" +
    "                        </div>\n" +
    "                        <div class=\"media-body\">\n" +
    "                            <h4 class=\"media-heading\">Visiting Poet To Give Reading on UA Campus</h4>\n" +
    "                            The Coal Royalty Fund of the English Department at the University of Alabama presents Cathy Park Hong.\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"event-card\" style=\"display: table-row\">\n" +
    "                <div style=\"text-align: right; font-size: 20px; color: #999; display: table-cell; vertical-align: top; padding-right: 15px;\">          Events        </div>\n" +
    "                <div style=\"display: table-cell; vertical-align: top;\">\n" +
    "                    <div class=\"media\">\n" +
    "                        <div class=\"media-left\">\n" +
    "                            <a href=\"#\">\n" +
    "                                <div class=\"media-object\" style=\"background-color: #999; height: 64px; width: 64px;\"/>\n" +
    "                            </a>\n" +
    "                        </div>\n" +
    "                        <div class=\"media-body\">\n" +
    "                            <h4 class=\"media-heading\">UA Eco-Health Workshop</h4>\n" +
    "                            Sponsored by: Office for Research and Economic Development/ Office for Sponsored Programs\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"media\">\n" +
    "                        <div class=\"media-left\">\n" +
    "                            <a href=\"#\">\n" +
    "                                <div class=\"media-object\" style=\"background-color: #999; height: 64px; width: 64px;\"/>\n" +
    "                            </a>\n" +
    "                        </div>\n" +
    "                        <div class=\"media-body\">\n" +
    "                            <h4 class=\"media-heading\">Visiting Poet To Give Reading on UA Campus</h4>\n" +
    "                            Sponsored by: Office for Sponsored Programs/Office for Research and Economic Development\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"event-card\" style=\"display: table-row\">\n" +
    "                <div style=\"text-align: right; font-size: 20px; color: #999; display: table-cell; vertical-align: top; padding-right: 15px;\">          Exhibits        </div>\n" +
    "                <div style=\"display: table-cell; vertical-align: top;\">\n" +
    "                    <div class=\"media\">\n" +
    "                        <div class=\"media-left\">\n" +
    "                            <a href=\"#\">\n" +
    "                                <div class=\"media-object\" style=\"background-color: #999; height: 64px; width: 64px;\"/>\n" +
    "                            </a>\n" +
    "                        </div>\n" +
    "                        <div class=\"media-body\">              Lorem ipsum dolor sit amet, consectetur adipiscing elit.              Donec vitae.            </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);
