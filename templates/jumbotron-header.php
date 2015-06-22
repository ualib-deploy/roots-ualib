<?php $fields = get_fields(); ?>
<div class="jumbotron-header" style="background-image: url(<?php print $fields['header_image']['url']; ?>)">
    <div class="jumbotron">
        <div class="container">
            <?php print $fields['header_content']; ?>
        </div>
    </div>
</div>