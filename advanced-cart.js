// Advanced Cart System - Stable and Reliable
class AdvancedCart {
    constructor() {
        this.cart = [];
        this.settings = this.loadSettings();
        this.isVisible = false;
        this.isInitialized = false;
        this.orderHistory = this.loadOrderHistory();
        
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }
    
    init() {
        if (this.isInitialized) return;
        
        try {
            this.loadCart();
            this.createCartUI();
            this.bindEvents();
            this.updateCartUI();
            this.isInitialized = true;
            console.log('Advanced Cart initialized successfully');
        } catch (error) {
            console.error('Error initializing cart:', error);
        }
    }
    
    loadSettings() {
        try {
            const saved = localStorage.getItem('adminSettings');
            return saved ? JSON.parse(saved) : {
                currency: 'USD',
                currencyPosition: 'before',
                storeName: 'ChillZone',
                storeEmail: 'store@chillzone.games'
            };
        } catch (error) {
            console.warn('Error loading settings:', error);
            return {
                currency: 'USD',
                currencyPosition: 'before',
                storeName: 'ChillZone',
                storeEmail: 'store@chillzone.games'
            };
        }
    }
    
    getCurrencySymbol() {
        const symbols = {
            'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥',
            'CAD': 'C$', 'AUD': 'A$', 'CHF': 'Fr', 'CNY': '¥',
            'INR': '₹', 'BRL': 'R$'
        };
        return symbols[this.settings.currency] || '$';
    }
    
    formatPrice(price) {
        try {
            const symbol = this.getCurrencySymbol();
            const cleanPrice = parseFloat(price.toString().replace(/[^0-9.-]/g, ''));
            
            if (isNaN(cleanPrice)) return `${symbol}0.00`;
            
            const formatted = cleanPrice.toFixed(2);
            return this.settings.currencyPosition === 'before' ? 
                `${symbol}${formatted}` : `${formatted}${symbol}`;
        } catch (error) {
            console.warn('Error formatting price:', error);
            return '$0.00';
        }
    }
    
    loadCart() {
        try {
            const saved = localStorage.getItem('chillzoneCart');
            this.cart = saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.warn('Error loading cart:', error);
            this.cart = [];
        }
    }
    
