<?php

if( !defined( 'ABSPATH' ) ) {
  exit;
}

/*
* Template Name: Hours Management
* Description: Hours Management template.
 */

?>

<div class="onesearch-container" ng-app="oneSearch">
  <div class="container" ng-controller="OneSearchCtrl">
    <form ng-submit="search()">

      <suggest-one-search prompt="Search all library resources" model="searchText" search="search">

    </form>
  </div>
</div>

