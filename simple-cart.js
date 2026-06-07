// Simple Cart System for ChillZone Gaming Store
class SimpleCart {
    constructor() {
        this.cart = [];
        this.cartVisible = false;
        this.init();
    }

    init() {
        this.loadCart();
        this.createCartUI();
        this.bindEvents();
        this.updateCartDisplay();
        console.log('Simple Cart initialized successfully');
    }

    // Product data
    getProducts() {
        return {
            1: { id: 1, name: "Battle Royale", price: "29.99", image: "images/urban-edge.avif" },
            2: { id: 2, name: "Roleplay Framework", price: "89.99", image: "images/midnight-luxe.avif" },
            3: { id: 3, name: "ESX Framework", price: "39.99", image: "images/neo-classic.avif" },
            4: { id: 4, name: "Server Manager", price: "19.99", image: "images/accent-pieces.avif" },
            5: { id: 5, name: "RPG Adventure", price: "24.99", image: "images/spring-bloom.avif" },
            6: { id: 6, name: "Vehicle System", price: "49.99", image: "images/street-rebel.avif" },
            7: { id: 7, name: "Game Bundle", price: "129.99", image: "images/avant-garde.avif" },
            8: { id: 8, name: "Discord Bot", price: "8.99", image: "images/minimal-chic.avif" }
        };
    }

    getProduct(productId) {
        return this.getProducts()[productId];
    }

