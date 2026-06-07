// Slide-Out Cart System
class SlideOutCart {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('chillzoneCart')) || [];
        this.settings = this.loadSettings();
        this.isOpen = false;
        this.initializeEventListeners();
        this.updateCartUI();
    }
    
    loadSettings() {
        const savedSettings = localStorage.getItem('adminSettings');
        if (savedSettings) {
            return JSON.parse(savedSettings);
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
        const symbol = this.getCurrencySymbol();
        // Clean the price by removing any currency symbols and non-numeric characters except dots
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
    }
    
    initializeEventListeners() {
        // Cart toggle
        const cartToggle = document.getElementById('cartToggle');
        if (cartToggle) {
            cartToggle.addEventListener('click', () => this.toggleCart());
        }
        
        // Close button
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-cart') || e.target.classList.contains('close-cart-btn')) {
                this.closeCart();
            }
        });
        
        // Listen for settings changes
        window.addEventListener('storage', (e) => {
            if (e.key === 'adminSettings') {
                this.settings = this.loadSettings();
                this.updateCartUI();
                this.updateProductPrices();
            }
        });
    }
    
    toggleCart() {
        this.isOpen = !this.isOpen;
        this.updateCartUI();
        
        const cartPanel = document.getElementById('slideOutCart');
        if (cartPanel) {
            cartPanel.style.display = this.isOpen ? 'block' : 'none';
        }
    }
    
    closeCart() {
        this.isOpen = false;
        const cartPanel = document.getElementById('slideOutCart');
        if (cartPanel) {
            cartPanel.style.display = 'none';
        }
    }
    
    addToCart(productId) {
        const products = this.getProducts();
        const product = products.find(p => p.id == productId);
        
        if (!product) return;
        
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
        
        // Auto-open cart after adding item
        if (!this.isOpen) {
            this.toggleCart();
        }
    }
    
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id != productId);
        this.saveCart();
        this.updateCartUI();
        this.showNotification('Item removed from cart!');
        
        if (this.cart.length === 0) {
            this.closeCart();
        }
    }
    
    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id == productId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.saveCart();
            this.updateCartUI();
        }
    }
    
    saveCart() {
        localStorage.setItem('chillzoneCart', JSON.stringify(this.cart));
    }
    
    updateCartUI() {
        const cartCount = document.getElementById('cartCount');
        const cartTotal = document.getElementById('cartTotal');
        const cartPanel = document.getElementById('slideOutCart');
        
        if (cartCount) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }
        
        if (cartTotal) {
            let total = 0;
            for (const item of this.cart) {
                const cleanPrice = parseFloat(item.price.toString().replace(/[^0-9.]/g, ''));
                total += cleanPrice * item.quantity;
            }
            cartTotal.textContent = this.formatPrice(total);
        }
        
        if (cartPanel) {
            this.updateCartItems();
        }
    }
    
    updateCartItems() {
        const cartItemsContainer = document.getElementById('cartItems');
        if (!cartItemsContainer) return;
        
        if (this.cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">🛒</div>
                    <h3>Your cart is empty</h3>
                    <p>Add some items to get started!</p>
                </div>
            `;
            return;
        }
        
        cartItemsContainer.innerHTML = this.cart.map((item, index) => `
            <div class="cart-item" data-index="${index}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-quantity">${item.quantity}</div>
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">${this.formatPrice(item.price)}</p>
                    <p class="cart-item-subtotal">Subtotal: ${this.formatPrice(item.price * item.quantity)}</p>
                    <div class="cart-item-actions">
                        <button class="quantity-btn minus" onclick="slideOutCart.updateQuantity(${item.id}, ${item.quantity - 1})">−</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn plus" onclick="slideOutCart.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        <button class="remove-btn" onclick="slideOutCart.removeFromCart(${item.id})">×</button>
                    </div>
                </div>
            `).join('');
        
        // Add animation classes to items
        setTimeout(() => {
            document.querySelectorAll('.cart-item').forEach((item, index) => {
                item.style.animation = `slideInRight 0.3s ease ${index * 0.1}s forwards`;
            });
        }, 100);
    }
    
    updateProductPrices() {
        // Update prices in product cards
        document.querySelectorAll('.card-price').forEach(priceElement => {
            const currentPrice = priceElement.textContent;
            const numericPrice = parseFloat(currentPrice.replace(/[^0-9.]/g, ''));
            if (!isNaN(numericPrice)) {
                priceElement.textContent = this.formatPrice(numericPrice);
            }
        });
    }
    
    checkout() {
        if (this.cart.length === 0) {
            this.showNotification('Your cart is empty!');
            return;
        }
        
        let total = 0;
        for (const item of this.cart) {
            const cleanPrice = parseFloat(item.price.toString().replace(/[^0-9.9]/g, ''));
            total += cleanPrice * item.quantity;
        }
        
        if (confirm(`Proceed to checkout? Total: ${this.formatPrice(total)}`)) {
            this.showNotification('Order placed successfully! 🎉');
            this.cart = [];
            this.saveCart();
            this.updateCartUI();
            this.closeCart();
        }
    }
    
    showNotification(message) {
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
            backdrop-filter: blur(10px;
            border: 1px solid rgba(255, 255, 255, 0.2);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    getProducts() {
        // Get products from admin data or use default products
        const adminProducts = JSON.parse(localStorage.getItem('adminProducts'));
        
        if (adminProducts && adminProducts.length > 0) {
            return adminProducts;
        }
        
        // Default products
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
    }
}

// Make it globally available
window.SlideOutCart = new SlideOutCart();
