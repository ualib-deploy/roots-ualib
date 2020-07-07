<?php


class Sidebar_With_Dropdown extends UA_Theme_Walker_Sidebar_Menu {
  private $curItem;
	/**
	 * start_lvl function.
	 *
	 * @access public
	 * @param mixed &$output
	 * @param int $depth (default: 0)
	 * @param array $args (default: array())
	 * @return void
	 */
	public function start_lvl( &$output, $depth = 0, $args = array() ) {
    $item = $this->curItem;
		$indent  = str_repeat( "\t", $depth );
    if ( in_array("current-page-parent", $item->classes )){
      $output .= "\n$indent<ul id='$item->ID' class='list-unstyled collapse in'>\n";
      } else {
      $output .= "\n$indent<ul id='$item->ID' class='list-unstyled collapse'>\n";
      }
  }

	/**
	 * start_el function.
	 *
	 * @access public
	 * @param mixed &$output
	 * @param mixed $item
	 * @param int $depth (default: 0)
	 * @param array $args (default: array())
	 * @param int $id (default: 0)
	 * @return void
	 */
	public function start_el( &$output, $item, $depth = 0, $args = array(), $id = 0 ) {
    $this->curItem = $item;
/* wp_die(var_dump($item)); */
		$class_names = $value = $attributes = '';

		$indent      = ( $depth ) ? str_repeat( "\t", $depth ) : '';
		$classes     = empty( $item->classes ) ? array() : (array) $item->classes;
		$classes[]   = 'menu-item-' . $item->ID;
		$class_names = join( ' ', apply_filters( 'nav_menu_css_class', array_filter( $classes ), $item, $args ) );

		if ( $args->has_children )
			$class_names .= ' dropdown';

		if ( in_array( 'current-menu-item', $classes ) )
			$class_names .= ' active';

		$class_names = $class_names ? sprintf( ' class="%s"', esc_attr( $class_names ) ) : '';

		$id = apply_filters( 'nav_menu_item_id', 'menu-item-'. $item->ID, $item, $args );
		$id = $id ? sprintf( ' id="%s"', esc_attr( $id ) ) : '';

		$output .= sprintf( '%1$s<li%2$s%3$s%4$s>', $indent, $id, $value, $class_names );

		$atts = array();
		// $atts['title']  = !empty( $item->title  ) ? $item->title  : '';
		$atts['target'] = !empty( $item->target ) ? $item->target : '';
		$atts['rel']    = !empty( $item->xfn    ) ? $item->xfn	  : '';
		$atts['href']   = !empty( $item->url    ) ? $item->url    : '';

		// If item has_children add dropdown toggle
		if ( $args->has_children && $depth === 0 ) {
      $atts['href'] = '#' . $item->ID;
			$atts['data-toggle']	= 'collapse';
			$atts['class']			= 'dropdown-toggle';
			$atts['aria-expanded']	= 'true';
    } else {
      $atts['href'] = !empty( $item->url ) ? $item->url : '';
    }

		$atts = apply_filters( 'nav_menu_link_attributes', $atts, $item, $args );
		foreach ( $atts as $attr => $value ) {
			if ( !empty( $value ) ) {
				$value       = ( 'href' === $attr ) ? esc_url( $value ) : esc_attr( $value );
				$attributes .= sprintf( ' %1$s="%2$s"', $attr, $value );
			}
		}

		$item_output  = $args->before;
		$item_output .= sprintf( '<a%s>', $attributes );
		$item_output .= $args->link_before . apply_filters( 'the_title', $item->title, $item->ID ) . $args->link_after;
		$item_output .= '</a>';
		$item_output .= $args->after;

		$output .= apply_filters( 'walker_nav_menu_start_el', $item_output, $item, $depth, $args );
	}

	/**
	 * Traverse elements to create list from elements.
	 *
	 * Display one element if the element doesn't have any children otherwise,
	 * display the element and its children. Will only traverse up to the max
	 * depth and no ignore elements under that depth.
	 *
	 * This method shouldn't be called directly, use the walk() method instead.
	 *
	 * @access public
	 * @param mixed $element
	 * @param mixed &$children_elements
	 * @param mixed $max_depth
	 * @param mixed $depth
	 * @param mixed $args
	 * @param mixed &$output
	 * @return void
	 */
	public function display_element( $element, &$children_elements, $max_depth, $depth, $args, &$output ) {
        if ( !$element )
            return;

        $id_field = $this->db_fields['id'];

        // Display this element.
        if ( is_object( $args[0] ) )
           $args[0]->has_children = ! empty( $children_elements[ $element->$id_field ] );

        parent::display_element( $element, $children_elements, $max_depth, $depth, $args, $output );
    }
}
