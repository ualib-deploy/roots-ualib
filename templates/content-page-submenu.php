<?php while (have_posts()) : the_post(); ?>
    <?php get_template_part('templates/page', 'header'); ?>
    <div class="row">
        <div class="col-md-9">
            <?php if (!is_front_page()): get_template_part('templates/content', 'page'); ?>
            <?php else: ?>
                <div ng-class="{'one-search-results': appClass == 'bento'}" ng-view></div>
            <?php endif; ?>
        </div>
        <div class="col-md-3 multipage-menu">
            <?php print $multipage_menu; ?>
        </div>
    </div>
<?php endwhile; ?>