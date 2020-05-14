<?php $is_jumbortron_header = function_exists('get_fields') ? get_field( "jumbotron_header" ) : null; ?>
<?php if(!is_front_page() && (empty($is_jumbortron_header))): ?>

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
