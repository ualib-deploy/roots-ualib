<?php $is_jumbortron_header = get_field( "jumbotron_header" ); ?>
<?php if(!is_front_page() && !is_array($is_jumbortron_header)): ?>

<div class="page-header">
    <div class="breadcrumbs" typeof="BreadcrumbList" vocab="http://schema.org/">
        <?php if(function_exists('bcn_display'))
        {
            $display = bcn_display(true);
            print_r($display); 
            print_r("Testing...")
        }?>
    </div>
    <h1>
        <?php echo roots_title(); ?>
    </h1>
</div>
<?php endif; ?>
