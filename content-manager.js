// Content Management System - Integrates Admin Data with Main Website

// Default data (fallback if no admin data exists)
const defaultData = {
    products: [
        { name: 'Battle Royale', category: 'games', subtitle: 'Action Game', price: 'From $29.99', badge: 'New Arrival', image: 'urban-edge.avif' },
        { name: 'Roleplay Framework', category: 'premium', subtitle: 'FiveM Script', price: 'From $89.99', badge: 'Limited', image: 'midnight-luxe.avif' },
        { name: 'ESX Framework', category: 'fivem', subtitle: 'FiveM Essential', price: 'From $39.99', badge: 'Bestseller', image: 'neo-classic.avif' },
        { name: 'Server Manager', category: 'tools', subtitle: 'Admin Tool', price: 'From $19.99', badge: 'Trending', image: 'accent-pieces.avif' },
        { name: 'RPG Adventure', category: 'games', subtitle: 'Fantasy Game', price: 'From $24.99', badge: 'Pre-Order', image: 'spring-bloom.avif' },
        { name: 'Vehicle System', category: 'fivem', subtitle: 'FiveM Script', price: 'From $49.99', badge: 'Hot', image: 'street-rebel.avif' },
        { name: 'Game Bundle', category: 'premium', subtitle: 'Premium Collection', price: 'From $129.99', badge: 'Exclusive', image: 'avant-garde.avif' },
        { name: 'Discord Bot', category: 'tools', subtitle: 'Community Tool', price: 'From $8.99', badge: 'Essentials', image: 'minimal-chic.avif' }
    ],
    testimonials: [
        { name: 'Sarah Chen', role: 'Server Owner', quote: 'ChillZone has completely transformed my FiveM server. The scripts are amazing and the performance is unmatched. Every feature feels like it was made by professional developers.', rating: 5 },
        { name: 'Marcus Rodriguez', role: 'Game Developer', quote: 'The optimization combined with premium features is exactly what I was looking for. ChillZone proves you don\'t have to compromise on performance.', rating: 5 },
        { name: 'Alexandra Kim', role: 'Community Manager', quote: 'I\'ve been using ChillZone scripts for two years now, and each update keeps exceeding my expectations. The code quality and support are consistently outstanding.', rating: 5 }
    ],
    hero: {
        badge: 'New Gaming Collection 2025',
        title1: 'Best',
        title2: 'Gaming',
        title3: 'Experience',
        description: 'Discover our premium collection of games and FiveM scripts where innovation meets gameplay. Each script and game is crafted to enhance your server and elevate your gaming experience.'
    },
    contact: {
        address: '123 Gaming Street<br>Silicon Valley, CA 94025<br>Tech District',
        phoneMain: '+66 02 123 4567',
        phoneSupport: '+66 02 123 4568',
        emailSupport: 'support@chillzone.games',
        emailDev: 'dev@chillzone.games',
        // emailPress: 'press@chillzone.games'
    },
    categories: {
        all: 'All',
        games: 'Games',
        fivem: 'FiveM Scripts',
        premium: 'Premium'
    }
};

// Load data from localStorage or use defaults
function loadData() {
    return {
        products: JSON.parse(localStorage.getItem('adminProducts')) || defaultData.products,
        testimonials: JSON.parse(localStorage.getItem('adminTestimonials')) || defaultData.testimonials,
        hero: JSON.parse(localStorage.getItem('adminHero')) || defaultData.hero,
        contact: JSON.parse(localStorage.getItem('adminContact')) || defaultData.contact,
        categories: JSON.parse(localStorage.getItem('adminCategories')) || defaultData.categories
    };
}

