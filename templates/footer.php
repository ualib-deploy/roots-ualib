<footer class="content-info" role="contentinfo">
  <div class="footer-wrapper">
    <div class="container">
      <?php dynamic_sidebar('sidebar-footer'); ?>
      <div class="row">
        <div class="col-sm-4">
          <h4>Quick Links</h4>
          <ul class="footer-list">
            <li><a href="https://wwwdev2.lib.ua.edu/about-ua-libraries/contact-us/">University Libraries’ Maps and Contact Information</a></li>
            <li><a href="https://wwwdev2.lib.ua.edu/about-ua-libraries/libraries-policies/access-to-and-usage-of-electronic-resources/">Access to and Usage of Electronic Resources</a></li>
            <li><a href="https://wwwdev2.lib.ua.edu/services/disability-services/physical-access/">Physical Access</a></li>
            <li><a href="https://wwwdev2.lib.ua.edu/about-ua-libraries/libraries-policies/">Libraries' Policies</a></li>
            <li><a href="https://wwwdev2.lib.ua.edu/about-ua-libraries/privacy-and-cookies/">Privacy and Cookies</a></li>
            <li><a href="https://wwwdev2.lib.ua.edu/about-ua-libraries/site-map/">Site Map</a></li>
            <li><a href="https://wwwdev2.lib.ua.edu/about-ua-libraries/copyright-statement/">Copyright Statement</a></li>
            <li><a href="https://wwwdev2.lib.ua.edu/about-ua-libraries/support-ua-libraries/">Support UA Libraries</a></li>
          </ul>
        </div>

        <div class="col-sm-4">
          <h4>Libraries &amp; Collections</h4>
          <ul class="footer-list">
            <li><a href="https://wwwdev2.lib.ua.edu/services/information-for-faculty/distance-education-faculty/gorgas-library/">Gorgas Library</a></li>
            <li><a href="https://wwwdev2.lib.ua.edu/services/information-for-faculty/distance-education-faculty/rodgers-library-for-science-engineering/">Rodgers Library for Science &amp; Engineering</a></li>
            <li><a href="https://wwwdev2.lib.ua.edu/libraries-and-collections/campus-libraries/music-library/">Music Library</a></li>
            <li><a href="https://wwwdev2.lib.ua.edu/libraries-and-collections/collections/a-s-williams-collection/">A.S. Williams Collection</a></li>
            <li><a href="https://wwwdev2.lib.ua.edu/services/sanford-media-center/">Sanford Media Center</a></li>
            <li><a href="https://wwwdev2.lib.ua.edu/libraries-and-collections/campus-libraries/map-library-place-names-research-center/">Map Library &amp; Place Names Research Center</a></li>
            <li><a href="https://wwwdev2.lib.ua.edu/libraries-and-collections/campus-libraries/hoole-library/">Hoole Library</a></li>
            <li><a href="https://wwwdev2.lib.ua.edu/libraries-and-collections/campus-libraries/health-sciences-library/">Health Sciences Library</a></li>
            <li><a href="https://wwwdev2.lib.ua.edu/libraries-and-collections/campus-libraries/bounds-law-library/">Bounds Law Library</a></li>
          </ul>
        </div>

        <div class="col-xs-12 col-sm-4">
          <ul class="nav nav-pills nav-justified social-icons">
            <li><a href="http://www.twitter.com"><span class="fa fa-fw fa-2x fa-twitter"></span></a></li>
            <li><a href="http://www.instagram.com"><span class="fa fa-fw fa-2x fa-instagram"></span></a></li>
            <li><a href="http://www.facebook.com"><span class="fa fa-fw fa-2x fa-facebook"></span></a></li>
            <li><a href="http://www.youtube.com/"><span class="fa fa-fw fa-2x fa-youtube"></span></a></li>
          </ul>

          <a href="http://www.ua.edu">
              <img src="<?php print get_template_directory_uri(); ?>/assets/img/ua-capstone-logo.png" class="img-responsive" style="margin: 15px 0;"/>
          </a>

          <div class="row">
            <div class="col-md-6 col-md-push-6">
              <a href="http://www.fdlp.gov/">
                <img src="<?php print get_template_directory_uri(); ?>/assets/img/fdlp_logo.png" class="img-responsive"/>
              </a>
            </div>
            <div class="col-md-6 col-md-pull-6">
                <a href="http://www.hathitrust.org/" target="_hatti" class="text-right">
                    <img src="<?php print get_template_directory_uri(); ?>/assets/img/HT-logo.png" class="img-responsive" />
                </a>
            </div>
          </div>


        </div>
      </div>
    </div>
  </div>
  <div class="sub-footer">
    <div class="container">
      University Libraries • Box 870266 • Tuscaloosa, AL 35487-0266 • (205) 348-6047
    </div>
  </div>
  <?php
    include WEBAPPS_PATH . "siteSurvey/loadForm.php";
  ?>
</footer>