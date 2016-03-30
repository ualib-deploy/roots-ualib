<div class="breadcrumbs" typeof="BreadcrumbList" vocab="http://schema.org/">
    <?php if(function_exists('bcn_display'))
    {
        $display = bcn_display(true);
        $display = str_replace('> Using the Library', '', $display);
        $display = str_replace('> Research Tools', '', $display);
        $display = str_replace('> About', '', $display);
        $display = str_replace('> Library Help', '', $display);
        var_dump($display);
        echo("HELLO");
    }?>
</div>
<?php the_content(); ?>
<?php wp_link_pages(array('before' => '<nav class="pagination">', 'after' => '</nav>')); ?>
