<footer class="content-info page-row" role="contentinfo" id="footer">
  <div class="footer-wrapper">
    <div class="container">
      <?php dynamic_sidebar('sidebar-footer'); ?>
      <div class="row">
        <div class="col-sm-3">
          <h4>Quick Links</h4>
          <ul class="footer-list">
            <li><a href="<?php echo site_url(); ?>/#/hours">Maps and Contact Information</a></li>
            <li><a href="<?php echo site_url(); ?>/about/libraries-policies/electronic-resource-user-policy//">Access and Use of Electronic Resources</a></li>
            <li><a href="<?php echo site_url(); ?>/using-the-library/accessibility//">Physical Access</a></li>
            <li><a href="<?php echo site_url(); ?>/about/libraries-policies/">Libraries' Policies</a></li>
            <li><a href="<?php echo site_url(); ?>/about/mission-statement/">Mission Statement</a></li>
            <li><a href="<?php echo site_url(); ?>/site-map">Site Map</a></li>
            <li><a href="<?php echo site_url(); ?>/about/support-ua-libraries/">Support UA Libraries</a></li>
            <li><a href="<?php echo site_url(); ?>/about/employment/">Employment</a></li>
          </ul>
        </div>

        <div class="col-sm-3">
          <h4>Libraries</h4>
          <ul class="footer-list">
            <li><a href="<?php echo site_url(); ?>/libraries/gorgas/">Amelia Gayle Gorgas Library</a></li>
            <li><a href="<?php echo site_url(); ?>/libraries/bruno/">Angelo Bruno Business Library</a></li>
            <li><a href="<?php echo site_url(); ?>/libraries/mclure/">McLure Education Library</a></li>
            <li><a href="<?php echo site_url(); ?>/libraries/rodgers/">Rodgers Library for Science &amp; Engineering</a></li>
            <li><a href="<?php echo site_url(); ?>/libraries/hoole/">W.S. Hoole Special Collections Library</a></li>
            <li><a href="<?php echo site_url(); ?>/libraries/music/">Music Library</a></li>
          </ul>
              <ul class="footer-list">

              </ul>
              <ul class="footer-list" collapse="!isCollapsed">
                  <li role="presentation"><a role="menuitem" tabindex="-1" href="http://www.library.law.ua.edu/">Bounds Law Library</a></li>
                  <li role="presentation"><a role="menuitem" tabindex="-1" href="http://cchs.ua.edu/library/">Health Sciences Library</a></li>
                  <li role="presentation"><a role="menuitem" tabindex="-1" href="http://maplibrary.ua.edu/">Map Library & Place Names Research Center</a></li>
                  <li role="presentation"><a role="menuitem" tabindex="-1" href="http://wrc.ua.edu/library.cfm">Summersell Library</a></li>
                  <li role="presentation"><a role="menuitem" tabindex="-1" href="http://cis.ua.edu/undergraduates/resources/readingroom/">William E. Winter Reading Room</a></li>
              </ul>
              <button class="btn btn-default btn-xs"  type="button" ng-click="isCollapsed = !isCollapsed">
                  {{!isCollapsed ? 'Other' : 'Less'}} Libraries...
              </button>

        </div>

        <div class="col-sm-3" >
          <h4>Collections</h4>
          <ul class="footer-list">
            <li><a href="<?php echo site_url(); ?>/collections/williams/">A.S. Williams Collection</a></li>
            <li><a href="<?php echo site_url(); ?>/collections/wade-hall-collection/">Wade Hall Collection</a></li>
            <li><a href="<?php echo site_url(); ?>/collections/the-david-walker-lupton-african-american-cookbook-collection/">Lupton Collection</a></li>
            <li><a href="<?php echo site_url(); ?>/collections/map-collections/">Map Collection</a></li>
            <li><a href="<?php echo site_url(); ?>/collections/rare-book-collection/">Rare Book Collection</a></li>
            <li><a href="<?php echo site_url(); ?>/collections/university-archives/">University Archives and Records Management</a></li>
            <li><i><a href="<?php echo site_url(); ?>/collections/major-collections-summaries/">More Collections...</a></i></li>
          </ul>
       </div>

        <div class="col-xs-12 col-sm-3">
            <a href="https://wwwdev2.lib.ua.edu/about-ua-libraries/social-media/">
              <ul class="nav nav-pills nav-justified social-icons">

                  <li><span class="fa fa-fw fa-2x fa-twitter"></span></li>
                  <li><span class="fa fa-fw fa-2x fa-instagram"></span></li>
                  <li><span class="fa fa-fw fa-2x fa-facebook"></span></li>
                  <li><span class="fa fa-fw fa-2x fa-youtube"></span></li>

             </ul>
            </a>



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
        <div> <a href="http://www.ua.edu/disclaimer.html">Disclaimer</a>
            •
            <a href="http://www.ua.edu/privacy.html">Privacy</a>
            •
            <a href=" http://www.ua.edu/copyright.html">Copyright</a>
        </div>
    </div>
  </div>
    <?php
        @include WEBAPPS_PATH . "siteSurvey/loadForm.php";
    ?>
</footer>

