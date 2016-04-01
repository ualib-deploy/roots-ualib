<?php $fields = get_fields(); ?>
<?php $jumboHeadBg = isset($fields['header_image']['url']) ? $fields['header_image']['url'] : false; ?>

<div class="jumbotron-header" <?php if ($jumboHeadBg !== false) print 'style="background-image: url('.$jumboHeadBg.');"'; ?>>
    <div class="jumbotron drewtest">
        <div class="container">
              <div class="breadcrumbs" typeof="BreadcrumbList" vocab="http://schema.org/">
                  <?php if(function_exists('bcn_display'))
                  {
                      bcn_display();
                  }?>
              </div>
            <?php print $fields['header_content']; ?>
        </div>
    </div>
</div>
