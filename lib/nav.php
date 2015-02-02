<?php
/**
 * Cleaner walker for wp_nav_menu()
 *
 * Walker_Nav_Menu (WordPress default) example output:
 *   <li id="menu-item-8" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-8"><a href="/">Home</a></li>
 *   <li id="menu-item-9" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-9"><a href="/sample-page/">Sample Page</a></l
 *
 * Roots_Nav_Walker example output:
 *   <li class="menu-home"><a href="/">Home</a></li>
 *   <li class="menu-sample-page"><a href="/sample-page/">Sample Page</a></li>
 *
 * ######## Modified to work with Yamm3
 */
class Roots_Nav_Walker extends Walker_Nav_Menu {
    private $column_count = 0;

    function check_current($classes) {
        return preg_match('/(current[-_])|active|dropdown/', $classes);
    }

    function start_lvl(&$output, $depth = 0, $args = array()) {
        //$output .= "\n<ul class=\"dropdown-menu\">\n";
        switch ($depth){
            case 1:
                $output .= "\n<ul class=\"elementy-ul\">\n";
                break;
            default:
                $output .= "\n<ul class=\"dropdown-menu\"><li>\n"."\n<div class=\"yamm-content ualib-mm\">\n"."\n<div class=\"row\"><ul class='list-unstyled'>\n";
                break;
        }
    }

    function end_lvl( &$output, $depth = 0, $args = array() ) {
        if ($depth === 0){
            $output .= '</ul></div></div></li>';
        }
        parent::end_lvl($output, $depth, $args);
    }

    function start_el(&$output, $item, $depth = 0, $args = array(), $id = 0) {
        global $wp_query;

        $item_html = '';
        parent::start_el($item_html, $item, $depth, $args);

        if ($depth === 1){
            if ($item->hasChildren) {
                $sub_head_start = '<div class="mm-heading">';
                if (!empty($item->icon)) $sub_head_start .= '<span class="' . $item->icon . '"></span>';
                $sub_head_start .= '<h4>';

                $sub_head_end = '</h4>'
                    . '</div>';

                $item_html = preg_replace('/<a[^>]*>/iU', $sub_head_start, $item_html); //str_replace('<a href="#">', $sub_head_start, $item_html);
                $item_html = str_replace('</a>', $sub_head_end, $item_html);
            }
            else{
                $html = '<a href="'.$item->url.'">';
                if (!empty($item->icon))
                    $html .= '<span class="'.$item->icon.'"></span>';
                $html .= '<h4>'.$item->title.'</h4>';
                if (!empty($item->description))
                    $html .= '<p>'.$item->description.'</p>';
                $html .= '</a>';

                $item_html = preg_replace('/<a[^>]*>.*?<\/a>/iU', $html, $item_html);
            }
        }

        if ($depth === 0){

            if ($item->is_dropdown) {
                $item_html = str_replace('<a', '<a class="dropdown-toggle" data-toggle="dropdown" data-target="#"', $item_html);
            }

            if ($item->description == '#icon-only' && !empty($item->icon)){
                $item_html = preg_replace('/(<a[^>]*>).*?(<\/a>)/', '$1<span class="'.$item->icon.'"></span>$2', $item_html);
            }
        }
        elseif (stristr($item_html, 'li class="divider')) {
            $item_html = preg_replace('/<a[^>]*>.*?<\/a>/iU', '', $item_html);
        }
        elseif (stristr($item_html, 'li class="dropdown-header')) {
            $item_html = preg_replace('/<a[^>]*>(.*)<\/a>/iU', '$1', $item_html);
        }

        $output .= $item_html;
    }

    function display_element($element, &$children_elements, $max_depth, $depth = 0, $args, &$output) {
        // check, whether there are children for the given ID and append it to the element with a (new) ID
        $element->hasChildren = isset($children_elements[$element->ID]) && !empty($children_elements[$element->ID]);

        $element->is_dropdown = ((!empty($children_elements[$element->ID]) && (($depth + 1) < $max_depth || ($max_depth === 0))));

        $icon = array();
        foreach ($element->classes as $key => $class){
            if (preg_match('/(fa|glyphicon)(-.+)?\b/i', $class) !== 0){
                array_push($icon, $class);
                unset($element->classes[$key]);
            }
        }
        if (!empty($icon)){
            $element->icon = implode(' ', $icon);
        }

        if ($element->is_dropdown && $depth == 0) {
            $element->classes[] = 'dropdown yamm-fw';
        }

        if ($element->description == '#icon-only'){
            $element->classes[] = 'icon-only';
        }


        if ($element && $depth == 0){
            $this->column_count = count($children_elements[$element->ID]);
        }

        if ($element && ($depth === 1)) {
            $col_class = floor(12 / $this->column_count);
            $col_class = $col_class >= 3 ? $col_class : 3;
            $element->classes[] = 'col-xs-'.$col_class . ' menu-col';
            if ($element->hasChildren) $element->classes[] = 'ualib-mm-list';
        }


        parent::display_element($element, $children_elements, $max_depth, $depth, $args, $output);
    }
}

/**
 * Remove the id="" on nav menu items
 * Return 'menu-slug' for nav menu classes
 */
function roots_nav_menu_css_class($classes, $item) {
    $slug = sanitize_title($item->title);
    $classes = preg_replace('/(current(-menu-|[-_]page[-_])(item|parent|ancestor))/', 'active', $classes);
    $classes = preg_replace('/^((menu|page)[-_\w+]+)+/', '', $classes);

    $classes[] = 'menu-' . $slug;

    $classes = array_unique($classes);

    return array_filter($classes, 'is_element_empty');
}
add_filter('nav_menu_css_class', 'roots_nav_menu_css_class', 10, 2);
add_filter('nav_menu_item_id', '__return_null');

/**
 * Clean up wp_nav_menu_args
 *
 * Remove the container
 * Use Roots_Nav_Walker() by default
 */
function roots_nav_menu_args($args = '') {
    $roots_nav_menu_args = array();

    $roots_nav_menu_args['container'] = false;

    if (!$args['items_wrap']) {
        $roots_nav_menu_args['items_wrap'] = '<ul class="%2$s">%3$s</ul>';
    }

    if (!$args['depth']) {
        $roots_nav_menu_args['depth'] = 2;
    }

    if (!$args['walker']) {
        $roots_nav_menu_args['walker'] = new Roots_Nav_Walker();
    }

    return array_merge($args, $roots_nav_menu_args);
}
add_filter('wp_nav_menu_args', 'roots_nav_menu_args');