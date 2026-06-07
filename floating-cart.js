// Floating Cart Widget System - 100% Working Version
class FloatingCart {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('chillzoneCart')) || [];
        this.settings = this.loadSettings();
        this.isVisible = false;
        this.isInitialized = false;
        this.init();
    }
    
    init() {
        if (this.isInitialized) return;
        
        this.initializeEventListeners();
        this.createFloatingCart();
        this.updateCartUI();
        this.isInitialized = true;
    }
    
    loadSettings() {
        try {
            const savedSettings = localStorage.getItem('adminSettings');
            if (savedSettings) {
                return JSON.parse(savedSettings);
            }
        } catch (e) {
            console.warn('Error loading settings:', e);
        }
        return {
            currency: 'USD',
            currencyPosition: 'before',
            storeName: 'ChillZone',
            storeEmail: 'store@chillzone.games'
        };
    }
    
    getCurrencySymbol() {
        const symbols = {
            'USD': '$',
            'EUR': '€',
            'GBP': '£',
            'JPY': '¥',
            'CAD': 'C$',
            'AUD': 'A$',
            'CHF': 'Fr',
            'CNY': '¥',
            'INR': '₹',
            'BRL': 'R$'
        };
        return symbols[this.settings.currency] || '$';
    }
    
    formatPrice(price) {
        try {
            const symbol = this.getCurrencySymbol();
            const cleanPrice = parseFloat(price.toString().replace(/[^0-9.]/g, ''));
            
            if (isNaN(cleanPrice)) {
                return `${symbol}0.00`;
            }
            
            const formattedPrice = cleanPrice.toFixed(2);
            
            if (this.settings.currencyPosition === 'before') {
                return `${symbol}${formattedPrice}`;
            } else {
                return `${formattedPrice}${symbol}`;
            }
        } catch (e) {
            console.warn('Error formatting price:', e);
            return '$0.00';
        }
    }
    
    initializeEventListeners() {
        // Listen for settings changes
        window.addEventListener('storage', (e) => {
            if (e.key === 'adminSettings') {
                this.settings = this.loadSettings();
                this.updateCartUI();
                this.updateProductPrices();
            }
        });
        
        // Close cart when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isVisible && !e.target.closest('.floating-cart')) {
                this.hideCart();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.hideCart();
            }
        });
    }
    
    createFloatingCart() {
        // Remove existing floating cart
        const existingCart = document.getElementById('floatingCart');
        if (existingCart) {
            existingCart.remove();
        }
        
        const floatingCart = document.createElement('div');
        floatingCart.id = 'floatingCart';
        floatingCart.className = 'floating-cart';
        floatingCart.innerHTML = `
            <div class="cart-toggle-btn" id="cartToggle">
                <div class="cart-icon">🛒</div>
                <div class="cart-count hidden" id="floatingCartCount">0</div>
            </div>
            
            <div class="cart-dropdown" id="cartDropdown">
                <div class="cart-header">
                    <h3>Shopping Cart</h3>
                    <button class="close-cart" id="closeCartBtn">×</button>
                </div>
                
                <div class="cart-items" id="floatingCartItems">
                    <div class="empty-cart-message">
                        <div class="empty-icon">🛒</div>
                        <p>Your cart is empty</p>
                        <small>Add items to get started!</small>
                    </div>
                </div>
                
                <div class="cart-footer">
                    <div class="cart-total">
                        <span>Total:</span>
                        <span id="floatingCartTotal">$0.00</span>
                    </div>
                    <button class="checkout-btn" id="checkoutBtn">Checkout</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(floatingCart);
        
        // Add event listeners to cart elements
        const closeBtn = document.getElementById('closeCartBtn');
        const checkoutBtn = document.getElementById('checkoutBtn');
        const cartToggle = document.getElementById('cartToggle');
        
        if (cartToggle) {
            cartToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleCart();
            });
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hideCart());
        }
        
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.checkout());
        }
        
        // Add styles
        this.addStyles();
    }
    
    addStyles() {
        if (document.getElementById('floatingCartStyles')) return;
        
        const style = document.createElement('style');
        style.id = 'floatingCartStyles';
        style.textContent = `
            .floating-cart {
                position: fixed !important;
                bottom: 30px !important;
                right: 30px !important;
                z-index: 99999 !important;
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
            }
            
            .cart-toggle-btn {
                width: 60px !important;
                height: 60px !important;
                background: linear-gradient(135deg, #ff3366, #ff1a4d) !important;
                border-radius: 50% !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                cursor: pointer !important;
                box-shadow: 0 8px 25px rgba(255, 51, 102, 0.4) !important;
                transition: all 0.3s ease !important;
                position: relative !important;
                border: none !important;
                outline: none !important;
                visibility: visible !important;
                opacity: 1 !important;
            }
            
            .cart-toggle-btn:hover {
                transform: translateY(-3px) !important;
                box-shadow: 0 12px 35px rgba(255, 51, 102, 0.5) !important;
            }
            
            .cart-toggle-btn:active {
                transform: translateY(-1px) !important;
            }
            
            .cart-toggle-btn:focus {
                outline: 2px solid #ff4d79 !important;
            }
            
            .cart-icon {
                font-size: 24px !important;
                color: white !important;
                display: block !important;
            }
            
            .cart-count {
                position: absolute !important;
                top: -5px !important;
                right: -5px !important;
                background: #ff1a4d !important;
                color: white !important;
                width: 22px !important;
                height: 22px !important;
                border-radius: 50% !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                font-size: 11px !important;
                font-weight: bold !important;
                box-shadow: 0 2px 8px rgba(255, 26, 77, 0.4) !important;
                min-width: 22px !important;
            }
            
            .cart-count.hidden {
                display: none !important;
            }
            
            .cart-dropdown {
                position: absolute !important;
                bottom: 80px !important;
                right: 0 !important;
                width: 350px !important;
                background: linear-gradient(135deg, rgba(26, 26, 26, 0.98) 0%, rgba(10, 10, 10, 0.98) 100%) !important;
                border: 1px solid rgba(255, 255, 255, 0.1) !important;
                border-radius: 12px !important;
                box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5) !important;
                backdrop-filter: blur(20px) !important;
                opacity: 0 !important;
                visibility: hidden !important;
                transform: translateY(20px) scale(0.9) !important;
                transition: all 0.3s ease !important;
                max-height: 500px !important;
                overflow: hidden !important;
            }
            
            .cart-dropdown.active {
                opacity: 1 !important;
                visibility: visible !important;
                transform: translateY(0) scale(1) !important;
            }
            
            .cart-header {
                padding: 20px !important;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important;
            }
            
            .cart-header h3 {
                color: #ffffff !important;
                margin: 0 !important;
                font-size: 18px !important;
                font-weight: 600 !important;
            }
            
            .close-cart {
                background: transparent !important;
                border: none !important;
                color: #999 !important;
                font-size: 24px !important;
                cursor: pointer !important;
                width: 30px !important;
                height: 30px !important;
                border-radius: 50% !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                transition: all 0.2s ease !important;
            }
            
            .close-cart:hover {
                background: rgba(255, 255, 255, 0.1) !important;
                color: white !important;
            }
            
            .cart-items {
                max-height: 300px !important;
                overflow-y: auto !important;
                padding: 15px !important;
            }
            
            .cart-items::-webkit-scrollbar {
                width: 6px !important;
            }
            
            .cart-items::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.1) !important;
                border-radius: 3px !important;
            }
            
            .cart-items::-webkit-scrollbar-thumb {
                background: #ff3366 !important;
                border-radius: 3px !important;
            }
            
            .empty-cart-message {
                text-align: center !important;
                padding: 40px 20px !important;
            }
            
            .empty-icon {
                font-size: 48px !important;
                margin-bottom: 15px !important;
                opacity: 0.5 !important;
            }
            
            .empty-cart-message p {
                color: #999 !important;
                margin: 0 !important;
                font-size: 14px !important;
            }
            
            .empty-cart-message small {
                color: #999 !important;
                opacity: 0.7 !important;
                font-size: 12px !important;
            }
            
            .cart-item {
                display: flex !important;
                align-items: center !important;
                padding: 15px !important;
                border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
                opacity: 0 !important;
                animation: fadeInUp 0.3s ease forwards !important;
            }
            
            .cart-item-image {
                width: 50px !important;
                height: 50px !important;
                object-fit: cover !important;
                border-radius: 8px !important;
                margin-right: 15px !important;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
            }
            
            .cart-item-details {
                flex: 1 !important;
            }
            
            .cart-item-name {
                color: #ffffff !important;
                font-size: 14px !important;
                font-weight: 600 !important;
                margin: 0 0 5px !important;
                line-height: 1.2 !important;
            }
            
            .cart-item-price {
                color: #ff3366 !important;
                font-size: 14px !important;
                font-weight: 700 !important;
                margin: 0 0 5px !important;
            }
            
            .cart-item-actions {
                display: flex !important;
                align-items: center !important;
                gap: 5px !important;
            }
            
            .quantity-btn {
                background: rgba(255, 255, 255, 0.1) !important;
                border: none !important;
                color: white !important;
                width: 24px !important;
                height: 24px !important;
                border-radius: 4px !important;
                cursor: pointer !important;
                font-size: 12px !important;
                font-weight: bold !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                transition: all 0.2s ease !important;
            }
            
            .quantity-btn:hover {
                background: #ff3366 !important;
                transform: scale(1.1) !important;
            }
            
            .quantity-btn:active {
                transform: scale(0.95) !important;
            }
            
            .quantity-btn:focus {
                outline: 1px solid #ff4d79 !important;
            }
            
            .quantity-display {
                color: white !important;
                font-size: 12px !important;
                font-weight: 600 !important;
                min-width: 20px !important;
                text-align: center !important;
            }
            
            .remove-btn {
                background: rgba(255, 255, 255, 0.1) !important;
                border: none !important;
                color: #999 !important;
                width: 24px !important;
                height: 24px !important;
                border-radius: 4px !important;
                cursor: pointer !important;
                font-size: 12px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                transition: all 0.2s ease !important;
            }
            
            .remove-btn:hover {
                background: #ff1a4d !important;
                color: white !important;
                transform: scale(1.05) !important;
            }
            
            .remove-btn:focus {
                outline: 1px solid #ff1a4d !important;
            }
            
            .cart-footer {
                padding: 20px !important;
                border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
            }
            
            .cart-total {
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important;
                margin-bottom: 15px !important;
            }
            
            .cart-total span:first-child {
                color: #999 !important;
                font-size: 14px !important;
            }
            
            .cart-total span:last-child {
                color: #ffffff !important;
                font-size: 18px !important;
                font-weight: 700 !important;
            }
            
            .checkout-btn {
                background: linear-gradient(135deg, #ff3366, #ff1a4d) !important;
                color: white !important;
                border: none !important;
                padding: 12px 20px !important;
                border-radius: 8px !important;
                cursor: pointer !important;
                font-size: 14px !important;
                font-weight: 600 !important;
                width: 100% !important;
                transition: all 0.3s ease !important;
                text-transform: uppercase !important;
                letter-spacing: 1px !important;
            }
            
            .checkout-btn:hover {
                transform: translateY(-2px) !important;
                box-shadow: 0 8px 25px rgba(255, 51, 102, 0.4) !important;
            }
            
            .checkout-btn:active {
                transform: translateY(0) !important;
            }
            
            .checkout-btn:focus {
                outline: 2px solid #ff4d79 !important;
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0 !important;
                    transform: translateY(20px) !important;
                }
                to {
                    opacity: 1 !important;
                    transform: translateY(0) !important;
                }
            }
            
            @media (max-width: 768px) {
                .floating-cart {
                    bottom: 20px !important;
                    right: 20px !important;
                }
                
                .cart-dropdown {
                    width: 300px !important;
                    right: -250px !important;
                }
                
                .cart-dropdown.active {
                    right: 0 !important;
                }
                
                .cart-toggle-btn {
                    width: 50px !important;
                    height: 50px !important;
                }
                
                .cart-icon {
                    font-size: 20px !important;
                }
                
                .cart-count {
                    width: 20px !important;
                    height: 20px !important;
                    font-size: 10px !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    toggleCart() {
        try {
            this.isVisible = !this.isVisible;
            const dropdown = document.getElementById('cartDropdown');
            
            if (dropdown) {
                if (this.isVisible) {
                    dropdown.classList.add('active');
                    this.updateCartItems();
                } else {
                    dropdown.classList.remove('active');
                }
            }
        } catch (e) {
            console.error('Error toggling cart:', e);
        }
    }
    
    hideCart() {
        try {
            this.isVisible = false;
            const dropdown = document.getElementById('cartDropdown');
            if (dropdown) {
                dropdown.classList.remove('active');
            }
        } catch (e) {
            console.error('Error hiding cart:', e);
        }
    }
    
    addToCart(productId) {
        try {
            const products = this.getProducts();
            const product = products.find(p => p.id == productId);
            
            if (!product) {
                console.warn('Product not found:', productId);
                return;
            }
            
            const existingItem = this.cart.find(item => item.id == productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                this.cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                });
            }
            
            this.saveCart();
            this.updateCartUI();
            this.showNotification('Product added to cart!');
            
            // Auto-open cart if not already visible
            if (!this.isVisible) {
                setTimeout(() => this.toggleCart(), 100);
            }
        } catch (e) {
            console.error('Error adding to cart:', e);
        }
    }
    
    removeFromCart(productId) {
        try {
            this.cart = this.cart.filter(item => item.id != productId);
            this.saveCart();
            this.updateCartUI();
            this.showNotification('Item removed from cart!');
            
            if (this.cart.length === 0) {
                this.hideCart();
            }
        } catch (e) {
            console.error('Error removing from cart:', e);
        }
    }
    
    updateQuantity(productId, quantity) {
        try {
            const item = this.cart.find(item => item.id == productId);
            if (item) {
                item.quantity = Math.max(1, quantity);
                this.saveCart();
                this.updateCartUI();
            }
        } catch (e) {
            console.error('Error updating quantity:', e);
        }
    }
    
    saveCart() {
        try {
            localStorage.setItem('chillzoneCart', JSON.stringify(this.cart));
        } catch (e) {
            console.error('Error saving cart:', e);
        }
    }
    
    updateCartUI() {
        try {
            const cartCount = document.getElementById('floatingCartCount');
            const cartTotal = document.getElementById('floatingCartTotal');
            
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            
            if (cartCount) {
                cartCount.textContent = totalItems;
                cartCount.className = totalItems > 0 ? 'cart-count' : 'cart-count hidden';
            }
            
            if (cartTotal) {
                let total = 0;
                for (const item of this.cart) {
                    const cleanPrice = parseFloat(item.price.toString().replace(/[^0-9.]/g, ''));
                    total += cleanPrice * item.quantity;
                }
                cartTotal.textContent = this.formatPrice(total);
            }
            
            this.updateCartItems();
        } catch (e) {
            console.error('Error updating cart UI:', e);
        }
    }
    
    updateCartItems() {
        try {
            const cartItemsContainer = document.getElementById('floatingCartItems');
            if (!cartItemsContainer) return;
            
            if (this.cart.length === 0) {
                cartItemsContainer.innerHTML = `
                    <div class="empty-cart-message">
                        <div class="empty-icon">🛒</div>
                        <p>Your cart is empty</p>
                        <small>Add items to get started!</small>
                    </div>
                `;
                return;
            }
            
            cartItemsContainer.innerHTML = this.cart.map((item, index) => `
                <div class="cart-item" style="animation-delay: ${index * 0.1}s">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.src='images/art-of-fashion-01.avif'">
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">${this.formatPrice(item.price)}</div>
                        <div class="cart-item-actions">
                            <button class="quantity-btn" onclick="floatingCart.updateQuantity(${item.id}, ${item.quantity - 1})" aria-label="Decrease quantity">−</button>
                            <span class="quantity-display">${item.quantity}</span>
                            <button class="quantity-btn" onclick="floatingCart.updateQuantity(${item.id}, ${item.quantity + 1})" aria-label="Increase quantity">+</button>
                            <button class="remove-btn" onclick="floatingCart.removeFromCart(${item.id})" aria-label="Remove item">×</button>
                        </div>
                    </div>
                </div>
            `).join('');
        } catch (e) {
            console.error('Error updating cart items:', e);
        }
    }
    
    updateProductPrices() {
        try {
            document.querySelectorAll('.card-price').forEach(priceElement => {
                const currentPrice = priceElement.textContent;
                const numericPrice = parseFloat(currentPrice.replace(/[^0-9.]/g, ''));
                if (!isNaN(numericPrice)) {
                    priceElement.textContent = this.formatPrice(numericPrice);
                }
            });
        } catch (e) {
            console.error('Error updating product prices:', e);
        }
    }
    
    checkout() {
        try {
            if (this.cart.length === 0) {
                this.showNotification('Your cart is empty!');
                return;
            }
            
            let total = 0;
            for (const item of this.cart) {
                const cleanPrice = parseFloat(item.price.toString().replace(/[^0-9.]/g, ''));
                total += cleanPrice * item.quantity;
            }
            
            if (confirm(`Proceed to checkout? Total: ${this.formatPrice(total)}`)) {
                this.showNotification('Order placed successfully! 🎉');
                this.cart = [];
                this.saveCart();
                this.updateCartUI();
                this.hideCart();
            }
        } catch (e) {
            console.error('Error during checkout:', e);
        }
    }
    
    showNotification(message) {
        try {
            const notification = document.createElement('div');
            notification.className = 'cart-notification';
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, var(--accent), var(--accent-hover));
                color: white;
                padding: 16px 24px;
                border-radius: 8px;
                z-index: 10001;
                animation: slideInRight 0.4s ease;
                box-shadow: 0 8px 25px rgba(255, 51, 102, 0.4);
                font-size: 14px;
                font-weight: 600;
                max-width: 300px;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }, 3000);
        } catch (e) {
            console.error('Error showing notification:', e);
        }
    }
    
    getProducts() {
        try {
            const adminProducts = JSON.parse(localStorage.getItem('adminProducts'));
            
            if (adminProducts && adminProducts.length > 0) {
                return adminProducts;
            }
            
            return [
                {
                    id: 1,
                    name: 'FiveM Roleplay Framework',
                    category: 'FiveM Scripts',
                    price: 49.99,
                    image: 'images/art-of-fashion-01.avif',
                    description: 'Complete roleplay framework for FiveM servers with advanced features.',
                    features: ['Advanced roleplay system', 'Custom vehicles', 'Property management', 'Economy system']
                },
                {
                    id: 2,
                    name: 'Gaming PC Builder',
                    category: 'Games',
                    price: 29.99,
                    image: 'images/art-of-fashion-02.avif',
                    description: 'Build your dream gaming PC with our comprehensive builder tool.',
                    features: ['Component compatibility', 'Price tracking', 'Performance benchmarks', 'Build guides']
                },
                {
                    id: 3,
                    name: 'Premium Game Bundle',
                    category: 'Premium',
                    price: 99.99,
                    image: 'images/art-of-fashion-03.avif',
                    description: 'Get access to our premium game collection with exclusive content.',
                    features: ['50+ games', 'Exclusive content', 'Early access', 'VIP support']
                }
            ];
        } catch (e) {
            console.error('Error getting products:', e);
            return [];
        }
    }
}

// Initialize the cart when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (!window.floatingCart) {
        window.floatingCart = new FloatingCart();
    }
});

// Also make it available globally for immediate use
if (!window.floatingCart) {
    window.floatingCart = new FloatingCart();
}
