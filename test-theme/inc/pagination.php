<?php

/**
 * Pagination layout.
 *
 * @package C9
 */

if (!function_exists('c9_pagination')) {
	function c9_pagination($args = [], $class = 'pagination')
	{

		if ($GLOBALS['wp_query']->max_num_pages <= 1) {
			return;
		}

		$args = wp_parse_args(
			$args,
			[
				'mid_size'           => 2,
				'prev_next'          => false,
				'prev_text'          => __('&laquo;', 'c9-starter'),
				'next_text'          => __('&raquo;', 'c9-starter'),
				'screen_reader_text' => __('Posts navigation', 'c9-starter'),
				'type'               => 'array',
				'current'            => max(1, get_query_var('paged')),
			]
		);

		$links     = paginate_links($args);
		$next_link = get_next_posts_page_link();
		$prev_link = get_previous_posts_page_link();

?>

		<nav aria-label="<?php echo esc_attr($args['screen_reader_text']); ?>">
			<ul class="pagination">
				<li class="page-item">
					<a class="page-link" href="<?php echo esc_url($prev_link); ?>" aria-label="<?php esc_attr_e('Previous', 'c9-starter'); ?>">
						<span aria-hidden="true"><?php esc_html($args['prev_text']); ?></span>
						<span class="sr-only"><?php esc_html_e('Previous', 'c9-starter'); ?></span>
					</a>
				</li>

				<?php
				$i = 1;
				foreach ($links as $link) {
				?>
					<li class="page-item
            <?php
					if ($i == $args['current']) {
						echo 'active';
					};
			?>
                                            ">
						<?php echo str_replace('page-numbers', 'page-link', $link); ?>
					</li>

				<?php
					$i++;
				}
				?>

				<li class="page-item">
					<a class="page-link" href="<?php echo esc_url($next_link); ?>" aria-label="<?php esc_attr__('Next', 'c9-starter'); ?>">
						<span aria-hidden="true"><?php esc_html($args['next_text']); ?></span>
						<span class="sr-only"><?php esc_html_e('Next', 'c9-starter'); ?></span>
					</a>
				</li>
			</ul>
		</nav>
<?php
	}
}
