<?php
/**
 * The template for displaying the author pages.
 *
 * Learn more: https://codex.wordpress.org/Author_Templates
 *
 * @package c9-starter
 */

get_header();

?>


<div class="wrapper" id="author-wrapper">

    <div class="c9" id="content" tabindex="-1">

            <main class="site-main" id="main">

                <header class="page-header author-header entry-header">
                    <div class="container-narrow">
                        <div class="row mar20B p-5">
                        <?php
                        $curauth = ( isset($_GET['author_name']) ) ? get_user_by('slug', $author_name) : get_userdata(intval($author));
                        ?>
                        <?php if (! empty($curauth->ID) ) : ?>
                        <div class="col-xs-12 col-sm-4">
                            <?php echo get_avatar($curauth->ID, 512); ?>
                        </div>
                        <?php endif; ?>
                        <div class="col-xs-12 col-sm-8">

                            <h1><?php esc_html_e('About: ', 'c9-starter'); ?><?php echo esc_html($curauth->nickname); ?></h1>

                            <dl>
                                <?php if (! empty($curauth->user_url) ) : ?>
                                    <dt><?php esc_html_e('Website', 'c9-starter'); ?></dt>
                                    <dd>
                                        <a href="<?php echo esc_url($curauth->user_url); ?>"><?php echo esc_html($curauth->user_url); ?></a>
                                    </dd>
                                <?php endif; ?>

                                <?php if (! empty($curauth->user_description) ) : ?>
                                    <dt><?php esc_html_e('Profile', 'c9-starter'); ?></dt>
                                    <dd><?php echo esc_html($curauth->user_description); ?></dd>
                                <?php endif; ?>
                            </dl>

                        </div><!--.col-->
</div>
                    </div><!--.container-narrow-->
                </header><!-- .page-header -->
                <div class="container-narrow">
                    <div class="row pl-5">
                        <div class="col">
                                <h2><?php esc_html_e('Posts by', 'c9-starter'); ?> <?php echo esc_html($curauth->nickname); ?></h2>
                        </div>
                    </div>
                </div>
                <div class="container-narrow">
                    <div class="row mar30B p-5">

                <?php if (have_posts() ) : ?>
                    <?php
                    while ( have_posts() ) :
                        the_post();
                        get_template_part('loop-templates/content', get_post_format());
                    endwhile;
                    ?>
                    <?php
                        else :
                            get_template_part('loop-templates/content', 'none');
                        endif;
                        ?>
                    </div><!--.row-->
                </div><!--.container-->

            </main><!-- #main -->

            <!-- The pagination component -->
            <?php c9_pagination(); ?>

</div><!-- .c9 end -->

</div><!-- Wrapper end -->

<?php get_footer(); ?>
