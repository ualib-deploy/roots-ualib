<?php
/**
 * Utility functions
 */
function is_element_empty($element) {
  $element = trim($element);
  return !empty($element);
}

// Tell WordPress to use searchform.php from the templates/ directory
function roots_get_search_form() {
  $form = '';
  locate_template('/templates/searchform.php', true, false);
  return $form;
}
add_filter('get_search_form', 'roots_get_search_form');

/**
 * Add page slug to body_class() classes if it doesn't exist
 */
function roots_body_class($classes) {
  // Add post/page slug
  if (is_single() || is_page() && !is_front_page()) {
    if (!in_array(basename(get_permalink()), $classes)) {
      $classes[] = basename(get_permalink());
    }
  }

  // Add custom class to style body
  // SMART Board applications (used in presentation rooms across campus) inject a second body tag into the page
  // so commonly used <body> styles such as "min-height: 100%" cause a giant empty space above the site content.
  $classes[] = 'not-so-smart-board';

  return $classes;
}
add_filter('body_class', 'roots_body_class');
