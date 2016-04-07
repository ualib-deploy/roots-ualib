<?php $is_jumbortron_header = get_field( "jumbotron_header" ); ?>
<?php if(!is_front_page() && !is_array($is_jumbortron_header)): ?>

<ol class="breadcrumb" typeof="BreadcrumbList" vocab="http://schema.org/">
        <?php if(function_exists('bcn_display'))
        {
            $display = bcn_display(true);
            //$display = '<ol class="breadcrumb">' . $display . '</ol>';
            print($display);
        }?>
</ol>
<div class="page-header">
    
    <h1>
        <?php echo roots_title(); ?>
    </h1>
</div>
<?php endif; ?>
