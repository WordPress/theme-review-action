<?php
/**
 * Jetpack Compatibility File
 *
 * @link https://jetpack.me/
 *
 * @package c9-starter
 */

/**
 * Jetpack setup function.
 *
 * See: https://jetpack.me/support/infinite-scroll/
 * See: https://jetpack.me/support/responsive-videos/
 */

add_action( 'after_setup_theme', 'c9_components_jetpack_setup' );

if ( ! function_exists( 'c9_components_jetpack_setup' ) ) {
	/**
	 * Add theme support for Infinite Scroll.
	 */
	function c9_components_jetpack_setup() {
		add_theme_support(
			'infinite-scroll',
			array(
				'container' => 'main',
				'render'    => 'components_infinite_scroll_render',
				'footer'    => 'page',
			)
			);

		// Add theme support for Responsive Videos.
		add_theme_support( 'jetpack-responsive-videos' );

		// Add theme support for Social Menus
		add_theme_support( 'jetpack-social-menu' );

	}
}


if ( ! function_exists( 'c9_components_infinite_scroll_render' ) ) {
	/**
	 * Custom render function for Infinite Scroll.
	 */
	function c9_components_infinite_scroll_render() {
		while ( have_posts() ) {
			the_post();
			if ( is_search() ) :
				get_template_part( 'loop-templates/content', 'search' );
			else :
				get_template_part( 'loop-templates/content', get_post_format() );
			endif;
		}
	}
}

if ( ! function_exists( 'c9_components_social_menu' ) ) {
	/**
	 * Jetpack Social Menu
	 */
	function c9_components_social_menu() {
		if ( ! function_exists( 'jetpack_social_menu' ) ) {
			return;
		} else {
			jetpack_social_menu();
		}
	}
}