    saveCart() {
        try {
            localStorage.setItem('chillzoneCart', JSON.stringify(this.cart));
            this.dispatchCartEvent();
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }
    
    loadOrderHistory() {
        try {
            const saved = localStorage.getItem('orderHistory');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.warn('Error loading order history:', error);
            return [];
        }
    }
    
    saveOrderHistory() {
        try {
            localStorage.setItem('orderHistory', JSON.stringify(this.orderHistory));
        } catch (error) {
            console.error('Error saving order history:', error);
        }
    }
    
    dispatchCartEvent() {
        const event = new CustomEvent('cartUpdated', {
            detail: { cart: this.cart, itemCount: this.getItemCount() }
        });
        document.dispatchEvent(event);
    }
    
    createCartUI() {
        // Remove existing cart
        const existing = document.getElementById('advancedCart');
        if (existing) existing.remove();
        
        // Create cart container
        const cartContainer = document.createElement('div');
        cartContainer.id = 'advancedCart';
        cartContainer.innerHTML = `
            <div class="cart-float-button" id="cartFloatBtn">
                <div class="cart-icon">🛒</div>
                <div class="cart-badge" id="cartBadge">0</div>
            </div>
            
            <div class="cart-panel" id="cartPanel">
                <div class="cart-header">
                    <h3>Shopping Cart</h3>
                    <button class="cart-close" id="cartClose">×</button>
                </div>
                
                <div class="cart-body">
                    <div class="cart-items" id="cartItems">
                        <div class="empty-cart">
                            <div class="empty-icon">🛒</div>
                            <p>Your cart is empty</p>
                            <small>Add some awesome products!</small>
                        </div>
                    </div>
                    
                    <div class="cart-summary">
                        <div class="summary-row">
                            <span>Subtotal:</span>
                            <span id="cartSubtotal">$0.00</span>
                        </div>
                        <div class="summary-row">
                            <span>Tax (10%):</span>
                            <span id="cartTax">$0.00</span>
                        </div>
                        <div class="summary-row total">
                            <span>Total:</span>
                            <span id="cartTotal">$0.00</span>
                        </div>
                    </div>
                </div>
                
                <div class="cart-footer">
                    <button class="btn btn-secondary" id="clearCartBtn">Clear Cart</button>
                    <button class="btn btn-primary" id="checkoutBtn">Checkout</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(cartContainer);
        this.injectStyles();
    }
    
    injectStyles() {
        if (document.getElementById('advancedCartStyles')) return;
        
        const style = document.createElement('style');
        style.id = 'advancedCartStyles';
        style.textContent = `
            #advancedCart {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 99999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            
            .cart-float-button {
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #ff3366, #ff1a4d);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(255, 51, 102, 0.3);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                border: none;
                outline: none;
            }
            
            .cart-float-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 25px rgba(255, 51, 102, 0.4);
            }
            
            .cart-float-button:active {
                transform: translateY(0);
            }
            
            .cart-icon {
                font-size: 24px;
                color: white;
            }
            
            .cart-badge {
                position: absolute;
                top: -2px;
                right: -2px;
                background: #ff1a4d;
                color: white;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 11px;
                font-weight: bold;
                min-width: 20px;
                border: 2px solid white;
            }
            
            .cart-panel {
                position: absolute;
                bottom: 80px;
                right: 0;
                width: 380px;
                max-height: 600px;
                background: #1a1a1a;
                border: 1px solid #333;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                opacity: 0;
                visibility: hidden;
                transform: translateY(20px) scale(0.95);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                overflow: hidden;
            }
            
            .cart-panel.active {
                opacity: 1;
                visibility: visible;
                transform: translateY(0) scale(1);
            }
            
            .cart-header {
                padding: 20px;
                border-bottom: 1px solid #333;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: #222;
            }
            
            .cart-header h3 {
                margin: 0;
                color: white;
                font-size: 18px;
                font-weight: 600;
            }
            
            .cart-close {
                background: none;
                border: none;
                color: #999;
                font-size: 24px;
                cursor: pointer;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
            }
            
            .cart-close:hover {
                background: #333;
                color: white;
            }
            
            .cart-body {
                max-height: 400px;
                overflow-y: auto;
            }
            
            .cart-items {
                padding: 20px;
            }
            
            .empty-cart {
                text-align: center;
                padding: 40px 20px;
                color: #999;
            }
            
            .empty-icon {
                font-size: 48px;
                margin-bottom: 15px;
                opacity: 0.5;
            }
            
            .empty-cart p {
                margin: 0 0 5px;
                font-size: 16px;
                font-weight: 500;
            }
            
            .empty-cart small {
                font-size: 14px;
                opacity: 0.7;
            }
            
            .cart-item {
                display: flex;
                padding: 15px;
                border-bottom: 1px solid #333;
                gap: 15px;
                animation: slideIn 0.3s ease-out;
            }
            
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateX(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            .cart-item-image {
                width: 60px;
                height: 60px;
                object-fit: cover;
                border-radius: 8px;
                flex-shrink: 0;
            }
            
            .cart-item-details {
                flex: 1;
                min-width: 0;
            }
            
            .cart-item-name {
                color: white;
                font-size: 14px;
                font-weight: 600;
                margin: 0 0 5px;
                line-height: 1.3;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
            }
            
            .cart-item-price {
                color: #ff3366;
                font-size: 14px;
                font-weight: 700;
                margin: 0 0 10px;
            }
            
            .cart-item-controls {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .quantity-control {
                display: flex;
                align-items: center;
                background: #333;
                border-radius: 6px;
                overflow: hidden;
            }
            
            .quantity-btn {
                background: none;
                border: none;
                color: #999;
                width: 28px;
                height: 28px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .quantity-btn:hover {
                background: #ff3366;
                color: white;
            }
            
            .quantity-display {
                color: white;
                font-size: 12px;
                font-weight: 600;
                min-width: 30px;
                text-align: center;
            }
            
            .remove-item {
                background: #ff1a4d;
                border: none;
                color: white;
                width: 28px;
                height: 28px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .remove-item:hover {
                background: #ff0033;
                transform: scale(1.05);
            }
            
            .cart-summary {
                padding: 20px;
                background: #222;
                border-top: 1px solid #333;
            }
            
            .summary-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
                color: #ccc;
                font-size: 14px;
            }
            
            .summary-row.total {
                color: white;
                font-size: 16px;
                font-weight: 700;
                margin-bottom: 0;
                padding-top: 10px;
                border-top: 1px solid #333;
            }
            
            .cart-footer {
                padding: 20px;
                background: #1a1a1a;
                display: flex;
                gap: 10px;
            }
            
            .btn {
                padding: 12px 20px;
                border: none;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
                flex: 1;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .btn-primary {
                background: linear-gradient(135deg, #ff3366, #ff1a4d);
                color: white;
            }
            
            .btn-primary:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 15px rgba(255, 51, 102, 0.3);
            }
            
            .btn-secondary {
                background: #333;
                color: #999;
            }
            
            .btn-secondary:hover {
                background: #444;
                color: white;
            }
            
            @media (max-width: 768px) {
                #advancedCart {
                    bottom: 15px;
                    right: 15px;
                }
                
                .cart-float-button {
                    width: 50px;
                    height: 50px;
                }
                
                .cart-icon {
                    font-size: 20px;
                }
                
                .cart-panel {
                    width: 320px;
                    right: -270px;
                }
                
                .cart-panel.active {
                    right: 0;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    bindEvents() {
        // Cart toggle
        const cartToggle = document.getElementById('cartFloatBtn');
        const closeBtn = document.getElementById('cartClose');
        const clearBtn = document.getElementById('clearCartBtn');
        const checkoutBtn = document.getElementById('checkoutBtn');
        
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
        
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearCart());
        }
        
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.checkout());
        }
        
        // Close cart when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isVisible && !e.target.closest('#advancedCart')) {
                this.hideCart();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.hideCart();
            }
        });
        
