<?php
/**
 * Client-specific scripts for WordPress block editor
 *
 * @package c9-starter
 */

 if (! function_exists('c9_client_editor_style') ) {
    /**
     * Add client compiled files to gutenberg editor.
     */
    function c9_client_editor_style()
    {
        wp_enqueue_style('c9-client-styles', get_template_directory_uri() . '/client/client-assets/dist/client.min.css', array( 'c9-styles' ) );
        wp_enqueue_style('c9-client-editor-styles', get_template_directory_uri() . '/client/client-assets/dist/client-editor.min.css', array('c9-client-styles') );
    }
    add_action('enqueue_block_editor_assets', 'c9_client_editor_style', 99999999);
} //end if function exists
