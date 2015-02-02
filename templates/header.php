<header class="navbar navbar-static-top navbar-ualib" role="banner">
  <div class="container-fluid">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-collapse">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="<?php echo esc_url(home_url('/')); ?>" style="max-width: 210px;">
          <img src="/wp-content/uploads/2015/01/ualib-logo-textonly-inverse.png" class="img-responsive header-logo" width="210" height="75">
      </a>
    </div>

    <nav class="collapse navbar-collapse ualib-navbar-collapse yamm" role="navigaiton">
      <?php if (!is_front_page()): ?>
        <ul class="nav navbar-nav navbar-right">
            <li class="dropdown yamm-fw icon-only">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown" data-target="#"><span class="fa fa-search"></span></a>
                <ul class="dropdown-menu">
                    <li>
                        <div class="yamm-content">
                            <div class="container">
                                <form action="/sample-page/onesearch/">
                                    <div class="input-group input-group-lg">
                                        <input type="text" name="search" class="form-control onesearch-text" placeholder="Search all library resources">
                                        <div class="input-group-btn">
                                            <button type="submit" class="btn btn-onesearch btn-primary"><span class="fa fa-search"></span></button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </li>
                </ul>
            </li>
        </ul>
      <?php endif; ?>
      <?php
        if (has_nav_menu('primary_navigation')) :
          wp_nav_menu(array('theme_location' => 'primary_navigation',  'depth' => 3, 'menu_class' => 'nav navbar-nav navbar-main navbar-right'));
        endif;
      ?>
    </nav>
  </div>
</header>
<?php if (is_front_page()): ?>
    <div class="home-slice-main" ng-app="hours">

        <div class="onesearch-container">
            <div class="container">
                <form action="/sample-page/onesearch/">
                    <div class="input-group input-group-lg">
                        <input type="text" name="search" class="form-control onesearch-text" placeholder="Search all library resources">
                        <div class="input-group-btn">
                            <button type="submit" class="btn btn-onesearch btn-primary"><span class="fa fa-search"></span></button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        <div class="container">
            <div class="row home-slice">
                <div class="col-sm-6">
                    <img class="well" data-src="holder.js/100%x374/text:News Item 1">
                </div>
                <div class="col-sm-6">
                    <div class="hours-list well"></div>
                </div>
            </div>
        </div>
    </div>
<?php endif; ?>
