<?php

/**
 * Custom functions that act independently of the theme templates.
 *
 * Eventually, some of the functionality here could be replaced by core features.
 *
 * @package c9
 */

add_filter('body_class', 'c9_body_classes');

if (!function_exists('c9_body_classes')) {
	/**
	 * Adds custom classes to the array of body classes.
	 *
	 * @param array $classes Classes for the body element.
	 *
	 * @return array
	 */
	function c9_body_classes($classes)
	{
		// Adds a class of group-blog to blogs with more than 1 published author.
		if (is_multi_author()) {
			$classes[] = 'group-blog';
		}
		// Adds a class of hfeed to non-singular pages.
		if (!is_singular()) {
			$classes[] = 'hfeed';
		}

		return $classes;
	}
}

// Removes tag class from the body_class array to avoid Bootstrap markup styling issues.
add_filter('body_class', 'c9_adjust_body_class');

if (!function_exists('c9_adjust_body_class')) {
	/**
	 * Setup body classes.
	 *
	 * @param string $classes CSS classes.
	 *
	 * @return mixed
	 */
	function c9_adjust_body_class($classes)
	{

		foreach ($classes as $key => $value) {
			if ('tag' === $value) {
				unset($classes[$key]);
			}
		}

		return $classes;
	}
}

// Filter custom logo with correct classes.
add_filter('get_custom_logo', 'c9_change_logo_class');

if (!function_exists('c9_change_logo_class')) {
	/**
	 * Replaces logo CSS class.
	 *
	 * @param string $html Markup.
	 *
	 * @return mixed
	 */
	function c9_change_logo_class($html)
	{

		$html = str_replace('class="custom-logo"', 'class="img-fluid navbar-brand c9-custom-logo"', $html);
		$html = str_replace('class="custom-logo-link"', 'class="navbar-brand custom-logo-link c9-custom-logo"', $html);
		$html = str_replace('alt=""', 'title="' . esc_attr__('Home', 'c9-starter') . '" alt="' . esc_attr__('logo', 'c9-starter') . '"', $html);
		$html = wp_kses_post($html);
		return $html;
	}
}



if (!function_exists('c9_post_nav')) {

	/**
	 * Display navigation to next/previous post when applicable.
	 */
	function c9_post_nav()
	{
		// Don't print empty markup if there's nowhere to navigate.
		$previous = (is_attachment()) ? get_post(get_post()->post_parent) : get_adjacent_post(false, '', true);
		$next     = get_adjacent_post(false, '', false);

		if (!$next && !$previous) {
			return;
		}
?>
		<nav class="navigation post-navigation">
			<h2 class="sr-only"><?php esc_html_e('Post navigation', 'c9-starter'); ?></h2>
			<div class="nav-links justify-content-between px-3">
				<?php

				if (get_previous_post_link()) {
					previous_post_link('<span class="nav-previous">%link</span>', _x('<i class="fa fa-angle-left"></i>&nbsp; Previous Post', 'Previous post link', 'c9-starter'));
				}
				if (get_next_post_link()) {
					next_post_link('<span class="nav-next">%link</span>', _x('Next Post&nbsp;<i class="fa fa-angle-right"></i>', 'Next post link', 'c9-starter'));
				}
				?>
			</div><!-- .nav-links -->
		</nav><!-- .navigation -->
<?php
	}
}

if (!function_exists('c9_display_image_size_names_muploader')) {
	/**
	 * Add image sizes
	 */
	function c9_display_image_size_names_muploader($sizes)
	{

		$new_sizes = array();

		$added_sizes = get_intermediate_image_sizes();

		// $added_sizes is an indexed array, therefore need to convert it
		// to associative array, using $value for $key and $value
		foreach ($added_sizes as $key => $value) {
			$new_sizes[$value] = $value;
		}

		// This preserves the labels in $sizes, and merges the two arrays
		$new_sizes = array_merge($new_sizes, $sizes);

		return $new_sizes;
	}
}
add_filter('image_size_names_choose', 'c9_display_image_size_names_muploader', 11, 1);

/**
 * Sanitize Select inputs from Customizer
 */
function c9_sanitize_select($input, $setting)
{

	// Ensure input is a slug.
	$input = sanitize_text_field($input);

	// Get list of choices from the control associated with the setting.
	$choices = $setting->manager->get_control($setting->id)->choices;

	// If the input is a valid key, return it; otherwise, return the default.
	return (array_key_exists($input, $choices) ? $input : $setting->default);
}

/**
 * Sanitize checkbox inputs from Customizer
 */
function c9_sanitize_checkbox($input)
{
	return ($input === true) ? true : false;
}

/**
 * Sanitize checkbox inputs from post meta
 */
function c9_sanitize_post_header_size($input)
{

	// Ensure input is a slug.
	$input = sanitize_html_class($input);

	// Get list of choices from the setting
	$choices = array('large' => 0, 'small' => 1);

	// If the input is a valid key, return it; otherwise, return the default.
	return (array_key_exists($input, $choices) ? $input : 'small');
}

/**
 * add a full screen search icon to navigation
 */

add_filter('wp_nav_menu_items', 'c9_add_search_form', 10, 2);
if (!function_exists('c9_add_search_form')) {
	function c9_add_search_form($items, $args)
	{
		if ('primary' == $args->theme_location) {
			$items .= '<li class="nav-item search">
					<div class="nav-search">
						<a href="#" class="btn-nav-search nav-link">
							<i class="fa fa-search"></i>
							<span class="sr-only">' . __('Search', 'c9-starter') . '</span>
						</a>
					</div></li>';
		}
		return $items;
	}
}
