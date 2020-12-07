<?php

/**
 * Single post partial template.
 *
 * @package c9-starter
 */
$c9_post_header = get_post_meta($post->ID, 'c9_post_header_size', true);
$header_size 	 		= isset($c9_post_header) ? $c9_post_header : 'small';
$c9_blog_sidebar 		= get_theme_mod('c9_blog_sidebar', 'hide');

//set sidebar variables pending on theme options and sidebars being active
if ($c9_blog_sidebar  != 'hide') {
	$sidebar       		= true;
	$sidebar_left  		= 'sidebar-left' === get_theme_mod('c9_blog_sidebar') && is_active_sidebar('left-sidebar') ? true : false;
	$sidebar_right 		= 'sidebar-right' === get_theme_mod('c9_blog_sidebar') && is_active_sidebar('right-sidebar') ? true : false;

	// set container classes based on sidebar selection
	if ($c9_blog_sidebar == 'sidebar-left') {

		$sidebar_class = ' sidebar-left';
	} elseif ($c9_blog_sidebar == 'sidebar-right') {

		$sidebar_class = ' sidebar-right';
	} //end setting sidebar classes

} else { //no sidebar on single posts
	$sidebar 	   		= false;
	$sidebar_left  		= false;
	$sidebar_right 		= false;
}
?>
<article <?php post_class(); ?> id="post-<?php the_ID(); ?>">

	<?php if ('large' === $header_size) { ?>

		<header class="entry-big-header">
			<div class="entry-title-box">
				<?php the_title('<h1 class="entry-title">', '</h1>'); ?>

				<div class="entry-meta">
					<?php c9_posted_on(); ?>

				</div>
			</div>
			<!--.entry-title-box-->

			<?php
			if (has_post_thumbnail()) {

				// grab src, srcset, sizes from featured image for Retina support
				$c9_img_id  = get_post_thumbnail_id($post->ID);
				$c9_img_src = wp_get_attachment_image_url($c9_img_id, 'c9-feature-hd-wide');

			?>
				<figure class="entry-header-bgimg" style="background-image: url(<?php echo esc_url($c9_img_src); ?>);"></figure>

			<?php } ?>

		</header>
		<?php
	}
	if ('small' === $header_size) {
		if (has_post_thumbnail()) {

			// grab src, srcset, sizes from featured image for Retina support
			$c9_img_id     = get_post_thumbnail_id($post->ID);
			$c9_img_src    = wp_get_attachment_image_url($c9_img_id, 'large');
			$c9_img_srcset = wp_get_attachment_image_srcset($c9_img_id, 'large');
			$c9_img_sizes  = wp_get_attachment_image_sizes($c9_img_id, 'large');

		?>
			<figure class="entry-image<?php if (!empty($sidebar_class)) {
											echo $sidebar_class;
										} ?>">
				<a href="<?php the_permalink(); ?>" title="<?php the_title_attribute(); ?>">
					<img src="<?php echo esc_url($c9_img_src); ?>" srcset="<?php echo esc_attr($c9_img_srcset); ?>" class="img-fluid mx-auto  d-block" alt="<?php the_title_attribute(); ?>" sizes="<?php echo esc_attr($c9_img_sizes); ?>" />
				</a>
			</figure>

		<?php } ?>

		<header class="entry-header<?php if (!empty($sidebar_class)) {
										echo $sidebar_class;
									} ?>">

			<?php the_title('<h1 class="entry-title">', '</h1>'); ?>

			<div class="entry-meta">
				<?php c9_posted_on(); ?>

			</div>

		</header>
	<?php
	} //end small header
	?>

	<div class="entry-content<?php if (!empty($sidebar_class)) {
									echo $sidebar_class;
								} ?>">

		<?php the_content(); ?>

	</div><!-- .entry-content -->



	<footer class="entry-footer<?php if (!empty($sidebar_class)) {
									echo $sidebar_class;
								} ?>">
		<div class="entry-footer-content mar30B">
			<?php
			wp_link_pages(
				array(
					'before' => '<div class="page-links">' . __('Pages:', 'c9-starter'),
					'after'  => '</div>',
				)
			);
			?>
		</div>

		<?php c9_entry_footer(); ?>

	</footer><!-- .entry-footer -->

</article><!-- #post-## -->
