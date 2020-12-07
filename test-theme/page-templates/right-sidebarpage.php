<?php
/**
 * Template Name: Right Sidebar Layout
 *
 * This template can be used to override the default template and sidebar setup
 *
 * @package c9-starter
 */

get_header();
?>

<div class="wrapper c9" id="page-wrapper">

	<div class="container page-right-sidebar" id="content">

		<div class="row no-gutters">

			<div class="
			<?php
			if ( is_active_sidebar( 'right-sidebar' ) ) :
			?>
			col-12 col-sm-10
			<?php
			else :
				?>
				col-12<?php endif; ?> content-area" id="primary">

				<main class="site-main" id="main" role="main">

					<?php
					while ( have_posts() ) :
						the_post();
						?>

						<?php get_template_part( 'loop-templates/content', 'page' ); ?>

					<?php endwhile; // end of the loop. ?>

				</main><!-- #main -->

				<?php get_sidebar( 'right' ); ?>

			</div><!-- #primary -->

		</div><!-- .row -->

	</div><!-- Container end -->

</div><!-- Wrapper end -->

<?php get_footer(); ?>
