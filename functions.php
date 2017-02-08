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

add_action( 'rest_api_init', function() {
    register_rest_field( 'user', 'token', array(
        'get_callback' => function( $user ) {
            global $wp;
            $request = $wp->request;
            $specificUserAPIPath = preg_match('/\/users\/\d+/', $request);

            if ($specificUserAPIPath){

                $userData['login'] = $user["nickname"];
                $userData['name'] = $user["name"];
                $userData['email'] = $user["email"];
                $userData['roles'] = $user["roles"];
                $token = createToken($userData);


                return $token;

            }

            return '';
            //$data = array();
            //return gCreateTokenJWT($userData); 
            /*return "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE0ODU5MDEzNjksInVzZXIiOnsibG9naW4iOiJhbXBhcmtlcjgiLCJuYW1lIjoiQW5kcmV3IFBhcmtlciIsImVtYWlsIjoiYW1wYXJrZXI4QHVhLmVkdSIsInJvbGVzIjpbImFkbWluaXN0cmF0b3IiXSwiZ3JvdXAiOjIwNDcsImlwIjoiMTAuMTE1LjQwLjE0NyIsImhvdXJzIjp7ImxpZCI6WzIsOCw3LDUsNCwzLDFdLCJhZG1pbiI6dHJ1ZX0sIm5ld3MiOnsiYWRtaW4iOmZhbHNlfSwibXlBcHBzIjpbeyJhaWQiOjAsImFwcE5hbWUiOiJBZG1pbmlzdHJhdG9yIiwibGluayI6IlwvI1wvbWFuYWdlLXVzZXItZ3JvdXBzIn0seyJhaWQiOiIxIiwiYXBwTmFtZSI6IkhvdXJzIiwibGluayI6IlwvI1wvbWFuYWdlLWhvdXJzXC8ifSx7ImFpZCI6IjIiLCJhcHBOYW1lIjoiT25lU2VhcmNoIiwibGluayI6IlwvI1wvbWFuYWdlLW9uZXNlYXJjaFwvIn0seyJhaWQiOiIzIiwiYXBwTmFtZSI6IlN0YWZmIERpcmVjdG9yeSIsImxpbmsiOiJcLyNcL3N0YWZmLWRpcmVjdG9yeVwvIn0seyJhaWQiOiI0IiwiYXBwTmFtZSI6IkZlZWRiYWNrIiwibGluayI6IlwvI1wvc2l0ZS1mZWVkYmFja1wvIn0seyJhaWQiOiI1IiwiYXBwTmFtZSI6IkRhdGFiYXNlcyIsImxpbmsiOiJcLyNcL21hbmFnZS1kYXRhYmFzZXNcLyJ9LHsiYWlkIjoiNiIsImFwcE5hbWUiOiJTb2Z0d2FyZVwvQ29tcHV0ZXJzIiwibGluayI6IlwvI1wvbWFuYWdlLXNvZnR3YXJlXC8ifSx7ImFpZCI6IjciLCJhcHBOYW1lIjoiRm9ybXMiLCJsaW5rIjoiXC8jXC9zdWJtaXR0ZWQtZm9ybXNcLyJ9LHsiYWlkIjoiOCIsImFwcE5hbWUiOiJOZXdzIiwibGluayI6IlwvI1wvbmV3cy1hbmQtZXhoaWJpdGlvbnNcLyJ9LHsiYWlkIjoiOSIsImFwcE5hbWUiOiJBbGVydHMiLCJsaW5rIjoiXC8jXC9tYW5hZ2UtYWxlcnRzIn0seyJhaWQiOiIxMCIsImFwcE5hbWUiOiJFUiBDYXJvdXNlbCIsImxpbmsiOiJcLyNcL21hbmFnZS1lcmMifV19fQ.JrBlwc-kUPdL_7ng_IiyB43AzBJeO2p5bmAyY6bMYHI";
            return $data;*/

        }
    ) );
} );