        // Listen for settings changes
        window.addEventListener('storage', (e) => {
            if (e.key === 'adminSettings') {
                this.settings = this.loadSettings();
                this.updateCartUI();
            }
        });
    }
    
    toggleCart() {
        this.isVisible = !this.isVisible;
        const panel = document.getElementById('cartPanel');
        
        if (panel) {
            if (this.isVisible) {
                panel.classList.add('active');
                this.updateCartItems();
            } else {
                panel.classList.remove('active');
            }
        }
    }
    
    hideCart() {
        this.isVisible = false;
        const panel = document.getElementById('cartPanel');
        if (panel) {
            panel.classList.remove('active');
        }
    }
    
    addToCart(productId, quantity = 1) {
        try {
            const product = this.getProduct(productId);
            if (!product) {
                this.showNotification('Product not found', 'error');
                return false;
            }
            
            const existingItem = this.cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                this.cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: quantity,
                    category: product.category
                });
            }
            
            this.saveCart();
            this.updateCartUI();
            this.showNotification(`${product.name} added to cart!`, 'success');
            
            // Auto-open cart if not already visible
            if (!this.isVisible) {
                setTimeout(() => this.toggleCart(), 100);
            }
            
            return true;
        } catch (error) {
            console.error('Error adding to cart:', error);
            this.showNotification('Error adding item to cart', 'error');
            return false;
        }
    }
    
    removeFromCart(productId) {
        try {
            const index = this.cart.findIndex(item => item.id === productId);
            if (index > -1) {
                const item = this.cart[index];
                this.cart.splice(index, 1);
                this.saveCart();
                this.updateCartUI();
                this.showNotification(`${item.name} removed from cart`, 'info');
                
                if (this.cart.length === 0) {
                    this.hideCart();
                }
            }
        } catch (error) {
            console.error('Error removing from cart:', error);
            this.showNotification('Error removing item', 'error');
        }
    }
    
    updateQuantity(productId, quantity) {
        try {
            const item = this.cart.find(item => item.id === productId);
            if (item) {
                item.quantity = Math.max(1, parseInt(quantity) || 1);
                this.saveCart();
                this.updateCartUI();
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    }
    
    clearCart() {
        if (this.cart.length === 0) return;
        
        if (confirm('Are you sure you want to clear your cart?')) {
            this.cart = [];
            this.saveCart();
            this.updateCartUI();
            this.hideCart();
            this.showNotification('Cart cleared', 'info');
        }
    }
    
    checkout() {
        if (this.cart.length === 0) {
            this.showNotification('Your cart is empty', 'warning');
            return;
        }
        
        try {
            const order = {
                id: this.generateOrderId(),
                date: new Date().toISOString(),
                items: [...this.cart],
                subtotal: this.calculateSubtotal(),
                tax: this.calculateTax(),
                total: this.calculateTotal(),
                status: 'pending',
                paymentMethod: 'pending'
            };
            
            // Add to order history
            this.orderHistory.unshift(order);
            this.saveOrderHistory();
            
            // Clear cart
            this.cart = [];
            this.saveCart();
            this.updateCartUI();
            this.hideCart();
            
            // Show success message
            this.showNotification(`Order #${order.id} placed successfully!`, 'success');
            
            // Dispatch order event
            const orderEvent = new CustomEvent('orderPlaced', { detail: order });
            document.dispatchEvent(orderEvent);
            
        } catch (error) {
            console.error('Error during checkout:', error);
            this.showNotification('Error processing order', 'error');
        }
    }
    
    generateOrderId() {
        return 'ORD' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
    }
    
    calculateSubtotal() {
        return this.cart.reduce((sum, item) => {
            const price = parseFloat(item.price.toString().replace(/[^0-9.-]/g, ''));
            return sum + (price * item.quantity);
        }, 0);
    }
    
    calculateTax() {
        return this.calculateSubtotal() * 0.1; // 10% tax
    }
    
    calculateTotal() {
        return this.calculateSubtotal() + this.calculateTax();
    }
    
    getItemCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }
    
    getProduct(productId) {
        // Try admin products first
        const adminProducts = JSON.parse(localStorage.getItem('adminProducts') || '[]');
        let product = adminProducts.find(p => p.id == productId);
        
        if (!product) {
            // Fallback to default products
            const defaultProducts = [
                {
                    id: 1,
                    name: 'Battle Royale',
                    category: 'games',
                    price: 29.99,
                    image: 'images/urban-edge.avif'
                },
                {
                    id: 2,
                    name: 'Roleplay Framework',
                    category: 'premium',
                    price: 89.99,
                    image: 'images/midnight-luxe.avif'
                },
                {
                    id: 3,
                    name: 'ESX Framework',
                    category: 'fivem',
                    price: 39.99,
                    image: 'images/neo-classic.avif'
                },
                {
                    id: 4,
                    name: 'Server Manager',
                    category: 'tools',
                    price: 19.99,
                    image: 'images/accent-pieces.avif'
                },
                {
                    id: 5,
                    name: 'RPG Adventure',
                    category: 'games',
                    price: 24.99,
                    image: 'images/spring-bloom.avif'
                },
                {
                    id: 6,
                    name: 'Vehicle System',
                    category: 'fivem',
                    price: 49.99,
                    image: 'images/street-rebel.avif'
                },
                {
                    id: 7,
                    name: 'Game Bundle',
                    category: 'premium',
                    price: 129.99,
                    image: 'images/avant-garde.avif'
                },
                {
                    id: 8,
                    name: 'Discord Bot',
                    category: 'tools',
                    price: 8.99,
                    image: 'images/minimal-chic.avif'
                }
            ];
            product = defaultProducts.find(p => p.id == productId);
        }
        
        return product;
    }
    
    updateCartUI() {
        this.updateCartBadge();
        this.updateCartItems();
        this.updateCartSummary();
    }
    
    updateCartBadge() {
        const badge = document.getElementById('cartBadge');
        const count = this.getItemCount();
        
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    }
    
    updateCartItems() {
        const container = document.getElementById('cartItems');
        if (!container) return;
        
        if (this.cart.length === 0) {
            container.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-icon">🛒</div>
                    <p>Your cart is empty</p>
                    <small>Add some awesome products!</small>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image" 
                     onerror="this.src='images/urban-edge.avif'">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${this.formatPrice(item.price)}</div>
                    <div class="cart-item-controls">
                        <div class="quantity-control">
                            <button class="quantity-btn" onclick="advancedCart.updateQuantity(${item.id}, ${item.quantity - 1})">−</button>
                            <span class="quantity-display">${item.quantity}</span>
                            <button class="quantity-btn" onclick="advancedCart.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        </div>
                        <button class="remove-item" onclick="advancedCart.removeFromCart(${item.id})">×</button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    updateCartSummary() {
        const subtotal = document.getElementById('cartSubtotal');
        const tax = document.getElementById('cartTax');
        const total = document.getElementById('cartTotal');
        
        if (subtotal) subtotal.textContent = this.formatPrice(this.calculateSubtotal());
        if (tax) tax.textContent = this.formatPrice(this.calculateTax());
        if (total) total.textContent = this.formatPrice(this.calculateTotal());
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getNotificationIcon(type)}</span>
                <span class="notification-message">${message}</span>
            </div>
        `;
        
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            z-index: 100000;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            animation: slideInRight 0.3s ease-out;
            max-width: 350px;
            font-size: 14px;
            font-weight: 500;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    getNotificationIcon(type) {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || icons.info;
    }
    
    // Public methods
    getCart() {
        return [...this.cart];
    }
    
    getOrderHistory() {
        return [...this.orderHistory];
    }
    
    isEmpty() {
        return this.cart.length === 0;
    }
}

// Add notification animations
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-icon {
        font-size: 18px;
        font-weight: bold;
    }
`;
document.head.appendChild(notificationStyles);

// Initialize cart
window.advancedCart = new AdvancedCart();

// Global access for backward compatibility
window.floatingCart = window.advancedCart;
