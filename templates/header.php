<?php
@include_once WEBAPPS_PATH . "userGroupsAdmin/constants.php";
@include_once WEBAPPS_PATH . "userGroupsAdmin/functions.php";

$showAdminLink = false;
if (defined('GROUP_ANY_WEBAPP'))
    if (($wpUser = gDoesUserHaveAccessWP( GROUP_ANY_WEBAPP )) !== false){
        $showAdminLink = true;
}
?>
<header role="banner">
    <nav class="navbar navbar-static-top navbar-mega-inverse" role="navigation">
        <div class="container-fluid">
            <div class="navbar-header">
                <a class="navbar-brand" href="<?php echo get_settings('home'); ?>">
                    <img src="<?php print get_template_directory_uri(); ?>/assets/img/ualib-logo-textonly-inverse.png" class="hidden-xs" rel="home" alt="University of Alabama Libraries"/>
                    <span class="visible-xs">UA Libraries</span>
                </a>
            </div>
            <div>
                <ul class="nav navbar-nav navbar-right">
                    <?php if ($showAdminLink): ?>
                        <li class="dropdown yamm-fw">
                            <a href="<?php echo DOMAIN; ?>sample-page/user-groups-admin/" class="icon-only" title="WebApps Admin">
                                <span class="fa fa-spin fa-cog"></span>
                            </a>
                        </li>
                    <?php endif; ?>
                    <li class="dropdown yamm-fw" dropdown-sticky>
                        <a href="#" class="dropdown-toggle icon-only" title="My Accounts" ng-click="mainNavbarCollapsed = false;">
                            <span class="fa fa-user"></span>
                        </a>
                        <ul class="dropdown-menu">
                            <li>
                                <div class="yamm-content">
                                    <h2>My Accounts</h2>
                                    <tabset  vertical="true" tab-class="col-sm-3" content-class="col-sm-9">
                                        <tab heading="My Library (Catalog)">
                                            <form>
                                                <div class="form-group">
                                                    <label for="exampleInputEmail1">CWID</label>
                                                    <input type="text" class="form-control" id="exampleInputEmail1" placeholder="Enter email">
                                                </div>
                                                <div class="form-group">
                                                    <label for="exampleInputPassword1">Last Name</label>
                                                    <input type="text" class="form-control" id="exampleInputPassword1" placeholder="Password">
                                                </div>
                                                <select class="form-control">
                                                    <option selected="" value="1@UADB20021202141309">University of Alabama Libraries</option>
                                                    <option value="1@AUBDB20011120113530">Auburn University Libraries</option>
                                                    <option value="1@AUMDB20011120113546">Auburn University Montgomery</option>
                                                    <option value="1@JACKDB20020808100014">Houston Cole Library</option>
                                                    <option value="1@UABDB20020817181349">Mervyn H. Sterne Library</option>
                                                </select>
                                                <button type="submit" class="btn btn-default">Login to Library Catalog</button>
                                            </form>
                                        </tab>
                                        <tab heading="Interlibrary Loan (ILLiad)">
                                            <form>
                                                <div class="form-group">
                                                    <label for="exampleInputEmail1">User</label>
                                                    <input type="text" class="form-control" id="exampleInputEmail1" placeholder="Enter email">
                                                </div>
                                                <div class="form-group">
                                                    <label for="exampleInputPassword1">Password</label>
                                                    <input type="text" class="form-control" id="exampleInputPassword1" placeholder="Password">
                                                </div>
                                                <button type="submit" class="btn btn-default">Login to ILLiad</button>
                                            </form>
                                        </tab>
                                        <tab heading="Refworks">
                                            <form>
                                                <div class="form-group">
                                                    <label for="exampleInputEmail1">User</label>
                                                    <input type="text" class="form-control" id="exampleInputEmail1" placeholder="Enter email">
                                                </div>
                                                <div class="form-group">
                                                    <label for="exampleInputPassword1">Password</label>
                                                    <input type="text" class="form-control" id="exampleInputPassword1" placeholder="Password">
                                                </div>
                                                <button type="submit" class="btn btn-default">Login to Refworks</button>
                                            </form>
                                        </tab>
                                        <tab heading="Endnote">
                                            <form>
                                                <div class="form-group">
                                                    <label for="exampleInputEmail1">Email</label>
                                                    <input type="text" class="form-control" id="exampleInputEmail1" placeholder="Enter email">
                                                </div>
                                                <div class="form-group">
                                                    <label for="exampleInputPassword1">Password</label>
                                                    <input type="text" class="form-control" id="exampleInputPassword1" placeholder="Password">
                                                </div>
                                                <button type="submit" class="btn btn-default">Login to Endnote</button>
                                            </form>
                                        </tab>
                                        <tab heading="myBama">
                                            <form>
                                                <div class="form-group">
                                                    <label for="exampleInputEmail1">myBama User</label>
                                                    <input type="text" class="form-control" id="exampleInputEmail1" placeholder="Enter email">
                                                </div>
                                                <div class="form-group">
                                                    <label for="exampleInputPassword1">Password</label>
                                                    <input type="text" class="form-control" id="exampleInputPassword1" placeholder="Password">
                                                </div>
                                                <button type="submit" class="btn btn-default">Login to myBama</button>
                                            </form>
                                        </tab>
                                        <tab heading="Blackboard Learn">
                                            <form>
                                                <div class="form-group">
                                                    <label for="exampleInputEmail1">myBama Id</label>
                                                    <input type="text" class="form-control" id="exampleInputEmail1" placeholder="Enter email">
                                                </div>
                                                <div class="form-group">
                                                    <label for="exampleInputPassword1">Password</label>
                                                    <input type="text" class="form-control" id="exampleInputPassword1" placeholder="Password">
                                                </div>
                                                <button type="submit" class="btn btn-default">Login to Blackboard Learn</button>
                                            </form>
                                        </tab>
                                    </tabset>
                                </div>
                            </li>
                        </ul>
                    </li>
                    <li class="<?php if (is_front_page()) print 'dropdown-static ';?>dropdown yamm-fw"  dropdown-sticky>
                        <a href="#" class="dropdown-toggle icon-only" ng-click="mainNavbarCollapsed = false;">
                            <span class="fa fa-search"></span>
                        </a>
                        <ul class="dropdown-menu">
                            <li>
                                <div class="yamm-content" ng-controller="OneSearchCtrl">
                                    <!--<form action="/sample-page/onesearch/">
                                        <div class="input-group input-group-lg">
                                            <input type="text" name="search" class="form-control onesearch-text" placeholder="Search all library resources">
                                            <div class="input-group-btn">
                                                <button type="submit" class="btn btn-onesearch btn-primary"><span class="fa fa-search"></span></button>
                                            </div>
                                        </div>
                                    </form>-->
                                    <form ng-submit="search()">

                                        <suggest-one-search prompt="Search all library resources" model="searchText" search="search">

                                    </form>
                                </div>
                            </li>
                        </ul>
                    </li>
                    <li class="dropdown">
                        <button type="button" class="dropdown-toggle navbar-toggle collapsed icon-only"ng-click="mainNavbarCollapsed = !mainNavbarCollapsed">
                            <span class="sr-only">Toggle navigation</span>
                            <span class="fa fa-bars"></span>
                        </button>
                    </li>
                </ul>
            </div>
            <div class="collapse navbar-collapse" collapse="!mainNavbarCollapsed">
                <ul class="nav navbar-nav navbar-right navbar-main">
                    <li class="dropdown yamm-fw">
                        <a href="#" class="dropdown-toggle">Research Tools</a>
                        <ul class="dropdown-menu">
                            <li>
                                <div class="yamm-content">
                                    <div class="row">
                                        <div class="col-xs-12 col-sm-6 col-md-3">
                                            <a class="service-card" href="<?php echo site_url(); ?>/research-help/scout/">
                                                <span class="fa fa-binoculars"></span>
                                                <h4>Scout</h4>
                                                <p>Search for books, articles, and more</p>
                                            </a>
                                        </div>
                                        <div class="col-xs-12 col-sm-6 col-md-3">
                                            <a class="service-card" href="<?php echo site_url(); ?>/sample-page/databases/#/databases">
                                                <span class="fa fa-database"></span>
                                                <h4>Databases</h4>
                                                <p>Organized collections of articles, journals, and published materials</p>
                                            </a>
                                        </div>
                                        <div class="col-xs-12 col-sm-6 col-md-3">
                                            <a class="service-card" href="<?php echo site_url(); ?>/research-help/google-scholar/">
                                                <span class="fa fa-google"></span>
                                                <h4>Google Scholar</h4>
                                                <p>Search for scholarly literature through a Google web search</p>
                                            </a>
                                        </div>
                                        <div class="col-xs-12 col-sm-6 col-md-3">
                                            <a class="service-card" href="http://guides.lib.ua.edu/">
                                                <span class="fa fa-compass"></span>
                                                <h4>Research Guides</h4>
                                                <p>Explore subject and course specific resource in guides curated by UA librarians</p>
                                            </a>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-xs-12 col-sm-6 col-md-3">
                                            <a class="service-card" href="<?php echo site_url(); ?>/research-help/e-resources/">
                                                <span class="fa fa-bolt"></span>
                                                <h4>Electronic Resources</h4>
                                                <p>Explore the libraries' E-Book and E-Journal collections </p>
                                            </a>
                                        </div>
                                        <div class="col-xs-12 col-sm-6 col-md-3">
                                            <a class="service-card" href="http://guides.lib.ua.edu/distance_learning">
                                                <span class="fa fa-globe"></span>
                                                <h4>Distance Education</h4>
                                                <p>Information on research, writing, and key resources for distant learners</p>
                                            </a>
                                        </div>
                                        <div class="col-xs-12 col-sm-6 col-md-3">
                                            <a class="service-card" href="<?php echo site_url(); ?>/research-help/government-information/">
                                                <span class="fa fa-university"></span>
                                                <h4>Government Information, Statistics, and Data</h4>
                                                <p>Explore our large collection of U.S. Federal documents</p>
                                            </a>
                                        </div>
                                        <div class="col-xs-12 col-sm-6 col-md-3">
                                            <a class="service-card" href="<?php echo site_url(); ?>/research-help/citation-finder/">
                                                <span class="fa fa-quote-left"></span>
                                                <h4>Citation Finder</h4>
                                                <p>A quick tool to help you locate articles with citation information</p>
                                            </a>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-xs-12 col-sm-6 col-md-3">
                                            <a class="service-card" href="<?php echo site_url(); ?>/libraries-and-collections/campus-libraries/music-library/music-library-search/">
                                                <span class="fa fa-music"></span>
                                                <h4>Music Library Search</h4>
                                                <p>Thousands of music resources, including audio and video recordings</p>
                                            </a>
                                        </div>
                                        <div class="col-xs-12 col-sm-6 col-md-3">
                                            <a class="service-card" href="http://acumen.lib.ua.edu/home">
                                                <span class="fa fa-search-plus"></span>
                                                <h4>Digital Archives</h4>
                                                <p>Access student research, digitized historical material, and more</p>
                                            </a>
                                        </div>
                                        <div class="col-xs-12 col-sm-6 col-md-3">
                                            <a class="service-card" href="http://refworks.ua.edu">
                                                <span class="fa fa-folder"></span>
                                                <h4>RefWorks</h4>
                                                <p>Save citations, organize your research, and create bibliographies</p>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </li>
                    <li class="dropdown yamm-fw">
                        <a href="#" class="dropdown-toggle">Using the Library</a>
                        <ul class="dropdown-menu">
                            <li>
                                <div class="yamm-content">
                                    <div class="row">
                                        <div class="col-xs-12 col-sm-6 col-md-3">
                                            <div class="service-list">
                                                <span class="fa fa-desktop"></span>
                                                <h4>Computers, Software, &amp; Equipment</h4>
                                                <ul>
                                                    <li><a href="<?php echo site_url(); ?>/services/photocopying/">Print, Scan, Copy</a></li>
                                                    <li class="menu-computer-availability"><a href="<?php echo site_url(); ?>/services/computer-availability/computer-availability/">Computer Availability</a></li>
                                                    <li class="menu-laptop-computers"><a href="<?php echo site_url(); ?>/services/computer-availability/laptop-computers/">Laptop Computers</a></li>
                                                    <li class="menu-library-software-list"><a href="<?php echo site_url(); ?>/services/computer-availability/library-software-list/">Library Software List</a></li>

                                                </ul>
                                            </div>
                                            <a class="service-card" href="<?php echo site_url(); ?>/services/circulation-services/">
                                                <span class="fa fa-calendar"></span>
                                                <h4>Borrow, Renew, and Course Reserves</h4>
                                                <p>Checkout library resources and locate instructor provided materials for your courses</p>
                                            </a>
                                        </div>
                                        <div class="col-xs-12 col-sm-6 col-md-9">
                                            <div class="row">
                                                <div class="col-sm-12 col-md-4">
                                                    <a class="service-card" href="<?php echo site_url(); ?>/services/find-a-place-to-study/">
                                                        <span class="fa fa-exchange"></span>
                                                        <h4>Interlibrary Borrowing</h4>
                                                        <p>Borrow materials owned by other libraries</p>
                                                    </a>
                                                </div>
                                                <div class="col-sm-12 col-md-4">
                                                    <a class="service-card" href="<?php echo site_url(); ?>/services/sanford-media-center/">
                                                        <span class="fa fa-cubes"></span>
                                                        <h4>Sanford Media Center</h4>
                                                        <p>A leading-edge facility for digital media production </p>
                                                    </a>
                                                </div>
                                                <div class="col-sm-12 col-md-4">
                                                    <a class="service-card" href="<?php echo site_url(); ?>/services/digital-humanities-center/">
                                                        <span class="fa fa-tachometer"></span>
                                                        <h4>Digital Humanities Center</h4>
                                                        <p>Explore and create innovative research and teaching projects</p>
                                                    </a>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-sm-12 col-md-4">
                                                    <a class="service-card" href=" <?php echo site_url(); ?>/services/find-a-place-to-study/">
                                                        <span class="fa fa-book"></span>
                                                        <h4>Find a Place to Study</h4>
                                                        <p>Find the best spaces to study at libraries, listed by noise level </p>
                                                    </a>
                                                </div>
                                                <div class="col-sm-12 col-md-4">
                                                    <a class="service-card" href="<?php echo site_url(); ?>/services/practice-presentation-rooms/">
                                                        <span class="fa fa-area-chart"></span>
                                                        <h4>Practice Presentation Rooms</h4>
                                                        <p>Facilities and equipment to help you prepare for presentations </p>
                                                    </a>
                                                </div>
                                                <div class="col-sm-12 col-md-4">
                                                    <a class="service-card" href="<?php echo site_url(); ?>/services/library-instruction/">
                                                        <span class="fa fa-calendar"></span>
                                                        <h4>Classes, Workshops, Tours</h4>
                                                        <p>Register for instruction sessions and tours of our libraries</p>
                                                    </a>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-sm-12 col-md-4">
                                                    <a class="service-card" href="<?php echo site_url(); ?>/services/disability-services/">
                                                        <span class="fa fa-wheelchair"></span>
                                                        <h4>Disability Services</h4>
                                                        <p>Accommodations for library users with disabilities</p>
                                                    </a>
                                                </div>
                                                <div class="col-sm-12 col-md-4">
                                                    <a class="service-card" href="<?php echo site_url(); ?>/services/information-for-faculty/">
                                                        <span class="fa fa-graduation-cap"></span>
                                                        <h4>Information for Faculty</h4>
                                                        <p>Purchases, teaching and research support</p>
                                                    </a>
                                                </div>
                                                <div class="col-sm-12 col-md-4">
                                                    <a class="service-card" href="<?php echo site_url(); ?>/services/library-information-for-current-students/">
                                                        <span class="fa fa-pencil"></span>
                                                        <h4>Information for Students</h4>
                                                        <p>Learn more about the libraries, materials, and our services</p>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </li>
                    <li class="dropdown yamm-fw">
                        <a href="#" class="dropdown-toggle">About</a>
                        <ul class="dropdown-menu">
                            <li>
                                <div class="yamm-content">
                                    <div class="row">
                                        <div class="col-xs-12 col-sm-6 col-md-3">
                                            <a class="service-card" href="<?php echo site_url(); ?>/sample-page/hours/">
                                                <span class="fa fa-clock-o"></span>
                                                <h4>Hours</h4>
                                                <p>Library hours and locations</p>
                                            </a>
                                        </div>
                                        <div class="col-xs-12 col-sm-6 col-md-3">
                                            <a class="service-card" href="<?php echo site_url(); ?>/#/staffdir">
                                                <span class="fa fa-users"></span>
                                                <h4>Directory</h4>
                                                <p>UA Library Faculty and Staff</p>
                                            </a>
                                        </div>
                                        <div class="col-xs-12 col-sm-6 col-md-3">
                                            <a class="service-card" href="<?php echo site_url(); ?>/services/library-information-for-current-students/about-the-libraries/">
                                                <span class="fa fa-university"></span>
                                                <h4>About the Libraries</h4>
                                                <p>Information about each of our branch libraries</p>
                                            </a>
                                        </div>
                                        <div class="col-xs-12 col-sm-6 col-md-3">
                                            <a class="service-card" href="<?php echo site_url(); ?>/about-ua-libraries/library-annex/">
                                                <span class="fa fa-building"></span>
                                                <h4>Library Annex</h4>
                                                <p>Supplemental library collections located off campus</p>
                                            </a>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-xs-12 col-sm-6 col-md-3">
                                            <a class="service-card" href="<?php echo site_url(); ?>/about-ua-libraries/libraries-policies/">
                                                <span class="fa fa-sitemap"></span>
                                                <h4>Policies</h4>
                                                <p>Learn about libraries' policies and procedures</p>
                                            </a>
                                        </div>
                                        <div class="col-xs-12 col-sm-6 col-md-3">
                                            <a class="service-card" href="<?php echo site_url(); ?>/about-ua-libraries/social-media/">
                                                <span class="fa fa-users"></span>
                                                <h4>Social Media</h4>
                                                <p>Explore the libraries' multiple social media outlets </p>
                                            </a>
                                        </div>
                                        <div class="col-xs-12 col-sm-6 col-md-3">
                                            <a class="service-card" href="<?php echo site_url(); ?>/about-ua-libraries/support-ua-libraries/">
                                                <span class="fa fa-gift"></span>
                                                <h4>Support UA Libraries</h4>
                                                <p>Help strengthen the libraries' collections, services, and resources </p>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </li>
                    <li class="dropdown yamm-fw">
                        <a href="#" class="dropdown-toggle">Library Help</a>
                        <ul class="dropdown-menu">
                            <li>
                                <div class="yamm-content">
                                    <div class="row">
                                        <div class="col-xs-12 col-sm-6 col-md-3">
                                            <a class="service-card" href="<?php echo site_url(); ?>/library-help/how-do-i/">
                                                <span class="fa fa-question-circle"></span>
                                                <h4>How Do I...</h4>
                                                <p>Frequently asked questions at the libraries</p>
                                            </a>
                                        </div>
                                        <div class="col-xs-12 col-sm-6 col-md-3">
                                            <a class="service-card" href="<?php echo site_url(); ?>/research-help/subject-specialists/">
                                                <span class="fa fa-comments"></span>
                                                <h4>Subject Specialists</h4>
                                                <p>Need research help? Reach out to your subject specialist</p>
                                            </a>
                                        </div>
                                        <div class="col-xs-12 col-sm-6 col-md-3">
                                            <a class="service-card" href="<?php echo site_url(); ?>/research-help/tutorials/">
                                                <span class="fa fa-magic"></span>
                                                <h4>Tutorials and Instructional Videos</h4>
                                                <p>Brief tutorials designed to help you use library services and resources</p>
                                            </a>
                                        </div>
                                        <div class="col-xs-12 col-sm-6 col-md-3">
                                            <a class="service-card" href="<?php echo site_url(); ?>/library-help/connect-to-a-wireless-network/">
                                                <span class="fa fa-wifi"></span>
                                                <h4>Connect to a Wireless Network</h4>
                                                <p>Access the Libraries' internet using a wireless connection</p>
                                            </a>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-xs-12 col-sm-6 col-md-3">
                                            <a class="service-card" href="<?php echo site_url(); ?>/library-help/report-a-login-problem/">
                                                <span class="fa fa-sign-in"></span>
                                                <h4>Report a Login Problem</h4>
                                                <p>Contact the libraries with problems accessing our online resources </p>
                                            </a>
                                        </div>
                                        <div class="col-xs-12 col-sm-6 col-md-3">
                                            <a class="service-card" href="<?php echo site_url(); ?>/library-help/kacecontact-form/">
                                                <span class="fa fa-envelope"></span>
                                                <h4>Run into Issues?</h4>
                                                <p>Please contact Web Services for assistance </p>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</header>