    // Cart operations
    addToCart(productId, quantity = 1) {
        const product = this.getProduct(productId);
        if (!product) {
            this.showNotification('Product not found', 'error');
            return;
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
                quantity: quantity
            });
        }

        this.saveCart();
        this.updateCartDisplay();
        this.showNotification(`${product.name} added to cart!`, 'success');
        this.openCart();
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartDisplay();
        this.showNotification('Item removed from cart', 'info');
    }

    updateQuantity(productId, newQuantity) {
        if (newQuantity <= 0) {
            this.removeFromCart(productId);
            return;
        }

        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            this.saveCart();
            this.updateCartDisplay();
        }
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartDisplay();
        this.showNotification('Cart cleared', 'info');
    }

    getTotal() {
        return this.cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
    }

    getItemCount() {
        return this.cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    // Persistence
    saveCart() {
        localStorage.setItem('chillzoneCart', JSON.stringify(this.cart));
    }

    loadCart() {
        const saved = localStorage.getItem('chillzoneCart');
        this.cart = saved ? JSON.parse(saved) : [];
    }

    // UI Creation
    createCartUI() {
        // Remove existing cart if any
        const existingCart = document.getElementById('simpleCart');
        if (existingCart) existingCart.remove();

        const cartHTML = `
            <div id="simpleCart" class="simple-cart">
                <div id="cartButton" class="cart-button">
                    <span class="cart-icon">🛒</span>
                    <span id="cartCount" class="cart-count">0</span>
                </div>

                <div id="cartPanel" class="cart-panel">
                    <div class="cart-header">
                        <h3>Shopping Cart</h3>
                        <button id="cartClose">&times;</button>
                    </div>

                    <div id="cartItems" class="cart-items">
                        <!-- Items will be inserted here -->
                    </div>

                    <div id="cartFooter" class="cart-footer">
                        <div class="cart-total">
                            <strong>Total: $<span id="cartTotal">0.00</span></strong>
                        </div>
                        <div class="cart-actions">
                            <button id="clearCartBtn" class="btn-secondary">Clear</button>
                            <button id="checkoutBtn" class="btn-primary">Checkout</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', cartHTML);
        this.addStyles();
    }

    // UI Updates
    updateCartDisplay() {
        this.updateCartCount();
        this.updateCartItems();
        this.updateCartTotal();
    }

    updateCartCount() {
        const count = this.getItemCount();
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            cartCount.textContent = count;
            cartCount.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    updateCartItems() {
        const cartItems = document.getElementById('cartItems');
        if (!cartItems) return;

        if (this.cart.length === 0) {
            cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
            document.getElementById('cartFooter').style.display = 'none';
            return;
        }

        document.getElementById('cartFooter').style.display = 'block';

        cartItems.innerHTML = this.cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price}</div>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="simpleCart.updateQuantity(${item.id}, ${item.quantity - 1})">−</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="simpleCart.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    <button class="remove-btn" onclick="simpleCart.removeFromCart(${item.id})">&times;</button>
                </div>
            </div>
        `).join('');
    }

    updateCartTotal() {
        const cartTotal = document.getElementById('cartTotal');
        if (cartTotal) {
            cartTotal.textContent = this.getTotal().toFixed(2);
        }
    }

    // Cart visibility
    openCart() {
        const cartPanel = document.getElementById('cartPanel');
        if (cartPanel) {
            cartPanel.classList.add('active');
            this.cartVisible = true;
        }
    }

    closeCart() {
        const cartPanel = document.getElementById('cartPanel');
        if (cartPanel) {
            cartPanel.classList.remove('active');
            this.cartVisible = false;
        }
    }

    toggleCart() {
        if (this.cartVisible) {
            this.closeCart();
        } else {
            this.openCart();
        }
    }

    // Events
    bindEvents() {
        const cartButton = document.getElementById('cartButton');
        const cartClose = document.getElementById('cartClose');
        const clearCartBtn = document.getElementById('clearCartBtn');
        const checkoutBtn = document.getElementById('checkoutBtn');

        if (cartButton) {
            cartButton.addEventListener('click', () => this.toggleCart());
        }

        if (cartClose) {
            cartClose.addEventListener('click', () => this.closeCart());
        }

        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => this.clearCart());
        }

        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.checkout());
        }

        // Close cart when clicking outside
        document.addEventListener('click', (e) => {
            const cartPanel = document.getElementById('cartPanel');
            const cartButton = document.getElementById('cartButton');
            if (this.cartVisible && cartPanel && !cartPanel.contains(e.target) && !cartButton.contains(e.target)) {
                this.closeCart();
            }
        });

        // Close with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.cartVisible) {
                this.closeCart();
            }
        });
    }

    // Checkout
    checkout() {
        if (this.cart.length === 0) {
            this.showNotification('Your cart is empty', 'warning');
            return;
        }

        const orderId = 'ORD' + Date.now();
        const order = {
            id: orderId,
            items: [...this.cart],
            total: this.getTotal(),
            date: new Date().toISOString()
        };

        // Save order to history
        this.saveOrder(order);

        // Clear cart
        this.cart = [];
        this.saveCart();
        this.updateCartDisplay();
        this.closeCart();

        this.showNotification(`Order ${orderId} placed successfully!`, 'success');
    }

    saveOrder(order) {
        const orders = JSON.parse(localStorage.getItem('chillzoneOrders') || '[]');
        orders.push(order);
        localStorage.setItem('chillzoneOrders', JSON.stringify(orders));
    }

    // Notifications
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `cart-notification ${type}`;
        notification.textContent = message;

        // Remove existing notifications
        document.querySelectorAll('.cart-notification').forEach(n => n.remove());

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    // Styles
    addStyles() {
        if (document.getElementById('simpleCartStyles')) return;

        const style = document.createElement('style');
        style.id = 'simpleCartStyles';
        style.textContent = `
            .simple-cart {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 10000;
                font-family: Arial, sans-serif;
            }

            .cart-button {
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #ff3366, #ff1a4d);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(255, 51, 102, 0.4);
                transition: all 0.3s ease;
            }

            .cart-button:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 20px rgba(255, 51, 102, 0.6);
            }

            .cart-icon {
                font-size: 24px;
                color: white;
            }

            .cart-count {
                position: absolute;
                top: -8px;
                right: -8px;
                background: #ff1a4d;
                color: white;
                border-radius: 50%;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: bold;
                border: 2px solid white;
            }

            .cart-panel {
                position: absolute;
                bottom: 80px;
                right: 0;
                width: 350px;
                max-height: 500px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                opacity: 0;
                visibility: hidden;
                transform: translateY(20px);
                transition: all 0.3s ease;
                border: 1px solid #ddd;
            }

            .cart-panel.active {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }

            .cart-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid #eee;
                background: #f8f9fa;
                border-radius: 12px 12px 0 0;
            }

            .cart-header h3 {
                margin: 0;
                color: #333;
                font-size: 18px;
            }

            #cartClose {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #666;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            #cartClose:hover {
                color: #333;
            }

            .cart-items {
                max-height: 300px;
                overflow-y: auto;
                padding: 0;
            }

            .empty-cart {
                text-align: center;
                padding: 40px 20px;
                color: #666;
                font-style: italic;
            }

            .cart-item {
                display: flex;
                align-items: center;
                padding: 15px 20px;
                border-bottom: 1px solid #eee;
            }

            .cart-item:last-child {
                border-bottom: none;
            }

            .cart-item-img {
                width: 50px;
                height: 50px;
                object-fit: cover;
                border-radius: 6px;
                margin-right: 15px;
            }

            .cart-item-info {
                flex: 1;
            }

            .cart-item-name {
                font-weight: 600;
                color: #333;
                margin-bottom: 4px;
            }

            .cart-item-price {
                color: #ff3366;
                font-weight: 500;
            }

            .cart-item-controls {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .quantity-btn {
                background: #f0f0f0;
                border: none;
                width: 28px;
                height: 28px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .quantity-btn:hover {
                background: #e0e0e0;
            }

            .quantity {
                min-width: 30px;
                text-align: center;
                font-weight: 600;
            }

            .remove-btn {
                background: #ff4444;
                color: white;
                border: none;
                width: 28px;
                height: 28px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .remove-btn:hover {
                background: #cc3333;
            }

            .cart-footer {
                padding: 20px;
                border-top: 1px solid #eee;
                background: #f8f9fa;
                border-radius: 0 0 12px 12px;
            }

            .cart-total {
                margin-bottom: 15px;
                font-size: 18px;
                color: #333;
            }

            .cart-actions {
                display: flex;
                gap: 10px;
            }

            .btn-primary, .btn-secondary {
                flex: 1;
                padding: 12px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.2s;
            }

            .btn-primary {
                background: #ff3366;
                color: white;
            }

            .btn-primary:hover {
                background: #ff1a4d;
                transform: translateY(-1px);
            }

            .btn-secondary {
                background: #6c757d;
                color: white;
            }

            .btn-secondary:hover {
                background: #5a6268;
            }

            .cart-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #333;
                color: white;
                padding: 16px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
                z-index: 10001;
                animation: slideIn 0.3s ease-out;
            }

            .cart-notification.success {
                background: #10b981;
            }

            .cart-notification.error {
                background: #ef4444;
            }

            .cart-notification.warning {
                background: #f59e0b;
            }

            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @media (max-width: 768px) {
                .simple-cart {
                    bottom: 15px;
                    right: 15px;
                }

                .cart-panel {
                    width: calc(100vw - 30px);
                    right: -15px;
                }
            }
        `;

        document.head.appendChild(style);
    }
}

// Initialize cart when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.simpleCart = new SimpleCart();
});
