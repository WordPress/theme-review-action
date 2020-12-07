<?php
/**
 * Client-specific functionality
 *
 * @package c9-starter
 */

/**
* Client frontend styles and scripts
*/
require_once "client-enqueue.php";

/**
* Client editor styles and scripts
*/
require_once "client-editor.php";

/**
* Sets up colors and post types and custom styles for core blocks
*/
require_once "client-setup.php";

/**
* Enable support for WooCommerce
*/
require_once "client-woocommerce.php";


/**
* Adding filter to look for client folder templates before child theme templates
*/
add_filter(
    'template_include', function ( $template ) {
        $path = explode('/', $template);
        $template_chosen = end($path);
        $grandchild_template = get_template_directory() . '/client/' . $template_chosen;
        if (file_exists($grandchild_template) ) {
            $template = $grandchild_template;
        }
        return $template;
    }, 99
);
