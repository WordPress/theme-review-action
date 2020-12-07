<?php
/**
 * The template for displaying 404 pages (not found).
 *
 * @package c9-starter
 */

get_header();

?>

<div class="wrapper" id="error-404-wrapper">

    <div class="container c9" id="content" tabindex="-1">

        <div class="row">

            <div class="col-12 content-area" id="primary">

                <main class="site-main" id="main">

                    <section class="error-404 not-found">
                        <div class="page-content">

                            <header class="page-header container-narrow">

                                <h1 class="page-title">
                                    <?php
                                    esc_html_e(
                                        'Oops! That page can&rsquo;t be found.',
                                        'c9-starter'
                                    );
                                    ?>
                                </h1>

                            </header><!-- .page-header -->

                            <div class="container-narrow mar30B">

                                <p>
                                <?php
                                esc_html_e(
                                    'It looks like nothing was found at this location. Maybe try one of the links below or a search?',
                                    'c9-starter'
                                );
                                ?>
                                </p>

                                <?php get_search_form(); ?>

                            </div><!-- .container-narrow -->
                        </div><!-- .page-content-->
                    </section><!-- .error-404 -->

                </main><!-- #main -->

            </div><!-- #primary -->

        </div><!-- .row -->

    </div><!-- Container end -->

</div><!-- Wrapper end -->

<?php get_footer(); ?>
