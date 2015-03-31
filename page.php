<?php while (have_posts()) : the_post(); ?>
  <?php get_template_part('templates/page', 'header'); ?>
  <?php if (!is_front_page()): get_template_part('templates/content', 'page'); ?>
  <?php else: ?>
       <div ng-class="{'one-search-results': appClass == 'bento'}" ng-view></div>
  <?php endif; ?>
<?php endwhile; ?>
