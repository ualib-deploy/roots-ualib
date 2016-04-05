<?php $is_jumbortron_header = get_field( "jumbotron_header" ); ?>
<?php if(!is_front_page() && !is_array($is_jumbortron_header)): ?>

<div class="page-header">
    <div class="breadcrumbs" typeof="BreadcrumbList" vocab="http://schema.org/">
        <?php if(function_exists('bcn_display'))
        {
            bcn_display();
            $display = bcn_display(true);
            $display = htmlspecialchars($display);
            print($display);
        }?>
    </div>
    <h1>
        <?php echo roots_title(); ?>
    </h1>
</div>
<?php endif; ?>
