<?php

/**
 *
 * Add fields and configure admin settings API.
 *
 * @since   1.0.0
 * @package c9-starter
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
	exit;
}

/**
 * Sets up meta for post header size.
 */
function c9_post_header_size()
{
	add_meta_box(
		'post_header_size',           // Unique ID
		__('Header Size', 'c9-starter'), // Box title
		'c9_post_header_size_html',  // Content callback, must be of type callable
		'post',               // Post type
		'side'
	);
}
add_action('add_meta_boxes', 'c9_post_header_size');

/**
 * Content callback for post header size.
 */
function c9_post_header_size_html($post)
{
	$c9_post_header_size = get_post_meta($post->ID, 'c9_post_header_size', true);
	$value = isset($c9_post_header_size) ? $c9_post_header_size : 'small';
?>
	<label for="c9_post_header_size"><?php echo esc_html('Header Size', 'c9-starter'); ?></label>
	<div>
		<input type="radio" id="large" name="c9_post_header_size" value="large" <?php echo 'large' === $value ? 'checked' : ''; ?>>
		<label for="large"><?php echo esc_html('Large', 'c9-starter'); ?></label>
	</div>
	<div>
		<input type="radio" id="small" name="c9_post_header_size" value="small" <?php echo 'small' === $value ? 'checked' : ''; ?>>
		<label for="small"><?php echo esc_html('Small', 'c9-starter'); ?></label>
	</div>
<?php
}

/**
 * Update post meta.
 */
function c9_save_header_size($post_id)
{
	if (array_key_exists('c9_post_header_size', $_POST)) {
		$unslashed = wp_unslash($_POST);
		update_post_meta(
			$post_id,
			'c9_post_header_size',
			c9_sanitize_post_header_size($unslashed['c9_post_header_size'])
		);
	}
}
add_action('save_post', 'c9_save_header_size');
