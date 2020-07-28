<?php the_content(); ?>
<?php
      $current_url = home_url( '/' );

      if ($current_url == 'https://wwwdev2.lib.ua.edu/') {
          $intranet_path = '/intranet/inc';
      } else if ($current_url == 'https://www.lib.ua.edu/') {
          $intranet_path = '/intranet/inc/dest';
      }

      if(is_page( array('circ-trace-form-result',
'studentemployeerequest-result', 'incidentreport-result', 'actcardform-result',
'voyager-request-result', 'tech-request-form-result') ))
        require_once get_stylesheet_directory() . '/intranet/assets/incidentreport/class.phpmailer.php';

      if(is_page('circ-trace-form-result'))
        require_once get_stylesheet_directory() . $intranet_path . '/circ-trace-form-result.php';

      if(is_page('studentemployeerequest-result'))
        require_once get_stylesheet_directory() . $intranet_path . '/studentemployeerequest-result.php';

      if(is_page('actcardform-result'))
        require_once get_stylesheet_directory() . $intranet_path . '/actcardform-result.php';

      if(is_page('voyager-request')) {
        require_once get_stylesheet_directory() . '/intranet/inc/openfiles.php';
        require_once get_stylesheet_directory() . '/intranet/inc/voyager-request.php';
      }

      if(is_page('voyager-request-result'))
        require_once get_stylesheet_directory() . $intranet_path . '/voyager-request-result.php';

      if(is_page('incidentreport-result')) {
        require_once get_stylesheet_directory() . '/intranet/inc/incidentreport-result.php';
      }

      if(is_page('tech-request-form'))
        require_once get_stylesheet_directory() . $intranet_path . '/tech-request-form.php';

      if(is_page('tech-request-form-result'))
        require_once get_stylesheet_directory() . $intranet_path . '/tech-request-form-result.php';

      if(is_page('security-authorization-form'))
        require_once get_stylesheet_directory() . $intranet_path . '/sec-auth-form.php';

      if(is_page('security-authorization-form-landing'))
        require_once get_stylesheet_directory() . '/intranet/inc/sec-auth-form-landing.php';

      if(is_page('delete-form'))
        require_once get_stylesheet_directory() . $intranet_path . '/delete-form.php';

      if(is_page('delete-form-landing'))
        require_once get_stylesheet_directory() . '/intranet/inc/delete-form-landing.php';

      if(is_page('voyager-only-form'))
        require_once get_stylesheet_directory() . $intranet_path . '/voyager-only-form.php';

      if(is_page('voyager-only-form-landing'))
        require_once get_stylesheet_directory() . '/intranet/inc/voyager-only-form-landing.php';


    ?>
<?php wp_link_pages(array('before' => '<nav class="pagination">', 'after' => '</nav>')); ?>
