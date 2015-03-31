<?php

if( !defined( 'ABSPATH' ) ) {
  exit;
}

/*
* Template Name: Hours Management
* Description: Hours Management template.
 */

?>
<div class="onesearch-container">
    <div class="container" ng-controller="OneSearchCtrl">
        <form ng-submit="search()">

            <suggest-one-search prompt="Search all library resources" model="searchText" search="search">

        </form>
    </div>
</div>

<div class="container one-search-results" ng-view>

</div>
<?php
      //include ualib_getWebappsPath() . "oneSearch/index_wp_demo.php";
//    include WEBAPPS_PATH . "siteSurvey/loadForm.php";
?>



