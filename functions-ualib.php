<?php
define( 'WEBAPPS_PATH', '/srv/web/www/webapps/' );

function ualib_child_startSession() {
  if(!session_id())
    session_start();
}

function ualib_child_endSession() {
  session_destroy ();
}

function ualib_scripts() {
  if ( is_page('hours') )
    wp_enqueue_script(
      'GoogleMapAPI',
      '//maps.googleapis.com/maps/api/js?key=AIzaSyDCIMNYW9I2NfZfh83u-NRPUgHlUG51Hfc'
    );
}

//TinyMCE commands
remove_filter('the_content', 'wpautop');
remove_filter('the_excerpt', 'wpautop');
function myextensionTinyMCE($init) {
    $ext = 'span[id|name|class|style],div[id|name|class|style],p[id|name|class|style]';

    if ( isset( $init['valid_elements'] ) ) {
        $init['valid_elements'] .= ',' . $ext;
    } else {
        $init['valid_elements'] = $ext;
    }
    if ( isset( $init['extended_valid_elements'] ) ) {
        $init['extended_valid_elements'] .= ',' . $ext;
    } else {
        $init['extended_valid_elements'] = $ext;
    }

    return $init;
}

add_filter('tiny_mce_before_init', 'myextensionTinyMCE' );

//disable tinyMCE visual editor for all users
//add_filter('user_can_richedit' , create_function('' , 'return false;') , 50);

add_action('init', 'ualib_child_startSession', 1);
add_action('wp_logout', 'ualib_child_endSession');
add_action('wp_login', 'ualib_child_endSession');

add_action( 'wp_enqueue_scripts', 'ualib_scripts' );

