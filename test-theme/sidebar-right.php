<?php
/**
 * The right sidebar containing the main widget area.
 *
 * @package c9-starter
 */

if (! is_active_sidebar('right-sidebar') ) {
    return;
}

?>


<div class="widget-area sidebar" id="right-sidebar" role="complementary">

    <?php dynamic_sidebar('right-sidebar'); ?>

</div><!-- #secondary -->
