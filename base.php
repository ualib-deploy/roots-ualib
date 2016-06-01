<?php get_template_part('templates/head'); ?>
<?php if (WP_ENV === 'development'): ?>
<body <?php body_class(); ?> ng-class="appClass" ng-style="appStyle" ui-scrollfix="80">
<?php else: ?>
<body <?php body_class(); ?> ng-class="appClass" ng-style="appStyle">
<?php endif; ?>
<!-- Google Tag Manager -->
<noscript><iframe src="//www.googletagmanager.com/ns.html?id=GTM-KHJ2CR"
                  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        '//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-KHJ2CR');</script>
<!-- End Google Tag Manager -->

  <!--[if lt IE 8]>
    <div class="alert alert-warning">
      <?php _e('You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.', 'roots'); ?>
    </div>
  <![endif]-->

  <?php
    do_action('get_header');
    if (WP_ENV === 'development'){
        get_template_part('templates/header-fixed');
    }
    else {
        get_template_part('templates/header');
    }
  ?>


  <div class="wrap page-row page-row-expanded">
    <div role="document">
      <?php
        $fields = $fields = function_exists('get_fields') ? get_fields() : null;
        if (is_array($fields['jumbotron_header'])){
            get_template_part('templates/jumbotron-header');
        }
      ?>
      <div class="content">
        <main class="main" role="main">
            <?php if (!is_front_page()): ?>
            <div class="container">
                <?php
                if(isset($fields['multipage_menu']) && $fields['multipage_menu'] !== false){
                    set_query_var('multipage_menu', wp_get_nav_menu_items($fields['multipage_menu']));
                    get_template_part('templates/content-page-submenu');
                }
                else{
                    include roots_template_path();
                }
                ?>
            </div>
            <?php else: ?>
                <div ng-view></div>
            <?php endif; ?>
        </main><!-- /.main -->
          <?php if (roots_display_sidebar()) : ?>
              <aside class="sidebar" role="complementary">
                  <?php include roots_sidebar_path(); ?>
              </aside><!-- /.sidebar -->
          <?php endif; ?>
      </div><!-- /.content -->
    </div><!-- /.wrap -->
  </div>

  <?php get_template_part('templates/footer'); ?>

  <?php wp_footer(); ?>
  <script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
          (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
          m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

      ga('create', 'UA-2255842-1', 'auto');
      ga('require', 'linkid');
      ga('send', 'pageview');
  </script>

</body>
</html>
