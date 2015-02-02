<?php

function ualib_child_getUnixPath()
{
    return "/srv/web/www/webapps/";
}

function ualib_child_getDomain()
{
    return "//wwwdev2.lib.ua.edu/";
}

function ualib_child_startSession() {
    if(!session_id()) {
        session_start();
    }
}

function ualib_child_endSession() {
    session_destroy ();
}

function ualib_child_scripts() {
    wp_enqueue_script(
        'angular',
        '//ajax.googleapis.com/ajax/libs/angularjs/1.2.26/angular.min.js',
        array( 'jquery' ),
        true
    );
    wp_enqueue_script(
        'ui-bootstrap',
        '//angular-ui.github.io/bootstrap/ui-bootstrap-tpls-0.11.0.js',
        array( 'angular' ),
        true
    );
    if ( is_page('hm-test') )
    {
        wp_enqueue_script(
            'ualib-child-scriptHoursManagement',
            ualib_child_getDomain() . 'libhours2/js/manage-app.js',
            array( 'angular' ),
            true
        );
    }
    if ( is_page('hours-admin') )
    {
        wp_enqueue_script(
            'ualib-child-scriptUsersManagement',
            ualib_child_getDomain() . 'libhours2/js/admin-app.js',
            array( 'angular' ),
            true
        );
    }
    if ( is_page('hours') )
    {
        wp_enqueue_script(
            'GoogleMapAPI',
            '//maps.googleapis.com/maps/api/js?key=AIzaSyDCIMNYW9I2NfZfh83u-NRPUgHlUG51Hfc'
        );
        wp_enqueue_script(
            'ualib-child-scriptHours',
            ualib_child_getDomain() . 'libhours2/js/app.js',
            array( 'angular' ),
            true
        );
    }
    if ( is_page('music-library-search') )
        wp_enqueue_script(
            'ualib-child-scriptMusicSearch',
            ualib_child_getDomain() . 'musicsearch/js/app.js',
            array( 'angular' ),
            true
        );
    if ( is_page('staff-directory') )
        wp_enqueue_script(
            'ualib-child-scriptStaffDirectory',
            ualib_child_getDomain() . 'staffDir/js/app.js',
            array( 'angular' ),
            true
        );
    if ( is_page('onesearch') )
    {
        wp_enqueue_script(
            'angular-sanitize',
            '//ajax.googleapis.com/ajax/libs/angularjs/1.2.14/angular-sanitize.js',
            array( 'angular' ),
            true
        );
        wp_enqueue_script(
            'ualib-child-scriptOneSearch',
            ualib_child_getDomain() . 'oneSearch/js/app.js',
            array( 'angular' ),
            true
        );
        wp_enqueue_script(
            'ualib-child-scriptOneSearchFilters',
            ualib_child_getDomain() . 'oneSearch/js/filters.js',
            array( 'angular' ),
            true
        );
    }
    if ( is_page('databases') )
        wp_enqueue_script(
            'ualib-child-scriptDatabases',
            ualib_child_getDomain() . 'databases/js/app.js',
            array( 'angular' ),
            true
        );
    if ( is_page('user-groups-admin') )
        wp_enqueue_script(
            'ualib-child-scriptUserGroups',
            ualib_child_getDomain() . 'userGroupsAdmin/js/app.js',
            array( 'angular' ),
            true
        );

}

add_action('init', 'ualib_child_startSession', 1);
add_action('wp_logout', 'ualib_child_endSession');
add_action('wp_login', 'ualib_child_endSession');

add_action( 'wp_enqueue_scripts', 'ualib_child_scripts' );