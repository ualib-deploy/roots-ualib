<?php if(!is_front_page() && !(is_array(get_field( "hide_page_header_title" )) && get_field( "hide_page_header_title" )[0] === 'hide')): ?>
<div class="page-header">
    <h1>
        <?php echo roots_title(); ?>
    </h1>
</div>
<?php endif; ?>