// Update products in the main website
function updateProducts() {
    const data = loadData();
    const productsGrid = document.getElementById('collectionsGrid');
    
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    data.products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'collection-card product-card';
        productCard.dataset.category = product.category;
        productCard.dataset.productId = product.id;
        
        productCard.innerHTML = `
            <div class="collection-thumbnail">
                <img src="images/${product.image}" alt="${product.name}">
            </div>
            <div class="card-content">
                <span class="card-badge">${product.badge}</span>
                <h3 class="card-title">${product.name}</h3>
                <p class="card-subtitle">${product.subtitle}</p>
                <p class="card-price">${product.price}</p>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });
    
    // Reinitialize category filtering
    initializeCategoryFiltering();
}

// Update testimonials in the main website
function updateTestimonials() {
    const data = loadData();
    const testimonialsGrid = document.querySelector('.testimonials-grid');
    
    if (!testimonialsGrid) return;
    
    testimonialsGrid.innerHTML = '';
    
    data.testimonials.forEach(testimonial => {
        const testimonialCard = document.createElement('div');
        testimonialCard.className = 'testimonial-card';
        
        const stars = '★'.repeat(testimonial.rating) + '☆'.repeat(5 - testimonial.rating);
        
        testimonialCard.innerHTML = `
            <div class="testimonial-rating">${stars}</div>
            <div class="testimonial-quote">
                "${testimonial.quote}"
            </div>
            <div class="testimonial-author">
                <div class="author-avatar">${testimonial.name.charAt(0)}</div>
                <div class="author-info">
                    <h4>${testimonial.name}</h4>
                    <p>${testimonial.role}</p>
                </div>
            </div>
        `;
        
        testimonialsGrid.appendChild(testimonialCard);
    });
}

// Update hero section
function updateHeroSection() {
    const data = loadData();
    
    // Update badge
    const heroBadge = document.querySelector('.hero-badge');
    if (heroBadge) {
        heroBadge.textContent = data.hero.badge;
    }
    
    // Update title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.innerHTML = `
            <span class="line"><span>${data.hero.title1}</span></span>
            <span class="line"><span><span class="accent">${data.hero.title2}</span></span></span>
            <span class="line"><span>${data.hero.title3}</span></span>
        `;
    }
    
    // Update description
    const heroDescription = document.querySelector('.hero-description');
    if (heroDescription) {
        heroDescription.textContent = data.hero.description;
    }
}

// Update contact information
function updateContactInfo() {
    const data = loadData();
    
    // Update address
    const addressContent = document.querySelector('.info-item:nth-child(1) .info-content p');
    if (addressContent) {
        addressContent.innerHTML = data.contact.address;
    }
    
    // Update phone numbers
    const phoneContent = document.querySelector('.info-item:nth-child(2) .info-content p');
    if (phoneContent) {
        phoneContent.innerHTML = `Main: <a href="tel:${data.contact.phoneMain}">${data.contact.phoneMain}</a><br>
            Mon-Fri, 9AM-6PM ICT`;
    }
    
    // Update emails
    const emailContent = document.querySelector('.info-item:nth-child(3) .info-content p');
    if (emailContent) {
        emailContent.innerHTML = `Support: <a href="mailto:${data.contact.emailSupport}">${data.contact.emailSupport}</a>`;
    }
}

// Update categories
function updateCategories() {
    const data = loadData();
    const categoryTabs = document.querySelector('.category-tabs');
    
    if (!categoryTabs) return;
    
    categoryTabs.innerHTML = '';
    
    Object.keys(data.categories).forEach(categoryKey => {
        const button = document.createElement('button');
        button.className = 'tab-btn';
        if (categoryKey === 'all') button.classList.add('active');
        button.setAttribute('data-category', categoryKey);
        button.textContent = data.categories[categoryKey];
        
        categoryTabs.appendChild(button);
    });
    
    // Reinitialize category filtering
    initializeCategoryFiltering();
}

// Initialize category filtering
function initializeCategoryFiltering() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const collectionCards = document.querySelectorAll('.collection-card');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            
            // Update active button
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter cards
            collectionCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.animation = 'fadeInUp 0.6s ease forwards';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Listen for storage changes (real-time updates)
function setupStorageListener() {
    window.addEventListener('storage', (e) => {
        if (e.key === 'adminProducts') {
            updateProducts();
        } else if (e.key === 'adminTestimonials') {
            updateTestimonials();
        } else if (e.key === 'adminHero') {
            updateHeroSection();
        } else if (e.key === 'adminContact') {
            updateContactInfo();
        } else if (e.key === 'adminCategories') {
            updateCategories();
        }
    });
}

// Initialize all content when DOM is loaded
function initializeContent() {
    updateProducts();
    updateTestimonials();
    updateHeroSection();
    updateContactInfo();
    updateCategories();
    setupStorageListener();
}

// Auto-refresh content every 30 seconds (backup for storage events)
function setupAutoRefresh() {
    setInterval(() => {
        updateProducts();
        updateTestimonials();
        updateHeroSection();
        updateContactInfo();
        updateCategories();
    }, 30000);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeContent);
} else {
    initializeContent();
}

// Setup auto-refresh
setupAutoRefresh();

// Export functions for manual updates
window.ContentManager = {
    updateProducts,
    updateTestimonials,
    updateHeroSection,
    updateContactInfo,
    updateCategories,
    refreshAll: initializeContent
};
