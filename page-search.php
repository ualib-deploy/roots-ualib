<?php

if( !defined( 'ABSPATH' ) ) {
    exit;
}

/*
* Template Name: Hours Management
* Description: Hours Management template.
 */

?>
<div  ng-app="oneSearch">
  <div class="onesearch-container">
    <div class="container" ng-controller="OneSearchCtrl">
      <form class="onesearch-form" ng-submit="search()">
        <suggest-one-search prompt="Search all library resources" model="searchText">
      </form>
    </div>
  </div>
  <div class="container one-search-results" ng-view></div>
</div>

<?php /*<div id="content">

    <?php

//    include ualib_child_getUnixPath() . "oneSearch/index_wp.php";
//    include ualib_child_getUnixPath() . "siteSurvey/loadForm.php";
    ?>

</div><!-- end of #content --> */ ?>

