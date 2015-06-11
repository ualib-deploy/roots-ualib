<?php $hide_title = get_field( "hide_page_header_title" ); ?>
<?php if(!is_front_page() && !is_array($hide_title)): ?>
<div class="page-header">
    <h1>
        <?php echo roots_title(); ?>
    </h1>
</div>
<?php endif; ?>
