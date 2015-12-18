<?php $fields = get_fields(); ?>
<?php $jumboHeadBg = isset($fields['header_image']['url']) ? $fields['header_image']['url'] : false; ?>
<div class="jumbotron-header" <?php if ($jumboHeadBg !== false) print 'style="background-image: url('.$jumboHeadBg.');"'; ?>>
    <div class="jumbotron">
        <div class="container">
            <?php print $fields['header_content']; ?>
        </div>
    </div>
</div>