<?php

/**
 * The template for displaying search results pages.
 *
 * @package c9-starter
 */

get_header();

?>

<div class="wrapper" id="search-wrapper">

    <div class="page-search-results c9" id="content" tabindex="-1">

        <main class="site-main" id="main">

            <?php if (have_posts() ) : ?>

            <div class="c9-grid mar20B">
                <div class="container header-container-search">
                    <div class="row no-gutter">
                        <div class="container">
                            <div class="entry-search-result">

                                <h1 class="entry-title text-center mar30T">
                                    <?php
                                    printf(
                                    /* translators:*/
                                        esc_html__('Results for: %s', 'c9-starter'),
                                        '<span>' . get_search_query() . '</span>'
                                    );
                                    ?>
                                </h1>

                            </div>


                        </div>

                    </div><!-- .row-->
                </div><!-- .container-fluid-->
            </div><!-- .c9 block column container -->


            <div class="container">
                <div class="row no-gutter">
                <?php
                while ( have_posts() ) :
                    the_post();
                    /**
                     * Run the loop for the search to output the results.
                     * If you want to overload this in a child theme then include a file
                     * called content-search.php and that will be used instead.
                     */
                    get_template_part('loop-templates/content', 'search');
                endwhile;

                    else :
                        get_template_part('loop-templates/content', 'none');
                    endif;
                    ?>

                </div><!-- .row-->
            </div><!-- .container-->

        </main><!-- #main -->
        <!-- The pagination component -->
        <?php c9_pagination(); ?>


    </div><!-- .c9 end -->

</div><!-- Wrapper end -->

<?php get_footer(); ?>
