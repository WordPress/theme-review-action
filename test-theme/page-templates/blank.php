<?php

/**
 * Template Name: No Header or Footer Template
 *
 * Template for displaying a blank page with no header or footer
 *
 * @package c9-starter
 */

?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>

<head>
	<meta charset="<?php bloginfo('charset'); ?>">
	<meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="mobile-web-app-capable" content="yes">
	<meta name="apple-mobile-web-app-capable" content="yes">
	<link rel="profile" href="http://gmpg.org/xfn/11">
	<link rel="pingback" href="<?php bloginfo('pingback_url'); ?>">
	<?php wp_head(); ?>
</head>

<body class="theme-c9 page-template-blank">
	<?php
	while (have_posts()) :
		the_post();
	?>

		<?php get_template_part('loop-templates/content', 'blank'); ?>

	<?php endwhile; // end of the loop.
	?>
	<?php wp_footer(); ?>
</body>

</html>
