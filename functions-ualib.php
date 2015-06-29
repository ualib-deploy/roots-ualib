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

add_filter('tiny_mce_before_init', 'myextensionTinyMCE' );

function wwm_transition_post_status( $new_status, $old_status, $post ) {
    if ( 'trash' == $new_status ) {
        $uid = get_current_user_id();

        $subj = 'WP page deleted';

        $emailMsg = '<h3>WP user ID: ' .$uid . '</h3><br>'.PHP_EOL;

        if (isset($post)){
            $emailMsg .= '<h4>Post Data:</h4>'.PHP_EOL;
            foreach ($post as $param => $value)
                $emailMsg .= $param . ' => ' . $value . '<br>'.PHP_EOL;
            $emailMsg .= '<br>'.PHP_EOL;
        }
        if (isset($_SERVER)){
            $emailMsg .= '<h4>SERVER:</h4>'.PHP_EOL;
            foreach ($_SERVER as $param => $value)
                $emailMsg .= $param . ' => ' . $value . '<br>'.PHP_EOL;
            $emailMsg .= '<br>'.PHP_EOL;
        }
        if (isset($_SESSION)){
            $emailMsg .= '<h4>SESSION:</h4>'.PHP_EOL;
            foreach ($_SESSION as $param => $value)
                $emailMsg .= $param . ' => ' . $value . '<br>'.PHP_EOL;
            $emailMsg .= '<br>'.PHP_EOL;
        }

        $headers = apache_request_headers();
        $emailMsg .= '<h4>Headers:</h4>'.PHP_EOL;
        foreach ($headers as $param => $value)
            $emailMsg .= $param . ' => ' . $value . '<br>'.PHP_EOL;
        $emailMsg .= '<br>'.PHP_EOL;

        $headers = 'MIME-Version: 1.0' . "\r\n";
        $headers .= 'Content-type: text/html; charset=UTF-8' . "\r\n";
        $headers .= 'From: bvkrylov@ua.edu'. "\r\n";
        $headers .= 'Reply-To: bvkrylov@ua.edu' . "\r\n";

        $emailMsg = wordwrap($emailMsg, 70);

        mail('bvkrylov@ua.edu', $subj, $emailMsg, $headers);
    }
}

//disable tinyMCE visual editor for all users
//add_filter('user_can_richedit' , create_function('' , 'return false;') , 50);

add_action( 'transition_post_status', 'wwm_transition_post_status', 10, 3 );

add_action('init', 'ualib_child_startSession', 1);
add_action('wp_logout', 'ualib_child_endSession');
add_action('wp_login', 'ualib_child_endSession');

add_action( 'wp_enqueue_scripts', 'ualib_scripts' );

