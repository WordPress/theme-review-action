<?php
/**
 * Declaring widgets
 *
 * @package c9-starter
 */

if ( ! function_exists( 'c9_slbd_count_widgets' ) ) {
	/**
	 * Count number of widgets in a sidebar
	 * Used to add classes to widget areas so widgets can be displayed one, two, three or four per row
	 */
	function c9_slbd_count_widgets( $sidebar_id ) {
		// If loading from front page, consult $_wp_sidebars_widgets rather than options
		// to see if wp_convert_widget_settings() has made manipulations in memory.
		global $_wp_sidebars_widgets;

		$c9_fresh_status = get_option( 'fresh_site' );

		if ( empty( $_wp_sidebars_widgets ) ) :
			$sidebars_widgets_count = get_option( 'sidebars_widgets', array() );
		else :
			$sidebars_widgets_count = $_wp_sidebars_widgets;
		endif;

		if ( isset( $sidebars_widgets_count[ $sidebar_id ] ) ) {
			$widget_count   = count( $sidebars_widgets_count[ $sidebar_id ] );
			$widget_classes = 'widget-count-' . count( $sidebars_widgets_count[ $sidebar_id ] );
			if ( 0 == $widget_count % 4 || 6 < $widget_count || 0 == $widget_count % 5 ) :
				// Four widgets per row if there are exactly four or more than six
				$widget_classes .= ' col-sm-6 col-md-3';
			elseif ( 6 == $widget_count ) :
				// If two widgets are published
				$widget_classes .= ' col-md-2';
			elseif ( $widget_count >= 3 ) :
				// Three widgets per row if there's three or more widgets
				$widget_classes .= ' col-md-4';
			elseif ( 2 == $widget_count ) :
				// If two widgets are published
				$widget_classes .= ' col-md-6';
			elseif ( 1 == $widget_count ) :
				// If just on widget is active
				$widget_classes .= ' col-md-12';
			endif;
			return $widget_classes;

		} elseif ( $c9_fresh_status === '1' ) { // This is a fresh install

			$widget_classes = ' col-sm-6 col-md-3';

			return $widget_classes;
		}

	}
}

add_action( 'widgets_init', 'c9_widgets_init' );

if ( ! function_exists( 'c9_widgets_init' ) ) {
	/**
	 * Initializes themes widgets.
	 */
	function c9_widgets_init() {
		register_sidebar(
			array(
				'name'          => __( 'Footer', 'c9-starter' ),
				'id'            => 'footerfull',
				'description'   => __('Full bottom widget with dynamic responsive grid that shows on every page. Suggested 3-6 widgets.', 'c9-starter'),
				'before_widget' => '<div id="%1$s" class="footer-widget %2$s ' . c9_slbd_count_widgets( 'footerfull' ) . '">',
				'after_widget'  => '</div><!-- .footer-widget -->',
				'before_title'  => '<h3 class="widget-title">',
				'after_title'   => '</h3>',
			)
			);

		register_sidebar(
			array(
				'name'          => __( 'Right Sidebar', 'c9-starter' ),
				'id'            => 'right-sidebar',
				'description'   => __( 'Right sidebar widget area displayed when using the Right Sidebar Layout page template. Widget content fades in after scrolling down on frontend..', 'c9-starter' ),
				'before_widget' => '<aside id="%1$s" class="widget sidebar-widget %2$s">',
				'after_widget'  => '</aside>',
				'before_title'  => '<h3 class="widget-title">',
				'after_title'   => '</h3>',
			)
		);

		register_sidebar(
			array(
				'name'          => __( 'Left Sidebar', 'c9-starter' ),
				'id'            => 'left-sidebar',
				'description'   => __( 'Left sidebar widget area displayed when using the Right Sidebar Layout page template. Widget content fades in after scrolling down on the frontend.', 'c9-starter' ),
				'before_widget' => '<aside id="%1$s" class="widget sidebar-widget %2$s">',
				'after_widget'  => '</aside>',
				'before_title'  => '<h3 class="widget-title">',
				'after_title'   => '</h3>',
			)
		);
	}
} // endif function_exists( 'c9_widgets_init' ).
