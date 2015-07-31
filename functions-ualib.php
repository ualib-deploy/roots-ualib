<?php
define( 'WEBAPPS_PATH', '/srv/web/www/webapps/' );

function roots_ualib_startSession() {
  if(!session_id())
    session_start();
}

function roots_ualib_endSession() {
  session_destroy ();
}

function roots_ualib_scripts() {
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

function add_manage_admin_bar_link() {
    global $wp_admin_bar;
    if ( !is_super_admin() || !is_admin_bar_showing() )
        return;

    @include_once WEBAPPS_PATH . "userGroupsAdmin/constants.php";
    @include_once WEBAPPS_PATH . "userGroupsAdmin/functions.php";

    if (!defined('GROUP_ANY_WEBAPP'))
        return;

    if (($wpUser = gDoesUserHaveAccessWP( GROUP_ANY_WEBAPP )) !== false){
        $wp_admin_bar->add_menu( array(
            'id' => 'manage_link',
            'title' => __( 'WebApps'),
            'href' => __(site_url()."/sample-page/user-groups-admin/")
        ) );
    }
}
add_action('admin_bar_menu', 'add_manage_admin_bar_link',25);

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

add_filter('tiny_mce_before_init', 'myextensionTinyMCE' );

//disable tinyMCE visual editor for all users
//add_filter('user_can_richedit' , create_function('' , 'return false;') , 50);

add_action('init', 'roots_ualib_startSession', 1);
add_action('wp_login', 'roots_ualib_endSession');
add_action('wp_logout', 'roots_ualib_endSession');

add_action( 'wp_enqueue_scripts', 'roots_ualib_scripts' );

