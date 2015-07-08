<?php get_template_part('templates/head'); ?>
<body <?php body_class(); ?> ng-class="appClass">

  <!--[if lt IE 8]>
    <div class="alert alert-warning">
      <?php _e('You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.', 'roots'); ?>
    </div>
  <![endif]-->

  <?php
    do_action('get_header');
    get_template_part('templates/header');
  ?>

  <?php //if (is_front_page()) get_template_part('templates/home-tmp'); ?>

  <div class="wrap page-row page-row-expanded">
    <div role="document">
      <?php
        $fields = get_fields();
        if (is_array($fields['jumbotron_header'])){

            get_template_part('templates/jumbotron-header');
        }
      ?>
      <div class="content container">
        <main class="main" role="main">
            <?php
                if(isset($fields['multipage_menu'])){
                    set_query_var('multipage_menu', $fields['multipage_menu']);
                    get_template_part('templates/content', 'page-submenu');
                }
            else{
                include roots_template_path();
            }
            ?>
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

      ga('create', 'UA-2255842-23', 'auto');
      ga('send', 'pageview');
  </script>

</body>
</html>
