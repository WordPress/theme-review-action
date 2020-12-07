<?php
/**
 * Post rendering content according to caller of get_template_part.
 *
 * @package c9-starter
 */

?>
<div class="col-xs-12 col-sm-6 col-md-3">
	<article <?php post_class(); ?> id="post-<?php the_ID(); ?>">
		<?php
		if ( has_post_thumbnail() ) {
			// grab src, srcset, sizes from featured image for Retina support
			$c9_img_id     = get_post_thumbnail_id();
			$c9_img_src    = wp_get_attachment_image_url( $c9_img_id, 'c9-feature-medium-crop' );
			$c9_img_srcset = wp_get_attachment_image_srcset( $c9_img_id, 'c9-feature-medium-crop' );
			$c9_img_sizes  = wp_get_attachment_image_sizes( $c9_img_id, 'c9-feature-medium-crop' );

			?>

			<figure class="entry-image">
				<a href="<?php the_permalink(); ?>" title="<?php the_title_attribute(); ?>">
					<img src="<?php echo esc_url( $c9_img_src ); ?>" srcset="<?php echo esc_attr( $c9_img_srcset ); ?>" class="img-fluid" alt="<?php the_title_attribute(); ?>" sizes="<?php echo esc_attr( $c9_img_sizes ); ?>" />
				</a>
			</figure>

		<?php } ?>

		<header class="entry-header">
			<?php
			the_title(
				sprintf( '<h3 class="entry-title"><a href="%s" rel="bookmark">', esc_url( get_permalink() ) ),
				'</a></h2>'
			);
			?>

		</header><!-- .entry-header -->
		<div class="post-content mar30B">

			<?php
			wp_link_pages(
				array(
					'before' => '<div class="page-links">' . __( 'Pages:', 'c9-starter' ),
					'after'  => '</div>',
				)
				);
			?>

		</div><!-- .post-content -->

	</article><!-- #post-## -->
</div>
