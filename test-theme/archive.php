<?php
/**
 * The template for displaying archive pages.
 *
 * Learn more: http://codex.wordpress.org/Template_Hierarchy
 *
 * @package c9-starter
 */

get_header();
$c9_archive_sidebar = get_theme_mod('c9_archive_sidebar', 'hide');

if ($c9_archive_sidebar != 'hide' ) {
    $sidebar_left  = 'archive-left' === get_theme_mod('c9_archive_sidebar') && is_active_sidebar('left-sidebar') ? true : false;
    $sidebar_right = 'archive-right' === get_theme_mod('c9_archive_sidebar') && is_active_sidebar('right-sidebar') ? true : false;
} else {
    $sidebar_left  = false;
    $sidebar_right = false;
}
?>
<div class="wrapper" id="archive-wrapper">
    <div class="container c9" id="content" tabindex="-1">

        <div class="row">

            <main class="site-main" id="main">

                <?php if (have_posts() ) : ?>

                    <header class="page-header">
                        <div class="container">
                    <?php
                    the_archive_title('<h1 class="page-title">', '</h1>');
                    the_archive_description('<div class="taxonomy-description">', '</div>');
                    ?>
                        </div>
                    </header><!-- .page-header -->
                    <div class="container container-posts c9">
                        <div class="row no-gutter">

                    <?php if ($sidebar_left ) : ?>

                <div class="col-sm-12 col-md-2 sidebar">
                        <?php dynamic_sidebar('left-sidebar'); ?>
                </div>

                        <?php echo '<div class="col-sm-12 col-md-10">'; ?>

                <?php elseif ($sidebar_right ) : ?>

                    <?php echo '<div class="col-12 col-sm-10 content-area" id="primary">'; ?>

                <?php else : ?>

                <div class="col-12 content-area" id="primary">

                <?php endif; ?>

                    <div class="row">
                    <?php if (have_posts() ) : ?>
                        <?php
                        while ( have_posts() ) :
                            the_post();

                            /*
                            * Include the Post-Format-specific template for the content.
                            * If you want to override this in a child theme, then include a file
                            * called content-___.php (where ___ is the Post Format name) and that will be used instead.
                            */
                            get_template_part('loop-templates/content', get_post_format());
                        endwhile;
                        ?>
                        <?php else : ?>

                            <?php get_template_part('loop-templates/content', 'none'); ?>

                        <?php endif; ?>
                    </div>
                </div>
                    <?php
                    if ($sidebar_right ) :
                        ?>
                <div class="col-12 col-sm-2 content-area sidebar" id="primary">

                        <?php dynamic_sidebar('right-sidebar'); ?>

                </div>
                    <?php endif; ?>

                        </div><!--.row-->
                    </div><!--.container-->
                    <?php
                else :
                    get_template_part('loop-templates/content', 'none');
                endif;
                ?>

            </main><!-- #main -->

            <!-- The pagination component -->
            <?php c9_pagination(); ?>

        </div> <!-- .row -->

    </div><!-- Container end -->

</div><!-- Wrapper end -->

<?php get_footer(); ?>
