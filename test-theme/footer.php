<?php

/**
 * The template for displaying the footer.
 *
 * Contains the closing of the #content div and all content after.
 *
 * @package c9
 */
?>
<?php
if (file_exists(locate_template('client/inc/footer.php'))) {

	include(locate_template('client/inc/footer.php'));
} else {

	$c9_footer_default = '&copy; ' . date("Y") . ' ' . get_bloginfo('name') . '. <a href="https://www.covertnine.com" title="' . esc_attr__('Web design company in Chicago', 'c9-starter') . '" target="_blank">' . esc_html__('WordPress Website design by COVERT NINE', 'c9-starter') . '</a>.';
	$c9_footer_search = get_theme_mod('c9_show_search', 'show');
	$c9_footer_copyright = get_theme_mod('c9_copyright_content', $c9_footer_default);

	require_once(get_template_directory() . '/inc/class-footer.php');
	$c9_social_links = c9FooterHelpers::build_c9_social();

	if (is_active_sidebar('footerfull') || !empty($c9_footer_copyright) || 'show' === $c9_footer_search  || $c9_social_links) {
?>
		<div class="footer-entirety">
			<?php
			get_sidebar('footerfull');
			?>
			<div class="footer-wrapper" id="wrapper-footer">
				<div class="container">
					<div class="row">
						<div class="col-md-12">
							<footer class="site-footer" id="colophon">
								<div class="site-info">
									<div class="container">
										<div class="row text-center d-flex justify-content-between align-items-center">
											<?php
											if ($c9_social_links) :
											?>
												<div class="col-xs-6 col-sm-3 col-lg-2 p-0 footer-social-wrapper">
													<div class="footer-social text-center">
														<?php
														foreach ($c9_social_links as $link_key => $link_value) {
															echo $link_value;
														}
														?>
													</div>
												</div>
											<?php endif; ?>
											<?php
											if (!empty($c9_footer_copyright)) {
												echo '<div class="col-xs-12 col-sm-6 col-md-5 p-0 footer-copyright-wrapper"><p class="text-center copyright">' . wp_kses_post($c9_footer_copyright) . '</p></div>';
											}

											if ('show' === $c9_footer_search) :
											?>
												<div class="col-xs-12 col-sm-12 col-md-2 text-left footer-search-wrapper">
													<div class="footer-search">
														<?php get_search_form(); ?>
													</div>
												</div>
											<?php
											endif;
											?>
										</div><!-- .row-->
									</div><!-- .container-->
								</div><!-- .site-info -->
							</footer><!-- #colophon -->
						</div>
						<!--col end -->
					</div><!-- row end -->
				</div><!-- container end -->
			</div><!-- wrapper end -->
		</div>
		<!--end .footer-entirety-->
	<?php
	}
	?>
<?php
}; // end of checking for client footer.php
?>
</div>
<!--end smoothwrapper-->
<div id="fullscreensearch">
	<form role="search" method="get" id="fullscreen" action="/">
		<div>
			<span class="sr-only"><?php esc_html_e('Search for:', 'c9-starter'); ?></span>
			<input type="search" class="search-field" name="s" value="" tabindex="0" placeholder="<?php esc_attr_e('Search...', 'c9-starter'); ?>" />
			<button type="submit" class="btn"><?php esc_html_e('Search', 'c9-starter'); ?></button>
		</div>
	</form>
	<button type="button" class="search-close"><i class="fa fa-close"></i><span class="sr-only"><?php esc_html_e('Close', 'c9-starter'); ?></span></button>
</div>
</div><!-- #page we need this extra closing tag here -->
<?php wp_footer(); ?>

</body>

</html>
