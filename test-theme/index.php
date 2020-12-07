<?php
/**
 * The main template file.
 *
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * E.g., it puts together the home page when no home.php file exists.
 * Learn more: http://codex.wordpress.org/Template_Hierarchy
 *
 * @package c9-starter
 */

get_header();
$archive_sidebar = get_theme_mod('c9_archive_sidebar', 'hide');

if ($archive_sidebar != 'hide' ) {
    $sidebar_left  = 'archive-left' === get_theme_mod('c9_archive_sidebar') && is_active_sidebar('left-sidebar') ? true : false;
    $sidebar_right = 'archive-right' === get_theme_mod('c9_archive_sidebar') && is_active_sidebar('right-sidebar') ? true : false;
} else {
    $sidebar_left  = false;
    $sidebar_right = false;
}
?>

<div class="wrapper" id="index-wrapper">

    <main class="site-main" id="main">

        <div class="container container-posts c9" id="content">

            <div class="row no-gutter">

                <?php if ($sidebar_left ) : ?>

                <div class="col-sm-12 col-md-2 content-area sidebar">
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
                <div class="col-12 col-sm-2 sidebar content-area" id="primary">

                    <?php dynamic_sidebar('right-sidebar'); ?>

                </div>
                <?php endif; ?>
            </div><!--end .row-->
        </div><!-- .container-->

    </main><!-- #main -->

    <!-- The pagination component -->
    <?php c9_pagination(); ?>

</div><!-- Wrapper end -->

<?php get_footer(); ?>
