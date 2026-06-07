<?php
// Theme setup and asset enqueueing
function chillzone_setup() {
    add_theme_support('title-tag');
    register_nav_menus(array(
        'primary' => 'Primary Menu',
    ));
}
add_action('after_setup_theme', 'chillzone_setup');

function chillzone_enqueue_assets() {
    // Theme stylesheet (style.css)
    wp_enqueue_style('chillzone-style', get_stylesheet_uri());

    // Existing templatemo stylesheet (keeps your original styles)
    $templatemo = get_template_directory_uri() . '/templatemo-chillzone-fashion.css';
    if ( file_exists( get_template_directory() . '/templatemo-chillzone-fashion.css' ) ) {
        wp_enqueue_style('chillzone-templatemo', $templatemo, array('chillzone-style'));
    }

    // Enqueue common scripts (only if files exist in theme folder)
    $scripts = array(
        'templatemo-scripts' => 'templatemo-chillzone-scripts.js',
        'content-manager' => 'content-manager.js',
        'user-session' => 'user-session.js',
        'advanced-cart' => 'advanced-cart.js',
        'floating-cart' => 'floating-cart.js',
        'simple-cart' => 'simple-cart.js',
        'order-manager' => 'order-manager.js',
        'product-manager' => 'product-manager.js',
        'profile-settings' => 'profile-settings.js',
        'init-admin' => 'init-admin.js',
        'simple-order-manager' => 'simple-order-manager.js',
        'slide-out-cart' => 'slide-out-cart.js'
    );

    foreach ($scripts as $handle => $filename) {
        $abs = get_template_directory() . '/' . $filename;
        $url = get_template_directory_uri() . '/' . $filename;
        if ( file_exists($abs) ) {
            wp_enqueue_script($handle, $url, array(), null, true);
        }
    }
}
add_action('wp_enqueue_scripts', 'chillzone_enqueue_assets');
