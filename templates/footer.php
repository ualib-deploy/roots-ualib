<footer class="content-info page-row" role="contentinfo">
  <div class="footer-wrapper">
    <div class="container">
      <?php dynamic_sidebar('sidebar-footer'); ?>
      <div class="row">
        <div class="col-sm-3">
          <h4>Quick Links</h4>
          <ul class="footer-list">
            <li><a href="<?php echo site_url(); ?>/about-ua-libraries/contact-us/">University Libraries’ Maps and Contact Information</a></li>
            <li><a href="<?php echo site_url(); ?>/about-ua-libraries/libraries-policies/access-to-and-usage-of-electronic-resources/">Access to and Usage of Electronic Resources</a></li>
            <li><a href="<?php echo site_url(); ?>/services/disability-services/physical-access/">Physical Access</a></li>
            <li><a href="<?php echo site_url(); ?>/about-ua-libraries/libraries-policies/">Libraries' Policies</a></li>
            <li><a href="<?php echo site_url(); ?>/about-ua-libraries/privacy-and-cookies/">Privacy and Cookies</a></li>
            <li><a href="https://wwwdev2.lib.ua.edu/site-map">Site Map</a></li>
            <li><a href="<?php echo site_url(); ?>/about-ua-libraries/copyright-statement/">Copyright Statement</a></li>
            <li><a href="<?php echo site_url(); ?>/about-ua-libraries/support-ua-libraries/">Support UA Libraries</a></li>
          </ul>
        </div>

        <div class="col-sm-3">
          <h4>Libraries</h4>
          <ul class="footer-list">
            <li><a href="<?php echo site_url(); ?>/libraries-and-collections/gorgas-library/">Amelia Gayle Gorgas Library</a></li>
            <li><a href="<?php echo site_url(); ?>/libraries-and-collections/bruno/">Angelo Bruno Business Library</a></li>
            <li><a href="<?php echo site_url(); ?>/libraries-and-collections/mclure-education-library//">McLure Education Library</a></li>
            <li><a href="<?php echo site_url(); ?>/libraries-and-collections/rodgers-science-and-engineering-library/">Rodgers Library for Science &amp; Engineering</a></li>
            <li><a href="<?php echo site_url(); ?>/libraries-and-collections/hoole-library/">W.S. Hoole Special Collections Library</a></li>
            <li><a href="<?php echo site_url(); ?>/libraries-and-collections/music-library/">Music Library</a></li>
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
                  {{!isCollapsed ? 'More' : 'Less'}} Libraries...
              </button>

        </div>

        <div class="col-sm-3" >
          <h4>Collections</h4>
          <ul class="footer-list">
            <li><a href="http://lib.ua.edu/williamscollection/">A.S. Williams Collection</a></li>
            <li><a href="https://wwwdev2.lib.ua.edu/collections/wade-hall-collection/">Wade Hall Collection</a></li>
            <li><a href="https://wwwdev2.lib.ua.edu/collections/the-david-walker-lupton-african-american-cookbook-collection/">Lupton Collection</a></li>
            <li><a href="https://wwwdev2.lib.ua.edu/collections/map-collections/">Map Collection</a></li>
            <li><a href="https://wwwdev2.lib.ua.edu/collections/rare-book-collection/">Rare Book Collection</a></li>
            <li><a href="https://wwwdev2.lib.ua.edu/collections/university-archives/">University Archives and Records Management</a></li>
            <li><i><a href="https://wwwdev2.lib.ua.edu/collections/major-collections-summaries/">More Collections...</a></i></li>
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
    </div>
  </div>
</footer>