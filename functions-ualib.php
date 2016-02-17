<?php
define( 'WEBAPPS_PATH', '/srv/web/www/webapps/' );
function roots_ualib_scripts() {
//local script added to allow communication between WP API and JS front end apps
    wp_enqueue_script(
        'localScript' ,
        get_template_directory_uri() . '/assets/js/local.js'
    );
    wp_localize_script(
        'localScript',
        'myLocalized',
        array(
            'partials' => trailingslashit( get_template_directory_uri() ) . 'partials/',
            'nonce' => wp_create_nonce( 'wp_rest' )
        )
    );
}
function add_manage_admin_bar_link() {
    global $wp_admin_bar;
    @include_once WEBAPPS_PATH . "userGroupsAdmin/constants.php";
    @include_once WEBAPPS_PATH . "userGroupsAdmin/functions.php";
    if (!defined('GROUP_ANY_WEBAPP'))
        return;
    if (($wpUser = gDoesUserHaveAccessWP( GROUP_ANY_WEBAPP )) !== false) {
        $wp_admin_bar->add_menu(array(
            'id' => 'manage_link',
            'title' => __('<span class="ab-icon dashicons-before dashicons-feedback"></span> UA Lib WebApps'),
            'href' => __(site_url() . "/#/manage-user-groups")
        ));
        $wp_admin_bar->add_menu( array(
            'id' => 'manage_profile_link',
            'title' => __( '<span class="ab-icon dashicons-before dashicons-welcome-write-blog"></span> Edit Profile'),
            'href' => __(site_url()."/#/manage-my-profile"),
            'parent' => 'manage_link',
        ));
    } else {
        $wp_admin_bar->add_menu( array(
            'id' => 'manage_profile_link',
            'title' => __( '<span class="ab-icon dashicons-before dashicons-welcome-write-blog"></span> Edit Profile'),
            'href' => __(site_url()."/#/manage-my-profile"),
        ));
    }
    if (($wpUser = gDoesUserHaveAccessWP( GROUP_ONESEARCH)) !== false) {
        $wp_admin_bar->add_menu( array(
            'id' => 'manage_onesearch_link',
            'title' => __( '<span class="ab-icon dashicons-before dashicons-search"></span> oneSearch'),
            'href' => __(site_url()."/#/manage-onesearch"),
            'parent' => 'manage_link',
        ) );
    }
    if (($wpUser = gDoesUserHaveAccessWP( GROUP_ADMIN )) !== false) {
        $wp_admin_bar->add_menu( array(
            'id' => 'manage_users_link',
            'title' => __( '<span class="ab-icon dashicons-before dashicons-lock"></span> Permissions'),
            'href' => __(site_url()."/#/manage-user-groups"),
            'parent' => 'manage_link',
        ) );
    }
    if (($wpUser = gDoesUserHaveAccessWP( GROUP_HOURS )) !== false) {
        $wp_admin_bar->add_menu( array(
            'id' => 'manage_hours_link',
            'title' => __( '<span class="ab-icon dashicons-before dashicons-clock"></span> Library Hours'),
            'href' => __(site_url()."/#/manage-hours"),
            'parent' => 'manage_link',
        ) );
    }
    if (($wpUser = gDoesUserHaveAccessWP( GROUP_STAFFDIR )) !== false) {
        $wp_admin_bar->add_menu( array(
            'id' => 'manage_staffdir_link',
            'title' => __( '<span class="ab-icon dashicons-before dashicons-groups"></span> Staff Directory'),
            'href' => __(site_url()."/#/manage-staff-directory"),
            'parent' => 'manage_link',
        ) );
    }
    if (($wpUser = gDoesUserHaveAccessWP( GROUP_DATABASES )) !== false) {
        $wp_admin_bar->add_menu( array(
            'id' => 'manage_databases_link',
            'title' => __( '<span class="ab-icon dashicons-before dashicons-networking"></span> Databases'),
            'href' => __(site_url()."/#/manage-databases"),
            'parent' => 'manage_link',
        ) );
    }
    if (($wpUser = gDoesUserHaveAccessWP( GROUP_SOFTWARE )) !== false) {
        $wp_admin_bar->add_menu( array(
            'id' => 'manage_software_link',
            'title' => __( '<span class="ab-icon dashicons-before dashicons-analytics"></span> Software'),
            'href' => __(site_url()."/#/manage-software"),
            'parent' => 'manage_link',
        ) );
    }
    if (($wpUser = gDoesUserHaveAccessWP( GROUP_FORMS )) !== false) {
        $wp_admin_bar->add_menu( array(
            'id' => 'manage_forms_link',
            'title' => __( '<span class="ab-icon dashicons-before dashicons-clipboard"></span> Forms'),
            'href' => __(site_url()."/#/manage-forms"),
            'parent' => 'manage_link',
        ) );
    }
    if (($wpUser = gDoesUserHaveAccessWP( GROUP_NEWS )) !== false) {
        $wp_admin_bar->add_menu( array(
            'id' => 'manage_news_link',
            'title' => __( '<span class="ab-icon dashicons-before dashicons-calendar"></span> News &amp; Exhibits'),
            'href' => __(site_url()."/#/manage-news"),
            'parent' => 'manage_link',
        ) );
    }
    if (($wpUser = gDoesUserHaveAccessWP( GROUP_ALERTS )) !== false) {
        $wp_admin_bar->add_menu( array(
            'id' => 'manage_alerts_link',
            'title' => __( '<span class="ab-icon dashicons-before dashicons-megaphone"></span> Alerts'),
            'href' => __(site_url()."/#/manage-alerts"),
            'parent' => 'manage_link',
        ) );
    }
}
add_action('admin_bar_menu', 'add_manage_admin_bar_link',999);
// Add css for custom admin_bar_link to style the icon
// ... This is dumb and hacky. Icons should be configurable in a menu system
// that uses icons itself. I'm still having trouble warming up to WP, <3 Will Jones
function custom_menu_css() {
    $custom_menu_css = '<style type="text/css">
        #wpadminbar #wp-admin-bar-manage_link .ab-submenu li { clear: both; }
    </style>';
    echo $custom_menu_css;
}
add_action( 'admin_head', 'custom_menu_css' );
add_action( 'wp_head', 'custom_menu_css' );
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

//Feedzy commands
function bweb_feedzy_readmore( $content, $link, $feedURL ) {
    $content = str_replace( '[…]', '<a href="' . $link . '" target="_blank">' . __('More', 'yourTextDomain') . ' &rarr;</a>', $content );
    $content = str_replace('Continue reading &rarr', '', $content);
    return $content;
}
add_filter( 'feedzy_summary_output', 'bweb_feedzy_readmore', 9, 3 );
add_action( 'wp_enqueue_scripts', 'roots_ualib_scripts' );
