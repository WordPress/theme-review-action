<?php
//add WooCommerce support
add_action('after_setup_theme', 'c9_add_woocommerce_support');
if (!function_exists('c9_add_woocommerce_support')) {

	function c9_add_woocommerce_support()
	{
		add_theme_support('woocommerce', array(
			'thumbnail_image_width' => 300,
			'gallery_thumbnail_image_width' => 200
		));
		add_theme_support('wc-product-gallery-zoom');
		add_theme_support('wc-product-gallery-lightbox');
		add_theme_support('wc-product-gallery-slider');
	}
}

// $path defaults to 'woocommerce/' (in client folder)
add_filter('woocommerce_template_path', 'c9_woocommerce_template_path');
if (!function_exists('c9_woocommerce_template_path')) {

	function c9_woocommerce_template_path()
	{
		return 'client/woocommerce/';
	}
}
