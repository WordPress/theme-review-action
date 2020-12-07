<?php

/**
 * C9 Client Setup
 *
 * @package c9-starter
 */

add_action('after_setup_theme', 'c9_client_setup');
if (!function_exists('c9_client_setup')) {

	/**
	 * Client setup, colors, post formats, block
	 */
	function c9_client_setup()
	{

		global $wp_filesystem;
		// Initialize the WP filesystem, no more using 'file-put-contents' function
		if (empty($wp_filesystem)) {
			require_once(ABSPATH . '/wp-admin/includes/file.php');
			require_once(ABSPATH . '/wp-admin/includes/class-wp-filesystem-base.php');
			require_once(ABSPATH . '/wp-admin/includes/class-wp-filesystem-direct.php');
			WP_Filesystem();
		}

		/**
		 * Apearance > Customizer for fresh sites
		 * Customizer Sample Content
		 */
		add_theme_support(
			'starter-content',
			array(
				'attachments' => array(
					'logo' => array(
						'post_title' => _x('C9 Starter Logo', 'C9 Starter Content Logo', 'c9-starter'),
						'file' => '/client/client-assets/img/c9-black-text-logo.svg',
					),
				),
				'posts'	=> array(
					'home'			=> array(
						'comment_status'	=> 'closed',
						'post_content'		=>  $wp_filesystem->get_contents(get_template_directory() . '/client/content/home.html')
					),
					'about'			=> array(
						'comment_status'	=> 'closed',
						'post_type'			=> 'page',
						'post_title'		=> __('About', 'c9-starter'),
						'post_content'		=>  $wp_filesystem->get_contents(get_template_directory() . '/client/content/about.html')
					),
					'setup'		=> array(
						'comment_status'	=> 'closed',
						'post_type'			=> 'page',
						'post_title'		=> __('Setup', 'c9-starter'),
						'post_content'		=>  $wp_filesystem->get_contents(get_template_directory() . '/client/content/setup.html')
					),
					'styleguide'		=> array(
						'comment_status'	=> 'closed',
						'post_type'			=> 'page',
						'post_title'		=> __('Style Guide', 'c9-starter'),
						'post_content'		=>  $wp_filesystem->get_contents(get_template_directory() . '/client/content/styleguide.html')
					),
					'blog'			=> array(
						'post_content'			=> __('This page will show all of the blog posts once you have populated your database with blog items.', 'c9-starter')
					),
				),
				'options'			=> array(
					'show_on_front'		=> 'page',
					'page_on_front'		=> '{{home}}',
					'page_for_posts' 	=> '{{blog}}',
					'blogname'			=> 'C9 Starter',
					'blogdescription'	=> __('A blocks-based WordPress Theme starter theme for musicians, events, small businesses, restaurants, dispensaries, and bloggers.', 'c9-starter'),
				),
				'theme_mods'		=> array(
					'custom_logo' 			=> '{{logo}}',
					'c9_show_search'		=> 'show',
					'c9_copyright_content'	=> '&copy; 2020. <a href="https://www.covertnine.com" title="Web design company in Chicago" target="_blank">WordPress Website design by COVERT NINE</a>.',
					'c9_default_font'		=> 'no',
					'c9_author_visible'		=> 'hide',
					'c9_blog_sidebar'		=> 'hide',
					'c9_archive_sidebar'	=> 'hide',
					'c9_show_social'		=> 'show',
					'c9_twitter'			=> '#',
					'c9_instagram'			=> '#',
					'c9_spotify'			=> '#',
					'c9_youtube'			=> '#',
					'c9_linkedin'			=> '#',


				),
				'nav_menus'		=> array(
					'primary'		=> array(
						'name'			=>	__('Top Navigation Menu', 'c9-starter'),
						'items'			=> array(
							'page_home',
							'page_about'	=> array(
								'type'		=> 'post_type',
								'object'	=> 'page',
								'object_id'	=> '{{about}}',
							),
							'page_setup'	=> array(
								'type'		=> 'post_type',
								'object'	=> 'page',
								'object_id'	=> '{{setup}}',
							),
							'page_styleguide'	=> array(
								'type'		=> 'post_type',
								'object'	=> 'page',
								'object_id'	=> '{{styleguide}}',
							),
							'page_blog'
						),
					),
				),
				'widgets'	=> array(
					'footerfull'	=> array(
						'c9starter_resources'	=> array(
							'text',
							array(
								'title'	=> __('Resources Menu', 'c9-starter'),
								'text'	=> '<ul id="menu-footer-resources" class="menu">
									<li class="menu-item">
										<a href="#">About</a>
									</li>
									<li class="menu-item">
										<a href="#">blog</a>
									</li>
									<li class="menu-item">
										<a href="#">Library</a>
									</li>
									<li class="menu-item">
										<a href="#">Style Guide</a>
									</li>
									<li class="menu-item">
										<a href="#">Terms &amp; Conditions</a>
									</li>
								</ul>'
							)
						),
						'c9starter_company'	=> array(
							'text',
							array(
								'title'	=> __('Company Menu', 'c9-starter'),
								'text'	=> '<ul id="menu-footer-company" class="menu">
									<li class="menu-item">
										<a href="#">Our History</a>
									</li>
									<li class="menu-item">
										<a href="#">Corporate Governance</a>
									</li>
									<li class="menu-item">
										<a href="#">Safety Information</a>
									</li>
									<li class="menu-item">
										<a href="#">Contact Us</a>
									</li>
									<li class="menu-item">
										<a href="#">Privacy Policy</a>
									</li>
								</ul>'
							)
						),
						'meta_custom' => array('meta', array(
							'title'	=> __('WordPress Meta', 'c9-starter'),
						)),
						'c9starter_about' => array(
							'text',
							array(
								'title'	=> __('About C9 Starter', 'c9-starter'),
								'text'	=> __('Be sure to activate the <strong>C9 Blocks Plugin</strong> during theme setup. The blocks plugin includes the custom WordPress blocks for tabs, toggles, and the responsive grid system that makes the theme look super duper.', 'c9-starter'),
							)
						)
					),
					'right-sidebar'	=> array(
						'search',
						'c9starter_about' => array(
							'text',
							array(
								'title'	=> 'About C9 Starter',
								'text'	=> 'Be sure to activate the <strong>C9 Blocks Plugin</strong> during theme setup. The blocks plugin includes the custom WordPress blocks for tabs, toggles, and the responsive grid system that makes the theme look super duper.'
							)
						),
						'meta_custom' => array('meta', array(
							'title'	=> 'Meta Widget',
						)),
					),
					'left-sidebar'	=> array(
						'search',
						'c9starter_about' => array(
							'text',
							array(
								'title'	=> 'About C9 Starter',
								'text'	=> 'Be sure to activate the <strong>C9 Blocks Plugin</strong> during theme setup. The blocks plugin includes the custom WordPress blocks for tabs, toggles, and the responsive grid system that makes the theme look super duper.'
							)
						),
						'meta_custom' => array('meta', array(
							'title'	=> 'Meta Widget',
						)),
					),
				),
			)
		);

		/**
		 * Editor color palette
		 */
		add_theme_support('editor-color-palette', array(
			array(
				'name' => 'primary',
				'color'    => '#000000',
				'slug' => 'color-primary',
			),
			array(
				'name' => 'secondary',
				'color' => '#333333',
				'slug'    => 'color-secondary',
			),
			array(
				'name' => 'success',
				'color' => '#21a77a',
				'slug'    => 'color-success',
			),
			array(
				'name' => 'info',
				'color'    => '#f7f7f9',
				'slug'    => 'color-info',
			),
			array(
				'name' => 'warning',
				'color'    => '#ec971f',
				'slug'    => 'color-warning',
			),
			array(
				'name' => 'danger',
				'color'    => '#843534',
				'slug'    => 'color-danger',
			),
			array(
				'name' => 'dark',
				'color'    => '#000000',
				'slug'    => 'color-dark',
			),
			array(
				'name' => 'light',
				'color'    => '#ffffff',
				'slug'    => 'color-light',
			),
		));

		/**
		 * Enable support for Post Formats
		 * See http://codex.wordpress.org/Post_Formats
		 */
		add_theme_support(
			'post-formats',
			array(
				'aside',
				'image',
				'video',
				'quote',
				'link',
			)
		);
	}
}

/**
 * Registering block styles for specific Gutenberg Blocks
 */
register_block_style(
	'core/list',
	array(
		'name'         => 'light-text',
		'label'        => __('Light Color Text', 'c9-starter'),
	)
);

register_block_style(
	'core/list',
	array(
		'name'         => 'dark-text',
		'label'        => __('Dark Color Text', 'c9-starter'),
	)
);
