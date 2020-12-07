<?php
/**
 * Functions for managing the information your blog puts out via the WP-Api.
 */
add_action( 'rest_api_init', 'c9_register_rest_images' );
/**
 * Add featured img url to rest posts
 */
function c9_register_rest_images() {
	register_rest_field(
		 array( 'post' ),
		'c9_feat_img_url',
		array(
			'get_callback'    => 'c9_get_rest_featured_image',
			'update_callback' => null,
			'schema'          => null,
		)
	);
}
function c9_get_rest_featured_image( $object, $field_name, $request ) {
	if ( $object['featured_media'] ) {
		$img = wp_get_attachment_image_src( $object['featured_media'], 'medium_large' );
		return $img[0];
	}
	return false;
}
