<?php
/**
 * The sidebar containing the main widget area.
 *
 * @package c9-starter
 */

if (! is_active_sidebar('left-sidebar') ) {
    return;
}
?>

<div class="widget-area sidebar" id="left-sidebar" role="complementary">

    <?php dynamic_sidebar('left-sidebar'); ?>

</div><!-- #secondary -->
