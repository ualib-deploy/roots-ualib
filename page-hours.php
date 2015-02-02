<?php
include_once "functions-ualib.php";

if( !defined( 'ABSPATH' ) ) {
    exit;
}

/*
* Template Name: Hours Management
* Description: Hours Management template.
 */

?>

<div id="content">

    <?php
    include ualib_child_getUnixPath() . "libhours2/hours_wp.php";
//    include ualib_child_getUnixPath() . "siteSurvey/loadForm.php";
    ?>

</div><!-- end of #content -->
