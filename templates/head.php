<!doctype html>
<html class="no-js" <?php language_attributes(); ?>>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title><?php wp_title('|', true, 'right'); ?></title>
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <link rel="alternate" type="application/rss+xml" title="<?php echo get_bloginfo('name'); ?> Feed" href="<?php echo esc_url(get_feed_link()); ?>">
  <link href="//fonts.googleapis.com/css?family=Ubuntu:300,400,500|Oxygen:400,700,300|Open+Sans|EB+Garamond|Lato:300,400" rel="stylesheet">
  <link rel="stylesheet" href="https://rawgit.com/geedmo/yamm3/master/yamm/yamm.css">
  <link href="//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" rel="stylesheet">

  <?php wp_head(); ?>

  <?php if (is_front_page()): ?>
    <link href="/oneSearch/will-test/hours/hours.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.26/angular-animate.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/holder/2.4.1/holder.js"></script>
    <script src="/oneSearch/will-test/hours/hours-templates.js"></script>
    <script src="/oneSearch/will-test/hours/hours.js"></script>
  <?php endif; ?>
</head>
