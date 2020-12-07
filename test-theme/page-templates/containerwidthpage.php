<?php
/**
 * Template Name: Container Width With Title Page
 *
 * Template for displaying a page without sidebar even if a sidebar widget is published.
 *
 * @package c9-starter
 */

get_header();
?>

<div class="container-width-page-wrapper c9" id="container-width-page-wrapper">

	<main class="site-main" id="main" role="main">

		<?php
		while ( have_posts() ) :
the_post();
?>

			<?php get_template_part( 'loop-templates/content', 'page-container-with-title' ); ?>


		<?php endwhile; // end of the loop. ?>

	</main><!-- #main -->

</div><!-- Wrapper end -->

<?php get_footer(); ?>
