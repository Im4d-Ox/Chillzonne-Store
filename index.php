<?php
/**
 * Main index template for the ChillZone theme
 */
get_header();
<?php
/*
Template Name: Single File ChillZone
Description: Single-file theme page that inlines the main CSS and JS when available.
*/
?><!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php bloginfo('name'); ?></title>
    <style>
    /* Inlined templatemo stylesheet if available */
    <?php
    $tm_path = get_template_directory() . '/templatemo-chillzone-fashion.css';
    if ( file_exists($tm_path) ) {
        echo file_get_contents($tm_path);
    }
    ?>

    /* Inline component styles (original page overrides) */
    /* Authentication Buttons Styling */
        .auth-buttons {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-left: 20px;
        }

        .auth-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 18px;
            border-radius: 25px;
            text-decoration: none;
            font-weight: 600;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            border: 2px solid transparent;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .auth-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s ease;
        }

        .auth-btn:hover::before {
            left: 100%;
        }

        .auth-btn-primary {
            background: linear-gradient(135deg, #ff3366 0%, #ff1a4d 100%);
            color: white;
            border-color: rgba(255, 51, 102, 0.3);
        }

        .auth-btn-primary:hover {
            background: linear-gradient(135deg, #ff1a4d 0%, #ff3366 100%);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(255, 51, 102, 0.4);
            border-color: rgba(255, 51, 102, 0.6);
        }

        .auth-btn-secondary {
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border: 2px solid rgba(255, 255, 255, 0.3);
            backdrop-filter: blur(10px);
        }

        .auth-btn-secondary:hover {
            background: rgba(255, 51, 102, 0.2);
            border-color: #ff3366;
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(255, 51, 102, 0.3);
        }

        .auth-btn-icon {
            font-size: 14px;
            transition: transform 0.3s ease;
        }

        .auth-btn:hover .auth-btn-icon {
            transform: scale(1.1);
        }

        .auth-btn-text {
            font-weight: 700;
            transition: all 0.3s ease;
        }

        /* Mobile responsive auth buttons */
        @media (max-width: 768px) {
            .auth-buttons {
                margin-left: 10px;
                gap: 8px;
            }

            .auth-btn {
                padding: 8px 14px;
                font-size: 12px;
            }

            .auth-btn-text {
                display: none;
            }

            .auth-btn-icon {
                font-size: 16px;
            }
        }

        @media (max-width: 480px) {
            .auth-buttons {
                margin-left: 5px;
            }

            .auth-btn {
                padding: 6px 12px;
            }
        }

        /* (Additional inline styles from original page omitted for brevity) */
    </style>
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?> >

<!-- Begin page content (converted from original index.html) -->
    <nav id="navbar">
        <div class="nav-container">
            <a href="#home" class="logo-link">
                <svg class="logo-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#fff;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#ff3366;stop-opacity:1" />
                        </linearGradient>
                    </defs>
                    <polygon points="50,10 20,50 50,90 80,50" fill="none" stroke="url(#logoGrad)" stroke-width="3"/>
                    <circle cx="50" cy="50" r="5" fill="url(#logoGrad)"/>
                </svg>
                <span class="logo-text">ChillZone</span>
            </a>
            <ul class="nav-links">
                <li><a href="#home" class="nav-link active">Home</a></li>
                <li><a href="products.html" class="nav-link">Products</a></li>
                <li><a href="#featured" class="nav-link">Featured</a></li>
                <li><a href="#contact" class="nav-link">Contact</a></li>
            </ul>

            <!-- Authentication Buttons -->
            <div class="auth-buttons">
                <a href="login.html" class="auth-btn auth-btn-primary">
                    <span class="auth-btn-text">Sign In</span>
                    <span class="auth-btn-icon">🔐</span>
                </a>
                <a href="signup.html" class="auth-btn auth-btn-secondary">
                    <span class="auth-btn-text">Sign Up</span>
                    <span class="auth-btn-icon">✨</span>
                </a>
            </div>

            <!-- User Profile Button (shown when logged in) -->
            <div class="user-profile-btn" id="userProfileBtn" style="display: none;">
                <button class="user-btn" onclick="toggleUserMenu()">
                    <span class="user-avatar">👤</span>
                    <span class="user-name" id="userDisplayName">User</span>
                    <span class="user-dropdown-icon">▼</span>
                </button>

                <!-- User Dropdown Menu -->
                <div class="user-menu" id="userMenu">
                    <div class="user-menu-header">
                        <span class="user-avatar-large">👤</span>
                        <div class="user-info">
                            <div class="user-full-name" id="userFullName">User Name</div>
                            <div class="user-role" id="userRole">Regular User</div>
                        </div>
                    </div>
                    <div class="user-menu-divider"></div>
                    <a href="#" class="user-menu-item profile-link" onclick="openProfile()">
                        <span class="menu-icon">👤</span>
                        <span>Profile</span>
                    </a>
                    <a href="#" class="user-menu-item orders-link" onclick="openOrders()">
                        <span class="menu-icon">🛒</span>
                        <span>Orders</span>
                    </a>
                    <a href="#" class="user-menu-item settings-link" onclick="openSettings()">
                        <span class="menu-icon">⚙️</span>
                        <span>Settings</span>
                    </a>
                    <div class="user-menu-divider admin-divider" id="adminDivider" style="display: none;"></div>
                    <a href="admin-dashboard.html" class="user-menu-item admin-link" id="adminLink" style="display: none;">
                        <span class="menu-icon">🛡️</span>
                        <span>Admin Dashboard</span>
                    </a>
                    <div class="user-menu-divider"></div>
                    <button onclick="logout()" class="user-menu-item logout-btn">
                        <span class="menu-icon">🚪</span>
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>

            <li><a href="#contact" class="nav-cta">Get In Touch</a></li>
        </div>
        <div class="menu-toggle" id="menuToggle">
            <span></span>
            <span></span>
            <span></span>
            <div class="menu-toggle" id="menuToggle">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    </nav>

    <div class="mobile-nav" id="mobileNav">
        <ul class="mobile-nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="products.html">Products</a></li>
            <li><a href="#featured">Featured</a></li>
            <li><a href="#contact">Contact</a></li>
        </ul>
    </div>

    <section class="hero" id="home">
        <div class="hero-bg"></div>
        <div class="hero-container">
            <div class="hero-left">
                <div class="hero-badge">New Gaming Collection 2025</div>
                <h1 class="hero-title">
                    <span class="line"><span>Best <span class="accent">Gaming</span></span></span>
                    <span class="line"><span>Experience</span></span>
                </h1>
                <p class="hero-description">
                    Discover our premium collection of games and FiveM scripts where innovation meets gameplay. 
                    Each script and game is crafted to enhance your server and elevate your gaming experience.
                </p>
                <div class="hero-stats">
                    <div class="stat">
                        <span class="stat-number">500+</span>
                        <span class="stat-label">Premium Scripts</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number">48H</span>
                        <span class="stat-label">Instant Delivery</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number">100%</span>
                        <span class="stat-label">Optimized</span>
                    </div>
                </div>
                <div class="cta-group">
                    <a href="products.html" class="cta-button primary">Explore Games</a>
                    <a href="products.html" class="cta-button outline">View Games</a>
                </div>
            </div>
            <div class="hero-right">
                <div class="hero-image-wrapper">
                    <div class="hero-carousel">
                        <div class="carousel-slide active">
                            <img src="images/Arc_Raiders_cover_art.jpg" alt="Fashion Model 1">
                        </div>
                        <div class="carousel-slide">
                            <img src="images/MV5BZWU0YzA1MzItZjM5NC00ZTc1LTk0MjAtYzhiN2EyN2RmM2Y1XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" alt="Fashion Model 2">
                        </div>
                        <div class="carousel-slide">
                            <img src="images/b2dea8ec89166d398051075fb91b6202.jpg" alt="Fashion Model 3">
                        </div>
                        <div class="carousel-overlay"></div>
                        <div class="carousel-indicators">
                            <span class="indicator active" data-slide="0"></span>
                            <span class="indicator" data-slide="1"></span>
                            <span class="indicator" data-slide="2"></span>
                        </div>
                    </div>
                    <div class="floating-tags">
                        <div class="tag">Limited Edition</div>
                        <div class="tag">Handcrafted</div>
                        <div class="tag">Premium Quality</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="scroll-indicator">
            <span></span>
        </div>
    </section>

    <section class="featured" id="featured">
        <div class="featured-container">
            <div class="featured-hero">
                <div class="featured-content">
                    <span class="label">Developed with Passion</span>
                    <h2>The Art of Gaming</h2>
                    <p>Where code meets creativity. Our expert developers blend cutting-edge technology with innovative gameplay to create scripts and games that redefine the gaming experience. This platform is proudly developed by ChillZone, featuring premium gaming solutions.</p>
                    
                    <div class="feature-highlights">
                        <div class="highlight-item">
                            <div class="highlight-icon">🎮</div>
                            <div class="highlight-title">Premium Quality</div>
                            <div class="highlight-desc">Only the finest code and game mechanics make it into our collection</div>
                        </div>
                        <div class="highlight-item">
                            <div class="highlight-icon">⚡</div>
                            <div class="highlight-title">Optimized</div>
                            <div class="highlight-desc">Lightning-fast performance with minimal resource usage</div>
                        </div>
                        <div class="highlight-item">
                            <div class="highlight-icon">💻</div>
                            <div class="highlight-title">Expert Coded</div>
                            <div class="highlight-desc">Each script is carefully developed by skilled programmers</div>
                        </div>
                    </div>
                    
                    <a href="products.html" class="feature-cta">Discover Our Games</a>
                </div>
                
                <div class="featured-image-section">
                    <div class="featured-image-grid">
                        <div class="featured-img">
                            <img src="images/Screenshot_2025-10-11_082401.png" alt="Fashion Collection Showcase">
                        </div>
                        <div class="featured-img">
                            <img src="images/image.png" alt="Luxury Fashion Details">
                        </div>
                        <div class="featured-img">
                            <img src="images/Arc_Raiders_cover_art.jpg" alt="Artisan Craftsmanship">
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="testimonials">
                <div class="testimonials-header">
                    <h3>What Our Customers Say</h3>
                    <p class="section-subtitle">Real stories from gaming enthusiasts</p>
                </div>
                
                <div class="testimonials-grid">
                    <div class="testimonial-card">
                        <div class="testimonial-rating">★★★★★</div>
                        <div class="testimonial-quote">
                            "ChillZone has completely transformed my FiveM server. The scripts are amazing and the performance is unmatched. Every feature feels like it was made by professional developers."
                        </div>
                        <div class="testimonial-author">
                            <div class="author-avatar">S</div>
                            <div class="author-info">
                                <h4>Sarah Chen</h4>
                                <p>Server Owner</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="testimonial-card">
                        <div class="testimonial-rating">★★★★★</div>
                        <div class="testimonial-quote">
                            "The optimization combined with premium features is exactly what I was looking for. ChillZone proves you don't have to compromise on performance."
                        </div>
                        <div class="testimonial-author">
                            <div class="author-avatar">M</div>
                            <div class="author-info">
                                <h4>Marcus Rodriguez</h4>
                                <p>Game Developer</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="testimonial-card">
                        <div class="testimonial-rating">★★★★★</div>
                        <div class="testimonial-quote">
                            "I've been using ChillZone scripts for two years now, and each update keeps exceeding my expectations. The code quality and support are consistently outstanding."
                        </div>
                        <div class="testimonial-author">
                            <div class="author-avatar">A</div>
                            <div class="author-info">
                                <h4>Alexandra Kim</h4>
                                <p>Community Manager</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="contact" id="contact">
        <div class="contact-container">
            <div class="contact-header">
                <h2 class="section-title">Get In Touch</h2>
                <p class="section-subtitle">We'd love to hear from you</p>
            </div>
            
            <div class="contact-content">
                <div class="contact-form-wrapper">
                    <form id="contactForm">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="firstName">First Name</label>
                                <input type="text" id="firstName" name="firstName" placeholder="John" required>
                            </div>
                            <div class="form-group">
                                <label for="lastName">Last Name</label>
                                <input type="text" id="lastName" name="lastName" placeholder="Doe" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" name="email" placeholder="john@example.com" required>
                        </div>
                        <div class="form-group">
                            <label for="subject">Subject</label>
                            <input type="text" id="subject" name="subject" placeholder="How can we help?" required>
                        </div>
                        <div class="form-group">
                            <label for="message">Message</label>
                            <textarea id="message" name="message" placeholder="Tell us more about your inquiry..." required></textarea>
                        </div>
                        <button type="submit" class="form-submit">Send Message</button>
                    </form>
                </div>
                
                <div class="contact-info">
                    <div class="info-item">
                        <div class="info-content">
                        </div>
                    </div>
                    
                    <div class="info-item">
                        <div class="info-icon">📞</div>
                        <div class="info-content">
                            <h3>Call Us</h3>
                            <p>Main: <a href="tel:+66021234567">+66 02 123 4567</a><br>
                            Support: <a href="tel:+66021234568">+66 02 123 4568</a><br>
                            Mon-Fri, 9AM-6PM ICT</p>
                        </div>
                    </div>
                    
                    <div class="info-item">
                        <div class="info-icon">✉️</div>
                        <div class="info-content">
                            <h3>Email Us</h3>
                            <p>Support: <a href="mailto:support@chillzone.games">support@chillzone.games</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <footer>
        <div class="footer-content">
            <div class="footer-brand">
                <h3>ChillZone</h3>
                <p>Redefining gaming with innovative scripts, premium games, and cutting-edge development. Join us in creating the future of interactive entertainment.</p>
                <div class="social-links">
                    <a href="#" class="social-link">S</a>
                    <a href="#" class="social-link">h</a>
                    <a href="#" class="social-link">o</a>
                    <a href="#" class="social-link">p</a>
                </div>
            </div>
            <div class="footer-column">
                <h4>Games</h4>
                <ul>
                    <li><a href="#">New Releases</a></li>
                    <li><a href="#">Action Games</a></li>
                    <li><a href="#">RPG Games</a></li>
                    <li><a href="#">FiveM Scripts</a></li>
                    <li><a href="#">Game Bundles</a></li>
                </ul>
            </div>
            <div class="footer-column">
                <h4>Support</h4>
                <ul>
                    <li><a href="#">Contact Us</a></li>
                    <li><a href="#">Installation Guide</a></li>
                    <li><a href="#">Script Setup</a></li>
                    <li><a href="#">Server Support</a></li>
                    <li><a href="#">Troubleshooting</a></li>
                    <li><a href="#">FAQ</a></li>
                </ul>
            </div>
            <div class="footer-column">
                <h4>Company</h4>
                <ul>
                    <li><a href="#">About Us</a></li>
                    <li><a href="#">Developer Portal</a></li>
                    <li><a href="#">API Access</a></li>
                    <li><a href="#">Partnerships</a></li>
                    <li><a href="#">Open Source</a></li>
                    <li><a href="#">Terms</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2025 ChillZone. All rights reserved. | Designed by <a href="#" target="_blank" rel="nofollow" style="color: var(--accent); text-decoration: none;">Im4dOx</a></p>
            <div class="payment-methods">
                <div class="payment-icon">VISA</div>
                <div class="payment-icon">MC</div>
                <div class="payment-icon">AMEX</div>
                <div class="payment-icon">PAY</div>
            </div>
        </div>
    </footer>

    <!-- Inline scripts (attempt to inline main JS files if present) -->
    <script>
    <?php
    $cm = get_template_directory() . '/content-manager.js';
    if ( file_exists($cm) ) echo "/* content-manager.js */\n" . file_get_contents($cm);
    ?>
    </script>

    <script>
    <?php
    $us = get_template_directory() . '/user-session.js';
    if ( file_exists($us) ) echo "/* user-session.js */\n" . file_get_contents($us);
    ?>
    </script>

    <?php wp_footer(); ?>
</body>
</html>

                    </defs>
                    <polygon points="50,10 20,50 50,90 80,50" fill="none" stroke="url(#logoGrad)" stroke-width="3"/>
                    <circle cx="50" cy="50" r="5" fill="url(#logoGrad)"/>
                </svg>
                <span class="logo-text">ChillZone</span>
            </a>
            <ul class="nav-links">
                <li><a href="#home" class="nav-link active">Home</a></li>
                <li><a href="products.html" class="nav-link">Products</a></li>
                <li><a href="#featured" class="nav-link">Featured</a></li>
                <li><a href="#contact" class="nav-link">Contact</a></li>
            </ul>

            <!-- Authentication Buttons -->
            <div class="auth-buttons">
                <a href="login.html" class="auth-btn auth-btn-primary">
                    <span class="auth-btn-text">Sign In</span>
                    <span class="auth-btn-icon">🔐</span>
                </a>
                <a href="signup.html" class="auth-btn auth-btn-secondary">
                    <span class="auth-btn-text">Sign Up</span>
                    <span class="auth-btn-icon">✨</span>
                </a>
            </div>

            <!-- User Profile Button (shown when logged in) -->
            <div class="user-profile-btn" id="userProfileBtn" style="display: none;">
                <button class="user-btn" onclick="toggleUserMenu()">
                    <span class="user-avatar">👤</span>
                    <span class="user-name" id="userDisplayName">User</span>
                    <span class="user-dropdown-icon">▼</span>
                </button>

                <!-- User Dropdown Menu -->
                <div class="user-menu" id="userMenu">
                    <div class="user-menu-header">
                        <span class="user-avatar-large">👤</span>
                        <div class="user-info">
                            <div class="user-full-name" id="userFullName">User Name</div>
                            <div class="user-role" id="userRole">Regular User</div>
                        </div>
                    </div>
                    <div class="user-menu-divider"></div>
                    <a href="#" class="user-menu-item profile-link" onclick="openProfile()">
                        <span class="menu-icon">👤</span>
                        <span>Profile</span>
                    </a>
                    <a href="#" class="user-menu-item orders-link" onclick="openOrders()">
                        <span class="menu-icon">🛒</span>
                        <span>Orders</span>
                    </a>
                    <a href="#" class="user-menu-item settings-link" onclick="openSettings()">
                        <span class="menu-icon">⚙️</span>
                        <span>Settings</span>
                    </a>
                    <div class="user-menu-divider admin-divider" id="adminDivider" style="display: none;"></div>
                    <a href="admin-dashboard.html" class="user-menu-item admin-link" id="adminLink" style="display: none;">
                        <span class="menu-icon">🛡️</span>
                        <span>Admin Dashboard</span>
                    </a>
                    <div class="user-menu-divider"></div>
                    <button onclick="logout()" class="user-menu-item logout-btn">
                        <span class="menu-icon">🚪</span>
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>

            <li><a href="#contact" class="nav-cta">Get In Touch</a></li>
        </div>
        <div class="menu-toggle" id="menuToggle">
            <span></span>
            <span></span>
            <span></span>
            <div class="menu-toggle" id="menuToggle">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    </nav>

    <div class="mobile-nav" id="mobileNav">
        <ul class="mobile-nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="products.html">Products</a></li>
            <li><a href="#featured">Featured</a></li>
            <li><a href="#contact">Contact</a></li>
        </ul>
    </div>

    <section class="hero" id="home">
        <div class="hero-bg"></div>
        <div class="hero-container">
            <div class="hero-left">
                <div class="hero-badge">New Gaming Collection 2025</div>
                <h1 class="hero-title">
                    <span class="line"><span>Best <span class="accent">Gaming</span></span></span>
                    <span class="line"><span>Experience</span></span>
                </h1>
                <p class="hero-description">
                    Discover our premium collection of games and FiveM scripts where innovation meets gameplay. 
                    Each script and game is crafted to enhance your server and elevate your gaming experience.
                </p>
                <div class="hero-stats">
                    <div class="stat">
                        <span class="stat-number">500+</span>
                        <span class="stat-label">Premium Scripts</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number">48H</span>
                        <span class="stat-label">Instant Delivery</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number">100%</span>
                        <span class="stat-label">Optimized</span>
                    </div>
                </div>
                <div class="cta-group">
                    <a href="products.html" class="cta-button primary">Explore Games</a>
                    <a href="products.html" class="cta-button outline">View Games</a>
                </div>
            </div>
            <div class="hero-right">
                <div class="hero-image-wrapper">
                    <div class="hero-carousel">
                        <div class="carousel-slide active">
                            <img src="images/Arc_Raiders_cover_art.jpg" alt="Fashion Model 1">
                        </div>
                        <div class="carousel-slide">
                            <img src="images/MV5BZWU0YzA1MzItZjM5NC00ZTc1LTk0MjAtYzhiN2EyN2RmM2Y1XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" alt="Fashion Model 2">
                        </div>
                        <div class="carousel-slide">
                            <img src="images/b2dea8ec89166d398051075fb91b6202.jpg" alt="Fashion Model 3">
                        </div>
                        <div class="carousel-overlay"></div>
                        <div class="carousel-indicators">
                            <span class="indicator active" data-slide="0"></span>
                            <span class="indicator" data-slide="1"></span>
                            <span class="indicator" data-slide="2"></span>
                        </div>
                    </div>
                    <div class="floating-tags">
                        <div class="tag">Limited Edition</div>
                        <div class="tag">Handcrafted</div>
                        <div class="tag">Premium Quality</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="scroll-indicator">
            <span></span>
        </div>
    </section>

    <section class="featured" id="featured">
        <div class="featured-container">
            <div class="featured-hero">
                <div class="featured-content">
                    <span class="label">Developed with Passion</span>
                    <h2>The Art of Gaming</h2>
                    <p>Where code meets creativity. Our expert developers blend cutting-edge technology with innovative gameplay to create scripts and games that redefine the gaming experience. This platform is proudly developed by ChillZone, featuring premium gaming solutions.</p>
                    
                    <div class="feature-highlights">
                        <div class="highlight-item">
                            <div class="highlight-icon">🎮</div>
                            <div class="highlight-title">Premium Quality</div>
                            <div class="highlight-desc">Only the finest code and game mechanics make it into our collection</div>
                        </div>
                        <div class="highlight-item">
                            <div class="highlight-icon">⚡</div>
                            <div class="highlight-title">Optimized</div>
                            <div class="highlight-desc">Lightning-fast performance with minimal resource usage</div>
                        </div>
                        <div class="highlight-item">
                            <div class="highlight-icon">💻</div>
                            <div class="highlight-title">Expert Coded</div>
                            <div class="highlight-desc">Each script is carefully developed by skilled programmers</div>
                        </div>
                    </div>
                    
                    <a href="products.html" class="feature-cta">Discover Our Games</a>
                </div>
                
                <div class="featured-image-section">
                    <div class="featured-image-grid">
                        <div class="featured-img">
                            <img src="images/Screenshot_2025-10-11_082401.png" alt="Fashion Collection Showcase">
                        </div>
                        <div class="featured-img">
                            <img src="images/image.png" alt="Luxury Fashion Details">
                        </div>
                        <div class="featured-img">
                            <img src="images/Arc_Raiders_cover_art.jpg" alt="Artisan Craftsmanship">
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="testimonials">
                <div class="testimonials-header">
                    <h3>What Our Customers Say</h3>
                    <p class="section-subtitle">Real stories from gaming enthusiasts</p>
                </div>
                
                <div class="testimonials-grid">
                    <div class="testimonial-card">
                        <div class="testimonial-rating">★★★★★</div>
                        <div class="testimonial-quote">
                            "ChillZone has completely transformed my FiveM server. The scripts are amazing and the performance is unmatched. Every feature feels like it was made by professional developers."
                        </div>
                        <div class="testimonial-author">
                            <div class="author-avatar">S</div>
                            <div class="author-info">
                                <h4>Sarah Chen</h4>
                                <p>Server Owner</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="testimonial-card">
                        <div class="testimonial-rating">★★★★★</div>
                        <div class="testimonial-quote">
                            "The optimization combined with premium features is exactly what I was looking for. ChillZone proves you don't have to compromise on performance."
                        </div>
                        <div class="testimonial-author">
                            <div class="author-avatar">M</div>
                            <div class="author-info">
                                <h4>Marcus Rodriguez</h4>
                                <p>Game Developer</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="testimonial-card">
                        <div class="testimonial-rating">★★★★★</div>
                        <div class="testimonial-quote">
                            "I've been using ChillZone scripts for two years now, and each update keeps exceeding my expectations. The code quality and support are consistently outstanding."
                        </div>
                        <div class="testimonial-author">
                            <div class="author-avatar">A</div>
                            <div class="author-info">
                                <h4>Alexandra Kim</h4>
                                <p>Community Manager</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="contact" id="contact">
        <div class="contact-container">
            <div class="contact-header">
                <h2 class="section-title">Get In Touch</h2>
                <p class="section-subtitle">We'd love to hear from you</p>
            </div>
            
            <div class="contact-content">
                <div class="contact-form-wrapper">
                    <form id="contactForm">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="firstName">First Name</label>
                                <input type="text" id="firstName" name="firstName" placeholder="John" required>
                            </div>
                            <div class="form-group">
                                <label for="lastName">Last Name</label>
                                <input type="text" id="lastName" name="lastName" placeholder="Doe" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" name="email" placeholder="john@example.com" required>
                        </div>
                        <div class="form-group">
                            <label for="subject">Subject</label>
                            <input type="text" id="subject" name="subject" placeholder="How can we help?" required>
                        </div>
                        <div class="form-group">
                            <label for="message">Message</label>
                            <textarea id="message" name="message" placeholder="Tell us more about your inquiry..." required></textarea>
                        </div>
                        <button type="submit" class="form-submit">Send Message</button>
                    </form>
                </div>
                
                <div class="contact-info">
                    <div class="info-item">
                        <div class="info-content">
                        </div>
                    </div>
                    
                    <div class="info-item">
                        <div class="info-icon">📞</div>
                        <div class="info-content">
                            <h3>Call Us</h3>
                            <p>Main: <a href="tel:+66021234567">+66 02 123 4567</a><br>
                            Support: <a href="tel:+66021234568">+66 02 123 4568</a><br>
                            Mon-Fri, 9AM-6PM ICT</p>
                        </div>
                    </div>
                    
                    <div class="info-item">
                        <div class="info-icon">✉️</div>
                        <div class="info-content">
                            <h3>Email Us</h3>
                            <p>Support: <a href="mailto:support@chillzone.games">support@chillzone.games</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

<?php
get_footer();
