<?php

define( 'WEBAPPS_PATH', '/srv/web/www/webapps/' );

function ualib_getDomain()
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

function ualib_scripts() {
  /*wp_register_script(
    'angular',
    '//ajax.googleapis.com/ajax/libs/angularjs/1.2.26/angular.min.js',
    array( 'jquery' ),
    true
  );
  wp_register_script(
    'ui-bootstrap',
    '//angular-ui.github.io/bootstrap/ui-bootstrap-tpls-0.11.0.js',
    array( 'angular' ),
    true
  );*/
  if ( is_page('hours') )
  {
    wp_enqueue_script(
      'GoogleMapAPI',
      '//maps.googleapis.com/maps/api/js?key=AIzaSyDCIMNYW9I2NfZfh83u-NRPUgHlUG51Hfc'
    );
    wp_enqueue_script(
      'ualib-child-scriptHours',
      ualib_getDomain() . 'libhours2/js/app.js',
      array( 'angular' ),
      true
    );
  }
  if ( is_page('music-library-search') )
    wp_enqueue_script(
      'ualib-child-scriptMusicSearch',
      ualib_getDomain() . 'musicsearch/js/app.js',
      array( 'angular' ),
      true
    );
  if ( is_page('staff-directory') )
    wp_enqueue_script(
      'ualib-child-scriptStaffDirectory',
      ualib_getDomain() . 'staffDir/js/app.js',
      array( 'angular' ),
      true
    );
    wp_enqueue_script(
      'ualib-child-scriptOneSearchFilters',
      ualib_getDomain() . 'oneSearch/js/filters.js',
      array( 'angular' ),
      true
    );
  }
  if ( is_page('databases') )
    wp_enqueue_script(
      'ualib-child-scriptDatabases',
      ualib_getDomain() . 'databases/js/app.js',
      array( 'angular' ),
      true
    );
  if ( is_page('user-groups-admin') )
    wp_enqueue_script(
      'ualib-child-scriptUserGroups',
      ualib_getDomain() . 'userGroupsAdmin/js/app.js',
      array( 'angular' ),
      true
    );
  if ( is_page('site-feedback') )
    wp_enqueue_script(
      'ualib-child-siteFeedback',
      ualib_getDomain() . 'siteSurvey/js/app.js',
      array( 'angular' ),
      true
    );

}

function ualib_demo_scripts(){

  if ( is_page('search') )
  {
    wp_enqueue_script('ng', 'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.0/angular.min.js', array(), false, true);
    wp_enqueue_script('ngAnimate', 'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.0/angular-animate.min.js', array('ng'), false, true);
    wp_enqueue_script('ngSanitize', 'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.0/angular-sanitize.js', array('ng'), false, true);
    wp_enqueue_script('angular-filter', 'https://cdnjs.cloudflare.com/ajax/libs/angular-filter/0.5.1/angular-filter.js', array('ng'), false, true);
    wp_enqueue_script('ui-bootstrap-12', 'https://rawgit.com/angular-ui/bootstrap/gh-pages/ui-bootstrap-tpls-0.12.0.min.js', array('ng'), false, true);
    wp_enqueue_script(
      'oneSearchTpl',
      ualib_getDomain() . 'oneSearch/will-test/onesearch-templates.js',
      array(),
      false,
      true
    );
    wp_enqueue_script(
      'oneSearch',
      ualib_getDomain() . 'oneSearch/will-test/onesearch.js',
      array(),
      false,
      true
    );
    wp_enqueue_style(
      'oneSearchStyles',
      ualib_getDomain() . 'oneSearch/will-test/onesearch.css',
      false,
      null
    );
  }
}


remove_filter('the_content', 'wpautop');
remove_filter('the_excerpt', 'wpautop');

add_action('init', 'ualib_child_startSession', 1);
add_action('wp_logout', 'ualib_child_endSession');
add_action('wp_login', 'ualib_child_endSession');

add_action( 'wp_enqueue_scripts', 'ualib_scripts' );
//add_action( 'wp_enqueue_scripts', 'ualib_demo_scripts' );
