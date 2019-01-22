<?php
/**
 * Roots includes
 *
 * The $roots_includes array determines the code library included in your theme.
 * Add or remove files to the array as needed. Supports child theme overrides.
 *
 * Please note that missing files will produce a fatal error.
 *
 * @link https://github.com/roots/roots/pull/1042
 */
require_once( get_stylesheet_directory() . '/functions-ualib.php' );

//Change image library to ImageMagick
add_filter( 'wp_image_editors', 'change_graphic_lib' );

function change_graphic_lib($array) {
    return array('WP_Image_Editor_Imagick');
}

//Include our JWT functions.
require_once "/srv/web/www/webapps/superGlobalPHP/constants.php";
require_once "/srv/web/www/webapps/superGlobalPHP/functions.php";
require_once "/srv/web/www/webapps/superGlobalPHP/keys/jwt.php";

$roots_includes = array(
    'lib/utils.php',           // Utility functions
    'lib/init.php',            // Initial theme setup and constants
    'lib/wrapper.php',         // Theme wrapper class
    'lib/sidebar.php',         // Sidebar class
    'lib/config.php',          // Configuration
    'lib/activation.php',      // Theme activation
    'lib/titles.php',          // Page titles
    'lib/nav.php',             // Custom nav modifications
    'lib/gallery.php',         // Custom [gallery] modifications
    'lib/scripts.php',         // Scripts and stylesheets
    'lib/extras.php',          // Custom functions
);

foreach ($roots_includes as $file) {
    if (!$filepath = locate_template($file)) {
        trigger_error(sprintf(__('Error locating %s for inclusion', 'roots'), $file), E_USER_ERROR);
    }

    require_once $filepath;
}
unset($file, $filepath);

function createToken($userData){
    $userData = gGetUserData($userData);
    return gCreateTokenJWT($userData);
}

//Prevent API calls to non-logged in users
add_filter( 'rest_authentication_errors', function( $result ) {
    if ( ! empty( $result ) ) {
        return $result;
    }
    if ( ! is_user_logged_in() ) {
        return new WP_Error( 'rest_not_logged_in', 'You are not currently logged in.', array( 'status' => 401 ) );
    }
    return $result;
});

//Add fields to users API responses
add_action( 'rest_api_init', function() {
    register_rest_field( 'user', 'token', array(
        'get_callback' => function( $user ) {
            global $wp;
            $request = $wp->request;

            //Match the users/$id and users/me API endpoints.  Calling it elsewhere will trigger an error
            $specificUserAPIPath = preg_match('/\/users\/(me|\d+)/', $request);

            if ($specificUserAPIPath){

                $userData['login'] = $user["nickname"];
                $userData['name'] = $user["name"];
                $userData['email'] = $user["email"];
                $userData['roles'] = $user["roles"];
                $token = createToken($userData);


                return $token;

            }

            return '';


        }
    ) );
    //Make nickname field viewable via context part of schema
    register_rest_field( 'user', 'nickname', array(
        'get_callback' => function( $user ) {
            $nickname = $user["nickname"];
            return $nickname;
        },
        'update_callback' => null,
        'schema'          => array (
            'description' => __( 'Nickname.' ),
            'type'        => 'string',
            'context'     => array ( 'view' ), // Adding `embed` and `view`
            'arg_options' => array (
                'sanitize_callback' => 'sanitize_text_field',
            ),
        ),
    ) );
} );


