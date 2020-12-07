<?php
/**
 * The template for displaying all single posts.
 *
 * @package c9-starter
 */

get_header();

$c9_blog_sidebar = get_theme_mod('c9_blog_sidebar', 'hide');

//set sidebar variables pending on theme options and sidebars being active
if ($c9_blog_sidebar != 'hide' ) {
    $sidebar       = true;
    $sidebar_left  = 'sidebar-left' === get_theme_mod('c9_blog_sidebar') && is_active_sidebar('left-sidebar') ? true : false;
    $sidebar_right = 'sidebar-right' === get_theme_mod('c9_blog_sidebar') && is_active_sidebar('right-sidebar') ? true : false;
} else {
    $sidebar        = false;
    $sidebar_left  = false;
    $sidebar_right = false;
}
?>

<div class="wrapper" id="single-wrapper">
    <div class="container-narrow c9" id="content" tabindex="-1">
        <div class="row no-gutters">
            <div class="col-12 content-area" id="primary">

            <?php

            if ($sidebar_left ) :

                get_sidebar('left');

            endif;
            ?>
                <main class="site-main" id="main">

                <?php
                while ( have_posts() ) :

                    the_post();

                    get_template_part('loop-templates/content', 'single');

                    c9_post_nav();

                    // If comments are open or we have at least one comment, load up the comment template.
                    if (comments_open() || get_comments_number() ) :

                        comments_template();

                    endif;
                endwhile; // end of the loop.
                ?>


                </main><!-- #main -->
            <?php


            if ($sidebar_right ) :

                get_sidebar('right');

            endif;
            ?>
            </div><!--end primary-->
        </div><!-- Row end -->
    </div><!--container--narrow end-->
</div><!-- Wrapper end -->

<?php get_footer(); ?>
