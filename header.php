<?php
/** Header for ChillZone theme */
?><!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php bloginfo('name'); ?><?php wp_title(' | '); ?></title>
    <link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/templatemo-chillzone-fashion.css">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
