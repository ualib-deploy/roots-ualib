<?php $is_jumbortron_header = get_field( "jumbotron_header" ); ?>
<?php if(!is_front_page() && !is_array($is_jumbortron_header)): ?>
<div class="page-header">
    <h1>
        <?php echo roots_title(); ?>
    </h1>
</div>
<?php endif; ?>
