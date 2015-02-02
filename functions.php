<?php
/**
 * The University of Alabama Libraries functions and definitions
 *
 * When using a child theme (see http://codex.wordpress.org/Theme_Development and
 * http://codex.wordpress.org/Child_Themes), you can override certain functions
 * (those wrapped in a function_exists() call) by defining them first in your child theme's
 * functions.php file. The child theme's functions.php file is included before the parent
 * theme's file, so the child theme functions would be used.
 *
 * @package roots-ualib
 * @since 0.1.0
 */

 // Useful global constants
define( 'UALIB_VERSION', '0.1.0' );

require_once( get_stylesheet_directory() . '/functions-ualib.php' );
require_once( get_stylesheet_directory() . '/lib/theme-functions.php' );

/**
 * Require plugins
 */
require_once( get_stylesheet_directory() . '/lib/class-tgm-plugin-activation.php' );
require_once( get_stylesheet_directory() . '/lib/theme-require-plugins.php' );

add_action( 'tgmpa_register', 'ualib_register_required_plugins' );

 /**
  * Set up theme defaults and register supported WordPress features.
  *
  * @uses load_theme_textdomain() For translation/localization support.
  *
  * @since 0.1.0
  */
function ualib_setup() {
	/**
	 * Makes roots-ualib available for translation.
	 *
	 * Translations can be added to the /lang directory.
	 * If you're building a theme based on roots-ualib, use a find and replace
	 * to change 'ualib' to the name of your theme in all template files.
	 */
	load_theme_textdomain( 'roots-ualib', get_template_directory() . '/languages' );

	/****************************************
	Backend
	*****************************************/

	/**
	 * filter Yoast SEO metabox priority
	 */
	add_filter( 'wpseo_metabox_prio', 'ualib_filter_yoast_seo_metabox' );

	/**
	 * Customize contact methods
	 */
	add_filter( 'user_contactmethods', 'ualib_change_contactmethod', 10, 1 );

	/**
	 * Don't update theme if theme with same name exists in WP theme repo
	 */
	add_filter( 'http_request_args', 'ualib_dont_update_theme', 5, 2 );

	/**
	 * Remove dashboard metaboxes
	 */
	add_action('wp_dashboard_setup', 'ualib_remove_dashboard_widgets' );

	/**
	 * Change Admin Menu Order
	 */
	add_filter( 'custom_menu_order', 'ualib_custom_menu_order' );
	add_filter( 'menu_order', 'ualib_custom_menu_order' );

	/**
	 * Hide admin areas that aren't used
	 */
	add_action( 'admin_menu', 'ualib_remove_menu_pages' );

	/**
	 * Remove default link for images
	 */
	add_action( 'admin_init', 'ualib_imagelink_setup', 10 );

	/**
	 * Show kitchen Sink in WYSIWYG editor
	 */
	add_filter( 'tiny_mce_before_init', 'ualib_unhide_kitchensink' );

	/****************************************
	Frontend
	*****************************************/

	/**
	  * Add humans.txt to the <head> element.
	  */
	add_action( 'wp_head', 'ualib_header_meta' );

	/**
	 * Remove Query Strings From Static Resources
	 */
	add_filter( 'script_loader_src', 'ualib_remove_script_version', 15, 1 );
	add_filter( 'style_loader_src', 'ualib_remove_script_version', 15, 1 );

	/**
	 * Remove Read More Jump
	 */
	add_filter( 'the_content_more_link', 'ualib_remove_more_jump_link' );
}
add_action( 'after_setup_theme', 'ualib_setup' );
