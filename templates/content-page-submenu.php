<?php while (have_posts()) : the_post(); ?>
    <?php get_template_part('templates/page', 'header'); ?>
    <?php $pageId = get_the_ID(); ?>
    <div class="row">
        <div class="col-md-3 col-md-push-9">


            <div class="dropdown multipage-menu visible-xs visible-sm">
                <button class="btn btn-default dropdown-toggle" type="button">
                    Page Navigation
                </button>
                <ul class="dropdown-menu" role="menu">
                    <?php foreach ($multipage_menu as $item): ?>
                        <li role="presentation" <?php if ($item->object_id == $pageId) print 'class="active"'; ?>>
                            <?php if ((int)$item->menu_item_parent): ?>
                                <ul>
                                    <li role="presentation" <?php if ($item->object_id == $pageId) print 'class="active"'; ?>>
                                        <a role="menuitem" tabindex="-1" href="<?php print $item->url; ?>"><?php print $item->title; ?></a>
                                    </li>
                                </ul>
                            <?php else: ?>
                                <a role="menuitem" tabindex="-1" href="<?php print $item->url; ?>"><?php print $item->title; ?></a>
                            <?php endif; ?>
                        </li>
                    <?php endforeach; ?>
                </ul>
            </div>
            <div class="multipage-menu">
                <ul class="hidden-xs hidden-sm" role="menu">
                    <?php foreach ($multipage_menu as $item): ?>
                        <li role="presentation" <?php if ($item->object_id == $pageId) print 'class="active"'; ?>>
                            <?php if ((int)$item->menu_item_parent): ?>
                                <ul>
                                    <li role="presentation" <?php if ($item->object_id == $pageId) print 'class="active"'; ?>>
                                        <a role="menuitem" tabindex="-1" href="<?php print $item->url; ?>"><?php print $item->title; ?></a>
                                    </li>
                                </ul>
                            <?php else: ?>
                                <a role="menuitem" tabindex="-1" href="<?php print $item->url; ?>"><?php print $item->title; ?></a>
                            <?php endif; ?>
                        </li>
                    <?php endforeach; ?>
                </ul>
            </div>

        </div>
        <div class="col-md-9 col-md-pull-3">
            <?php if (!is_front_page()): get_template_part('templates/content', 'page'); ?>
            <?php else: ?>
                <div ng-class="{'one-search-results': appClass == 'bento'}" ng-view></div>
            <?php endif; ?>
        </div>
    </div>
<?php endwhile; ?>