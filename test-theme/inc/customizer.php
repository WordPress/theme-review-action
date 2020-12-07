<?php

/**
 * Theme Customizer
 *
 * @package C9
 */

/**
 * Add postMessage support for site title and description for the Theme Customizer.
 *
 * @param WP_Customize_Manager $wp_customize Theme Customizer object.
 */
if (!function_exists('c9_customize_register')) {
	/**
	 * Register basic customizer support.
	 *
	 * @param object $wp_customize Customizer reference.
	 */
	function c9_customize_register($wp_customize)
	{
		$wp_customize->get_setting('blogname')->transport         = 'postMessage';
		$wp_customize->get_setting('blogdescription')->transport  = 'postMessage';
		$wp_customize->get_setting('header_textcolor')->transport = 'postMessage';

		$wp_customize->add_section(
			'c9_footer',
			array(
				'title'    => __('Footer', 'c9-starter'),
				'priority' => 97,
			)
		);

		$wp_customize->add_setting(
			'c9_show_search',
			array(
				'default'           => 'show',
				'type' 				=> 'theme_mod',
				'capability' 		=> 'edit_theme_options',
				'sanitize_callback' => 'c9_sanitize_select',
			)
		);

		$wp_customize->add_control(
			'c9_show_search',
			array(
				'type'        => 'radio',
				'label'       => __('Display search in footer', 'c9-starter'),
				'section'     => 'c9_footer',
				'description' => __('Hide or show the search form in the footer', 'c9-starter'),
				'choices'     => array(
					'show' => __('Show', 'c9-starter'),
					'hide' => __('Hide', 'c9-starter'),
				),
			)
		);

		$wp_customize->add_setting(
			'c9_copyright_content',
			array(
				'type' 				=> 'theme_mod',
				'capability' 		=> 'edit_theme_options',
				'sanitize_callback' => 'wp_kses_post',
				'transport'         => 'postMessage',

			)
		);

		$wp_customize->add_control(
			'c9_copyright_content',
			array(
				'type'        => 'textarea',
				'label'       => __('Copyright', 'c9-starter'),
				'section'     => 'c9_footer',
				'description' => __('Enter in any copyright information, links to privacy policies or terms.', 'c9-starter'),
			)
		);
		$wp_customize->add_section(
			'c9_social',
			array(
				'title'    => __('Social Media', 'c9-starter'),
				'priority' => 92,
			)
		);


		$wp_customize->add_setting(
			'c9_show_social',
			array(
				'default'           => 'show',
				'sanitize_callback' => 'c9_sanitize_select',
				'type' 				=> 'theme_mod',
				'capability' 		=> 'edit_theme_options',
			)
		);

		$wp_customize->add_control(
			'c9_show_social',
			array(
				'type'        => 'radio',
				'label'       => __('Display social icons in footer', 'c9-starter'),
				'section'     => 'c9_social',
				'description' => __('Hide or show social icons in the footer', 'c9-starter'),
				'choices'     => array(
					'show' => __('Show', 'c9-starter'),
					'hide' => __('Hide', 'c9-starter'),
				),
			)
		);


		$wp_customize->add_setting(
			'c9_twitter',
			array(
				'default'           => '',
				'sanitize_callback' => 'esc_url_raw',
				'type' 				=> 'theme_mod',
				'capability' 		=> 'edit_theme_options',
			)
		);

		$wp_customize->add_control(
			'c9_twitter',
			array(
				'type'        => 'text',
				'label'       => __('Twitter Link', 'c9-starter'),
				'section'     => 'c9_social',
				'description' => __('Input your Twitter Username or full url', 'c9-starter'),
			)
		);
		$wp_customize->add_setting(
			'c9_facebook',
			array(
				'default'           => '',
				'sanitize_callback' => 'esc_url_raw',
				'type' 				=> 'theme_mod',
				'capability' 		=> 'edit_theme_options',
			)
		);
		$wp_customize->add_control(
			'c9_facebook',
			array(
				'type'        => 'text',
				'label'       => __('Facebook Link', 'c9-starter'),
				'section'     => 'c9_social',
				'description' => __('Input your Facebook username or full url', 'c9-starter'),
			)
		);
		$wp_customize->add_setting(
			'c9_instagram',
			array(
				'default'           => '',
				'sanitize_callback' => 'esc_url_raw',
				'type' 				=> 'theme_mod',
				'capability' 		=> 'edit_theme_options',
			)
		);
		$wp_customize->add_control(
			'c9_instagram',
			array(
				'type'        => 'text',
				'label'       => __('Instagram Link', 'c9-starter'),
				'section'     => 'c9_social',
				'description' => __('Input your Instagram username or full url', 'c9-starter'),
			)
		);
		$wp_customize->add_setting(
			'c9_pinterest',
			array(
				'default'           => '',
				'sanitize_callback' => 'esc_url_raw',
				'type' 				=> 'theme_mod',
				'capability' 		=> 'edit_theme_options',
			)
		);
		$wp_customize->add_control(
			'c9_pinterest',
			array(
				'type'        => 'text',
				'label'       => __('Pinterest Link', 'c9-starter'),
				'section'     => 'c9_social',
				'description' => __('Input your Pinterest username or full url', 'c9-starter'),
			)
		);

		$wp_customize->add_setting(
			'c9_spotify',
			array(
				'default'           => '',
				'sanitize_callback' => 'esc_url_raw',
				'type' 				=> 'theme_mod',
				'capability' 		=> 'edit_theme_options',
			)
		);
		$wp_customize->add_control(
			'c9_spotify',
			array(
				'type'        => 'text',
				'label'       => __('Spotify Link', 'c9-starter'),
				'section'     => 'c9_social',
				'description' => __('Input your Spotify username or full url', 'c9-starter')
			)
		);

		$wp_customize->add_setting(
			'c9_youtube',
			array(
				'default'           => '',
				'sanitize_callback' => 'esc_url_raw',
				'type' 				=> 'theme_mod',
				'capability' 		=> 'edit_theme_options',
			)
		);
		$wp_customize->add_control(
			'c9_youtube',
			array(
				'type'        => 'text',
				'label'       => __('YouTube Link', 'c9-starter'),
				'section'     => 'c9_social',
				'description' => __('Input your YouTube username or full url', 'c9-starter'),
			)
		);

		$wp_customize->add_setting(
			'c9_yelp',
			array(
				'default'           => '',
				'sanitize_callback' => 'esc_url_raw',
				'type' 				=> 'theme_mod',
				'capability' 		=> 'edit_theme_options',
			)
		);
		$wp_customize->add_control(
			'c9_yelp',
			array(
				'type'        => 'text',
				'label'       => __('Yelp Link', 'c9-starter'),
				'section'     => 'c9_social',
				'description' => __('Input your Yelp username or full url', 'c9-starter'),
			)
		);

		$wp_customize->add_setting(
			'c9_subreddit',
			array(
				'default'           => '',
				'sanitize_callback' => 'esc_url_raw',
				'type' 				=> 'theme_mod',
				'capability' 		=> 'edit_theme_options',
			)
		);
		$wp_customize->add_control(
			'c9_subreddit',
			array(
				'type'        => 'text',
				'label'       => __('Subreddit Link', 'c9-starter'),
				'section'     => 'c9_social',
				'description' => __('Input your Subreddit url', 'c9-starter'),
			)
		);

		$wp_customize->add_setting(
			'c9_linkedin',
			array(
				'default'           => '',
				'sanitize_callback' => 'esc_url_raw',
				'type' 				=> 'theme_mod',
				'capability' 		=> 'edit_theme_options',
			)
		);
		$wp_customize->add_control(
			'c9_linkedin',
			array(
				'type'        => 'text',
				'label'       => __('LinkedIn Link', 'c9-starter'),
				'section'     => 'c9_social',
				'description' => __('Input your LinkedIn url', 'c9-starter'),
			)
		);

		$wp_customize->add_setting(
			'c9_github',
			array(
				'default'           => '',
				'sanitize_callback' => 'esc_url_raw',
				'type' 				=> 'theme_mod',
				'capability' 		=> 'edit_theme_options',
			)
		);
		$wp_customize->add_control(
			'c9_github',
			array(
				'type'        => 'text',
				'label'       => __('Github Link', 'c9-starter'),
				'section'     => 'c9_social',
				'description' => __('Input your Github username or full url', 'c9-starter'),
			)
		);

		$wp_customize->add_setting(
			'c9_soundcloud',
			array(
				'default'           => '',
				'sanitize_callback' => 'esc_url_raw',
				'type' 				=> 'theme_mod',
				'capability' 		=> 'edit_theme_options',
			)
		);
		$wp_customize->add_control(
			'c9_soundcloud',
			array(
				'type'        => 'text',
				'label'       => __('SoundCloud Link', 'c9-starter'),
				'section'     => 'c9_social',
				'description' => __('Input your SoundCloud username or full url', 'c9-starter'),
			)
		);
		$wp_customize->add_section(
			'c9_branding',
			array(
				'title'    => __('Branding', 'c9-starter'),
				'priority' => 20,
			)
		);

		$wp_customize->add_setting(
			'c9_default_font',
			array(
				'default'           => 'no',
				'transport'         => 'refresh',
				'sanitize_callback' => 'c9_sanitize_select',
				'type' 				=> 'theme_mod',
				'capability' 		=> 'edit_theme_options',
			)
		);

		$wp_customize->add_control(
			'c9_default_font',
			array(
				'type'    => 'radio',
				'label'   => __('Use C9 Theme Fonts?', 'c9-starter'),
				'section' => 'c9_branding',
				'choices' => array(
					'yes' => __('Yes', 'c9-starter'),
					'no'  => __('No, I will queue my own fonts.', 'c9-starter'),
				),
			)
		);

		/*
				 If the user selects YES and will select the fonts.
				The default font will be Helvetica for system fonts:
				if ( get_theme_mod ( 'c9_default_font') === 'yes') { */

		// Update an array to contain the fonts that will be used
		// throughout each of the font selector fields:
		$c9fonts = array(
			''																	=> '',
			'Abel'                												=> 'Abel',
			'Anton'																=> 'Anton',
			'Asap:wght@400;500;600;700'											=> 'Asap',
			'Barlow:ital,wght@0,200;0,300;0,400;0,700;0,800;0,900;1,400'		=> 'Barlow',
			'Bebas+Neue'          												=> 'Bebas Neue',
			'Bitter:wght@200;300;400;700;900'									=> 'Bitter',
			'Cabin:wght@400;500;700'											=> 'Cabin',
			'Comfortaa:wght@300;400;500;700'									=> 'Comfortaa',
			'Crimson+Text:wght@400;600;700'										=> 'Crimson Text',
			'Dosis:wght@300;400;700'											=> 'Dosis',
			'Goldman:wght@400,700'												=> 'Goldman',
			'Heebo:wght@200;400;700;800;900'									=> 'Heebo',
			'Hind:wght@300;400;500;700'											=> 'Hind',
			'Hind+Siliguri:wght@300,400,700'									=> 'Hind Siliguri',
			'IBM+Plex+Sans:ital,wght@0,100;0,400;0,700;1,400'					=> 'IBM Plex Sans',
			'IBM+Plex+Sans+Condensed:ital,wght@0,100;0,200;0,300;0,400;0,700;1,400'	=> 'IBM Plex Sans Condensed',
			'IBM+Plex+Serif:ital,wght@0,200;0,400;0,600;0,700;1,400'			=> 'IBM Plex Serif',
			'IBM+Plex+Mono:ital,wght@0,200;0,400;0,700;1,400'					=> 'IBM Plex Mono',
			'Inconsolata:wght@300;400;700;800;900'								=> 'Inconsolata',
			'Inter:wght@200;300;400;700;800;900'								=> 'Inter',
			'Josefin+Sans:wght@300;400;500;700'									=> 'Josefin Sans',
			'Karla:ital,wght@0,400;0,700;1,400'									=> 'Karla',
			'Lato:ital,wght@0,300;0,400;0,700;0,900;1,400;1,700'   				=> 'Lato',
			'Libre+Baskerville:wght@400;700'									=> 'Libre Baskerville',
			'Libre+Franklin:wght@200;300;400;700;800;900'						=> 'Libre Franklin',
			'Lobster'             												=> 'Lobster',
			'Lora:ital,wght@0,400;0,700;1,400;1,500;1,700'						=> 'Lora',
			'Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,400;1,700'        => 'Merriweather',
			'Merriweather+Sans:ital,wght@0,300;0,400;0,700;0,800;1,400;1,700'   => 'Merriweather Sans',
			'Montserrat:ital,wght@0,200;0,300;0,400;0,700;0,900;1,400;1,700'	=> 'Montserrat',
			'Muli'                												=> 'Muli',
			'Noto+Sans+JP:wght@100,300,400,700'									=> 'Noto Sans JP',
			'Nunito:ital,wght@0,300;0,400;0,700;0,800;0,900;1,400;1,700'        => 'Nunito',
			'Nunito+Sans:ital,wght@0,300;0,400;0,700;0,800;0,900;1,700'         => 'Nunito Sans',
			'Open+Sans:ital,wght@0,300;0,400;0,700;0,800;1,400;1,700'           => 'Open Sans',
			'Open+Sans+Condensed:wght@300;700' 									=> 'Open Sans Condensed',
			'Oswald:wght@200,300,400,700'              							=> 'Oswald',
			'Oxygen:wght@300,400,700'											=> 'Oxygen',
			'Pacifico'															=> 'Pacifico',
			'Playfair+Display:ital,wght@0,400;0,700;0,800;0,900;1,400'    		=> 'Playfair Display',
			'Poppins:ital,wght@0,200;0,300;0,400;0,700;0,800;0,900;1,400'       => 'Poppins',
			'PT+Sans:ital,wght@0,400;0,700;1,400'             					=> 'PT Sans',
			'PT+Serif:ital,wght@0,400;0,700;1,400'            					=> 'PT Serif',
			'Quicksand:wght@300;400;700'           								=> 'Quicksand',
			'Raleway:ital,wght@0,200;0,300;0,400;0,700;0,800;0,900;1,400'       => 'Raleway',
			'Roboto:ital,wght@0,300;0,400;0,700;0,900;1,400'              		=> 'Roboto',
			'Roboto+Condensed:ital,wght@0,300;0,400;0,700;1,400'    			=> 'Roboto Condensed',
			'Roboto+Slab:wght@300,400,700,900'         							=> 'Roboto Slab',
			'Rubik:ital,wght@0,300;0,400;0,700;1,400;1,700'						=> 'Rubik',
			'Sen:wght@400,700,800'                 								=> 'Sen',
			'Source+Sans+Pro:ital,wght@0,300;0,400;0,700;0,900;1,400;1,700'     => 'Source Sans Pro',
			'Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,400'					=> 'Ubuntu',
			'Work+Sans:ital,wght@0,200;0,400;0,700;0,800;0,900;1,400'           => 'Work Sans',
			'Xanh+Mono'			           										=> 'Xanh Mono'
		);

		$wp_customize->add_setting(
			'c9_heading_font',
			array(
				'default'           => '',
				'transport'         => 'refresh',
				'sanitize_callback' => 'c9_sanitize_select',
				'type' 				=> 'theme_mod',
				'capability' 		=> 'edit_theme_options',
			)
		);

		$wp_customize->add_control(
			'c9_heading_font',
			array(
				'type'        => 'select',
				'label'       => __('Heading Font', 'c9-starter'),
				'description' => __('Select your heading font family.', 'c9-starter'),
				'section'     => 'c9_branding',
				'choices'     => $c9fonts,
			)
		);

		$wp_customize->add_setting(
			'c9_subheading_font',
			array(
				'default'           => '',
				'transport'         => 'refresh',
				'sanitize_callback' => 'c9_sanitize_select',
				'type' 				=> 'theme_mod',
				'capability' 		=> 'edit_theme_options',
			)
		);

		$wp_customize->add_control(
			'c9_subheading_font',
			array(
				'type'        => 'select',
				'label'       => __('Subheading Font', 'c9-starter'),
				'description' => __('Select your subheading font family.', 'c9-starter'),
				'section'     => 'c9_branding',
				'choices'     => $c9fonts,
			)
		);
		$wp_customize->add_setting(
			'c9_body_font',
			array(
				'default'           => '',
				'transport'         => 'refresh',
				'sanitize_callback' => 'c9_sanitize_select',
				'type' 				=> 'theme_mod',
				'capability' 		=> 'edit_theme_options',
			)
		);
		$wp_customize->add_control(
			'c9_body_font',
			array(
				'type'        => 'select',
				'label'       => __('Body Paragraph Font', 'c9-starter'),
				'description' => __('Select your base font family.', 'c9-starter'),
				'section'     => 'c9_branding',
				'choices'     => $c9fonts,
			)
		);

		$wp_customize->add_setting(
			'c9_fadein_webfonts',
			array(
				'default'           => true,
				'transport'         => 'refresh',
				'sanitize_callback' => 'c9_sanitize_checkbox',
				'type' 				=> 'theme_mod',
				'capability' 		=> 'edit_theme_options',
			)
		);
		$wp_customize->add_control(
			'c9_fadein_webfonts',
			array(
				'type'        => 'checkbox',
				'label'       => __('Fade-in custom fonts as they download', 'c9-starter'),
				'description' => __('Select this if you notice a flash of the default font as the custom fonts download the first time a user visits the site.', 'c9-starter'),
				'section'     => 'c9_branding',
			)
		);

		$wp_customize->add_section(
			'c9_posts',
			array(
				'title'    => __('Posts', 'c9-starter'),
				'description' => __('These settings control whether side bars show up on single post, posts, and archive page templates, as well as author name and link on single post templates. Changes will only be visible on those pages.', 'c9-starter'),
				'priority' => 90,
			)
		);

		$wp_customize->add_setting(
			'c9_author_visible',
			array(
				'default'           => 'hide',
				'transport'         => 'refresh',
				'sanitize_callback' => 'c9_sanitize_select',
				'type' 				=> 'theme_mod',
				'capability' 		=> 'edit_theme_options',
			)
		);

		$wp_customize->add_control(
			'c9_author_visible',
			array(
				'type'    => 'radio',
				'label'   => __('Do you want to show or hide the author name on posts?', 'c9-starter'),
				'section' => 'c9_posts',
				'choices' => array(
					'show' => __('Show', 'c9-starter'),
					'hide' => __('Hide', 'c9-starter'),
				),
			)
		);

		$wp_customize->add_setting(
			'c9_blog_sidebar',
			array(
				'default'           => 'hide',
				'transport'         => 'refresh',
				'sanitize_callback' => 'c9_sanitize_select',
				'type' 				=> 'theme_mod',
				'capability' 		=> 'edit_theme_options',
			)
		);

		$wp_customize->add_control(
			'c9_blog_sidebar',
			array(
				'type'    => 'radio',
				'label'   => __('Display a sidebar on single posts?', 'c9-starter'),
				'section' => 'c9_posts',
				'choices' => array(
					'hide'          => __('No Sidebar', 'c9-starter'),
					'sidebar-left'  => __('Left Sidebar', 'c9-starter'),
					'sidebar-right' => __('Right Sidebar', 'c9-starter'),
				),
			)
		);

		$wp_customize->add_setting(
			'c9_archive_sidebar',
			array(
				'default'           => 'hide',
				'transport'         => 'refresh',
				'sanitize_callback' => 'c9_sanitize_select',
				'type' 				=> 'theme_mod',
				'capability' 		=> 'edit_theme_options',
			)
		);

		$wp_customize->add_control(
			'c9_archive_sidebar',
			array(
				'type'    => 'radio',
				'label'   => __('Display a sidebar on archive pages?', 'c9-starter'),
				'section' => 'c9_posts',
				'choices' => array(
					'hide'          => __('No Sidebar', 'c9-starter'),
					'archive-left'  => __('Left Sidebar', 'c9-starter'),
					'archive-right' => __('Right Sidebar', 'c9-starter'),
				),
			)
		);
	}
}
add_action('customize_register', 'c9_customize_register');
