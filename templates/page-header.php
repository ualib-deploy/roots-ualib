<?php $hide_title = is_array(get_field( "hide_page_header_title" )) && get_field( "hide_page_header_title" )[0] === 'hide'; ?>
<?php if(!is_front_page() && !$hide_title): ?>
<div class="page-header">
    <h1>
        <?php print_r(get_field( "hide_page_header_title" )); ?>
        <?php echo roots_title(); ?>
    </h1>
</div>
<?php endif; ?>
