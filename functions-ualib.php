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
    if ( is_page('news-and-exhibitions') )
        wp_enqueue_script(
            'tinyMCE',
            '//tinymce.cachefly.net/4.0/tinymce.min.js'
        );
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
    $valid = '*[*]';
    $invalid = 'script';

    $init['valid_elements'] = $valid;
    $init['extended_valid_elements'] = $valid;

    $init['invalid_elements'] = $invalid;

    return $init;
}

//disable tinyMCE visual editor for all users
//add_filter('user_can_richedit' , create_function('' , 'return false;') , 50);

add_action( 'transition_post_status', 'wwm_transition_post_status', 10, 3 );

add_action('init', 'ualib_child_startSession', 1);
add_action('wp_logout', 'ualib_child_endSession');
add_action('wp_login', 'ualib_child_endSession');

add_action( 'wp_enqueue_scripts', 'ualib_scripts' );

