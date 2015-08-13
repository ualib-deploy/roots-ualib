<?php
@include_once WEBAPPS_PATH . "userGroupsAdmin/constants.php";
@include_once WEBAPPS_PATH . "userGroupsAdmin/functions.php";

$showAdminLink = false;
if (defined('GROUP_ANY_WEBAPP'))
    if (($wpUser = gDoesUserHaveAccessWP( GROUP_ANY_WEBAPP )) !== false){
        $showAdminLink = true;
    }
?>
<header class="page-row" role="banner">
    <nav class="navbar navbar-static-top navbar-mega-inverse" role="navigation">
        <div class="container-fluid">
            <div class="navbar-header">
                <a class="navbar-brand" href="<?php echo get_settings('home'); ?>/#/home">
                    <img src="<?php print get_template_directory_uri(); ?>/assets/img/new-ualib-logo.png" class="hidden-xs" rel="home" alt="University of Alabama Libraries"/>
                    <span class="visible-xs">UA Libraries</span>
                </a>
            </div>
            <div>
                <ul class="nav navbar-nav navbar-right">
                    <?php if ($showAdminLink): ?>
                        <li class="dropdown yamm-fw">
                            <a href="<?php echo site_url(); ?>/user-groups-admin/" class="icon-only" title="WebApps Admin">
                                <span class="fa fa-spin fa-cog"></span>
                            </a>
                        </li>
                    <?php endif; ?>
                    <li class="dropdown yamm-fw">
                        <a href="#" class="dropdown-toggle icon-only" title="My Accounts" ng-click="mainNavbarCollapsed = false;">
                            <span class="fa fa-user"></span>
                        </a>
                        <ul class="dropdown-menu">
                            <li>
                                <div class="yamm-content">
                                    <h2>My Accounts</h2>
                                    <div class="row">
                                        <div class="col-xs-12 col-sm-6 col-md-4">
                                            <a class="service-card" href="http://library.ua.edu/vwebv/login">
                                                <h4>My Library (Catalog)</h4>
                                            </a>
                                        </div>

                                        <div class="col-xs-12 col-sm-6 col-md-4">
                                            <a class="service-card" href="https://ua.illiad.oclc.org/illiad/">
                                                <h4>Interlibrary Loan (ILLiad)</h4>
                                            </a>
                                        </div>

                                        <div class="col-xs-12 col-sm-6 col-md-4">
                                            <a class="service-card" href="https://ualearn.blackboard.com/webapps/login/">
                                                <h4>Blackboard Learn</h4>
                                            </a>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-xs-12 col-sm-6 col-md-4">
                                            <a class="service-card" href="https://www.refworks.com/refworks2/Default.aspx">
                                                <h4>RefWorks</h4>
                                            </a>
                                        </div>
                                        <div class="col-xs-12 col-sm-6 col-md-4">
                                            <a class="service-card" href="https://mybama.ua.edu/">
                                                <h4>myBama</h4>
                                            </a>
                                        </div>

                                    </div>
                                </div>
                            </li>
                        </ul>
                    </li>
                    <li class="dropdown yamm-fw" ng-class="{'dropdown-static': (appClass == 'front-page webapp' || appClass == 'bento webapp')}" dropdown-sticky>
                        <a href="#" class="dropdown-toggle icon-only" ng-click="mainNavbarCollapsed = false;">
                            <span class="fa fa-search"></span>
                        </a>
                        <ul class="dropdown-menu onsearch-box">
                            <li>
                                <div class="yamm-content" ng-controller="OneSearchCtrl">
                                    <form ng-submit="search()" class="onesearch-form">

                                        <suggest-one-search prompt="Search journals, articles, books, website, people & more" model="searchText" search="search">

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
                                            <a class="service-card" href="http://lib.ua.edu/scout/">
                                                <span class="fa fa-binoculars"></span>
                                                <h4>Scout</h4>
                                                <p>Use a discovery tool that searches for books, articles, and more   </p>
                                            </a>
                                        </div>
                                        <div class="col-xs-12 col-sm-6 col-md-3">
                                            <a class="service-card" href="http://library.ua.edu/vwebv/searchBasic">
                                                <span class="fa fa-search"></span>
                                                <h4>Libraries' Catalog</h4>
                                                <p>Search the libraries' classic catalog</p>
                                            </a>
                                        </div>
                                        <div class="col-xs-12 col-sm-6 col-md-3">
                                            <a class="service-card" href="<?php echo site_url(); ?>#/databases">
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

                                    </div>
                                    <div class="row">
                                        <div class="col-xs-12 col-sm-6 col-md-3">
                                            <a class="service-card" href="http://guides.lib.ua.edu/">
                                                <span class="fa fa-compass"></span>
                                                <h4>Research Guides</h4>
                                                <p>Explore subject and course specific resources in guides curated by UA librarians</p>
                                            </a>
                                        </div>
                                        <div class="col-xs-12 col-sm-6 col-md-3">
                                            <a class="service-card" href="<?php echo site_url(); ?>/research-help/e-resources/">
                                                <span class="fa fa-bolt"></span>
                                                <h4>Electronic Resources</h4>
                                                <p>Explore the libraries' e-book and e-journal collections </p>
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
                                                <span class="fa fa-bar-chart"></span>
                                                <h4>Government Information, Statistics, and Data</h4>
                                                <p>Explore our large collection of U.S. Federal documents</p>
                                            </a>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-xs-12 col-sm-6 col-md-3">
                                            <div class="service-list">
                                                <span class="fa fa-music"></span>
                                                <h4>Music Library</h4>
                                                <ul>
                                                    <li class="menu-video-database-search"><a href="<?php echo site_url(); ?>/#videos">Video Database Search</a></li>
                                                    <li class="menu-research-guides"><a href="http://guides.lib.ua.edu/visualperformingarts">Research Guides</a></li>
                                                    <li class="menu-home"><a href="<?php echo site_url(); ?>/libraries/music-library/">Music Library Home</a></li>
                                                </ul>
                                            </div>
                                        </div>

                                        <div class="col-xs-12 col-sm-6 col-md-3">
                                            <div class="service-list">
                                                <span class="fa fa-search-plus"></span>
                                                <h4>Division of Special Collections</h4>
                                                <ul>
                                                    <li class="menu-acumen"><a href="http://acumen.lib.ua.edu/home">Acumen Digital Archives</a></li>
                                                    <li class="menu-hoole"><a href="<?php echo site_url(); ?>/libraries/hoole-library/">Hoole Special Collections</a></li>
                                                    <li class="menu-williams"><a href="<?php echo site_url(); ?>/collections/williams/">Williams Collection</a></li>
                                                </ul>
                                            </div>
                                        </div>

                                        <div class="col-xs-12 col-sm-6 col-md-3">
                                            <a class="service-card" href="<?php echo site_url(); ?>/research-tools/refworks/">
                                                <span class="fa fa-folder"></span>
                                                <h4>RefWorks</h4>
                                                <p>Save citations, organize your research, and create bibliographies</p>
                                            </a>
                                        </div>
                                        <div class="col-xs-12 col-sm-6 col-md-3">
                                            <a class="service-card" href="<?php echo site_url(); ?>/research-tools/citation-finder/">
                                                <span class="fa fa-quote-left"></span>
                                                <h4>Citation Finder</h4>
                                                <p>A quick tool to help you locate articles with citation information</p>
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
                                                    <li><a href="<?php echo site_url(); ?>/using-the-library/photocopying/">Print, Scan, Copy</a></li>
                                                    <li class="menu-computer-availability"><a href="http://www.lib.ua.edu/computers">Computer Availability</a></li>
                                                    <li class="menu-laptop-computers"><a href="<?php echo site_url(); ?>/using-the-library/equipment/">Equipment</a></li>
                                                    <li class="menu-library-software-list"><a href="<?php echo site_url(); ?>/#software">Library Software List</a></li>

                                                </ul>
                                            </div>
                                            <a class="service-card" href="<?php echo site_url(); ?>/using-the-library/circulation-services/borrowing//">
                                                <span class="fa fa-book"></span>
                                                <h4>Borrow, Renew, and Course Reserves</h4>
                                                <p>Check out library materials and find instructor provided resources for your class</p>
                                            </a>
                                        </div>
                                        <div class="col-xs-12 col-sm-6 col-md-9">
                                            <div class="row">
                                                <div class="col-sm-12 col-md-4">
                                                    <a class="service-card" href="<?php echo site_url(); ?>/using-the-library/interlibrary-borrowing/">
                                                        <span class="fa fa-exchange"></span>
                                                        <h4>Interlibrary Borrowing</h4>
                                                        <p>Borrow materials owned by other libraries</p>
                                                    </a>
                                                </div>
                                                <div class="col-sm-12 col-md-4">
                                                    <a class="service-card" href="<?php echo site_url(); ?>/using-the-library/sanford-media-center/">
                                                        <span class="fa fa-cubes"></span>
                                                        <h4>Sanford Media Center</h4>
                                                        <p>A leading-edge facility for digital media production </p>
                                                    </a>
                                                </div>
                                                <div class="col-sm-12 col-md-4">
                                                    <a class="service-card" href="<?php echo site_url(); ?>/using-the-library/digital-humanities-center/">
                                                        <span class="fa fa-tachometer"></span>
                                                        <h4>Digital Humanities Center</h4>
                                                        <p>Explore the digital humanities with innovative research and teaching projects </p>
                                                    </a>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-sm-12 col-md-4">
                                                    <a class="service-card" href=" <?php echo site_url(); ?>/using-the-library/find-a-place-to-study/">
                                                        <span class="fa fa-lightbulb-o"></span>
                                                        <h4>Find a Place to Study</h4>
                                                        <p>Find the best spaces to study at libraries, listed by noise level </p>
                                                    </a>
                                                </div>
                                                <div class="col-sm-12 col-md-4">
                                                    <a class="service-card" href="<?php echo site_url(); ?>/using-the-library/presentation-practice-rooms/">
                                                        <span class="fa fa-area-chart"></span>
                                                        <h4>Presentation Practice Rooms</h4>
                                                        <p>Facilities and equipment to help you prepare for presentations </p>
                                                    </a>
                                                </div>
                                                <div class="col-sm-12 col-md-4">
                                                    <a class="service-card" href="<?php echo site_url(); ?>/using-the-library/library-instruction/">
                                                        <span class="fa fa-calendar"></span>
                                                        <h4>Classes and Workshops</h4>
                                                        <p>Register for instruction sessions and outreach opportunities</p>
                                                    </a>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-sm-12 col-md-4">
                                                    <a class="service-card" href="<?php echo site_url(); ?>/using-the-library/accessibility/">
                                                        <span class="fa fa-wheelchair"></span>
                                                        <h4>Accessibility</h4>
                                                        <p>Library services and access for users with disabilities</p>
                                                    </a>
                                                </div>
                                                <div class="col-sm-12 col-md-4">
                                                    <a class="service-card" href="<?php echo site_url(); ?>/using-the-library/information-for-faculty/">
                                                        <span class="fa fa-graduation-cap"></span>
                                                        <h4>Information for Faculty</h4>
                                                        <p>Purchases, teaching, and research support</p>
                                                    </a>
                                                </div>
                                                <div class="col-sm-12 col-md-4">
                                                    <a class="service-card" href="<?php echo site_url(); ?>/using-the-library/information-for-students/">
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
                                            <a class="service-card" href="<?php echo site_url(); ?>/#/hours">
                                                <span class="fa fa-clock-o"></span>
                                                <h4>Hours</h4>
                                                <p>Library hours and locations</p>
                                            </a>
                                        </div>
                                        <div class="col-xs-12 col-sm-6 col-md-3">
                                            <a class="service-card" href="<?php echo site_url(); ?>/#/staffdir">
                                                <span class="fa fa-users"></span>
                                                <h4>Directory</h4>
                                                <p>UA Libraries Faculty and Staff</p>
                                            </a>
                                        </div>
                                        <div class="col-xs-12 col-sm-6 col-md-3">
                                            <a class="service-card" href="<?php echo site_url(); ?>/#/news-exhibits/">
                                                <span class="fa fa-newspaper-o"></span>
                                                <h4>News and Events</h4>
                                                <p>The latest news and upcoming events at the libraries</p>
                                            </a>
                                        </div>
                                        <div class="col-xs-12 col-sm-6 col-md-3">
                                            <a class="service-card" href="<?php echo site_url(); ?>/about/about-the-libraries/">
                                                <span class="fa fa-university"></span>
                                                <h4>About the Libraries</h4>
                                                <p>Information about each of our branch libraries</p>
                                            </a>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-xs-12 col-sm-6 col-md-3">
                                            <a class="service-card" href="<?php echo site_url(); ?>/about/library-annex/">
                                                <span class="fa fa-building"></span>
                                                <h4>Library Annex</h4>
                                                <p>Supplemental library collections located off campus</p>
                                            </a>
                                        </div>
                                        <div class="col-xs-12 col-sm-6 col-md-3">
                                            <a class="service-card" href="<?php echo site_url(); ?>/about/libraries-policies/">
                                                <span class="fa fa-sitemap"></span>
                                                <h4>Policies</h4>
                                                <p>Learn about libraries' policies and procedures</p>
                                            </a>
                                        </div>
                                        <div class="col-xs-12 col-sm-6 col-md-3">
                                            <a class="service-card" href="<?php echo site_url(); ?>/about/social-media/">
                                                <span class="fa fa-share-alt"></span>
                                                <h4>Social Media</h4>
                                                <p>Explore the libraries' multiple social media outlets </p>
                                            </a>
                                        </div>
                                        <div class="col-xs-12 col-sm-6 col-md-3">
                                            <a class="service-card" href="<?php echo site_url(); ?>/about/support-ua-libraries/">
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
                                            <div class="service-list">
                                                <span class="fa fa-question-circle"></span>
                                                <h4>How Do I...</h4>
                                                <ul>
                                                    <li><a href="<?php echo site_url(); ?>/library-help/how-do-i/">Ask A Librarian: FAQs</a></li>
                                                    <li><a href="<?php echo site_url(); ?>/forms/reference-request/">Ask A Librarian: Reference Questions</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div class="col-xs-12 col-sm-6 col-md-3">
                                            <a class="service-card" href="<?php echo site_url(); ?>/#/staffdir?selector=1">
                                                <span class="fa fa-comment-o"></span>
                                                <h4>Subject Specialists</h4>
                                                <p>Need research help? Reach out to your subject librarian</p>
                                            </a>
                                        </div>
                                        <div class="col-xs-12 col-sm-6 col-md-3">
                                            <a class="service-card" href="<?php echo site_url(); ?>/library-help/tutorials/">
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
                                            <a class="service-card" href="<?php echo site_url(); ?>/forms/reference-request/">
                                                <span class="fa fa-comments-o"></span>
                                                <h4>Request a Research Consultation</h4>
                                                <p>Meet with a specialist for in-depth research assistance</p>
                                            </a>
                                        </div>
                                        <div class="col-xs-12 col-sm-6 col-md-3">
                                            <a class="service-card" href="<?php echo site_url(); ?>/forms/login-problem-report-form/">
                                                <span class="fa fa-sign-in"></span>
                                                <h4>Report a Login Problem</h4>
                                                <p>Contact the libraries with problems accessing our online resources </p>
                                            </a>
                                        </div>
                                        <div class="col-xs-12 col-sm-6 col-md-3">
                                            <a class="service-card" href="<?php echo site_url(); ?>/library-help/kacecontact-form/">
                                                <span class="fa fa-envelope"></span>
                                                <h4>Run into Website Issues?</h4>
                                                <p>Please contact Web Services for help </p>
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
