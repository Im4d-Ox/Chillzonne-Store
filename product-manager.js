// Product Detail and Shopping Cart System
class ProductManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('chillzoneCart')) || [];
        this.settings = this.loadSettings();
        this.initializeEventListeners();
        this.updateCartUI();
    }
    
    loadSettings() {
        const savedSettings = localStorage.getItem('adminSettings');
        if (savedSettings) {
            return JSON.parse(savedSettings);
        }
        // Default settings
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
        // Listen for product clicks
        document.addEventListener('click', async (e) => {
            if (e.target.closest('.product-card')) {
                const productCard = e.target.closest('.product-card');
                const productId = productCard.dataset.productId;
                await this.showProductDetail(productId);
            }
        });
        
        // Cart toggle
        const cartToggle = document.getElementById('cartToggle');
        if (cartToggle) {
            cartToggle.addEventListener('click', () => this.toggleCart());
        }
        
        // Close modals
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.closeProductDetail();
                this.closeCart();
            }
        });
        
        // Listen for settings changes
        window.addEventListener('storage', (e) => {
            if (e.key === 'adminSettings') {
                this.settings = this.loadSettings();
                this.updateCartUI();
                // Update prices on page if needed
                this.updateProductPrices();
            }
        });
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
    
    async showProductDetail(productId) {
        const products = await this.getProducts();
        const product = products.find(p => p.id == productId);
        
        if (!product) return;
        
        this.createProductModal(product);
    }
    
    createProductModal(product) {
        // Remove existing modal
        this.closeProductDetail();
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            animation: fadeIn 0.3s forwards;
        `;
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: rgba(0, 0, 0, 0.95);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 30px;
            max-width: 800px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            backdrop-filter: blur(10px);
            transform: scale(0.9);
            animation: scaleIn 0.3s forwards;
        `;
        
        modalContent.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="color: var(--text-light); margin: 0;">${product.name}</h2>
                <button onclick="this.closest('.modal-overlay').remove()" style="background: transparent; border: none; color: var(--text-muted); font-size: 24px; cursor: pointer;">×</button>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                <div>
                    <img src="${product.image}" alt="${product.name}" style="width: 100%; border-radius: 8px; margin-bottom: 15px;">
                    <div style="display: flex; gap: 10px; overflow-x: auto;">
                        ${this.createProductThumbnails(product)}
                    </div>
                </div>
                
                <div>
                    <div style="margin-bottom: 20px;">
                        <span style="background: var(--accent); color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${product.category}</span>
                        <h3 style="color: var(--text-light); font-size: 24px; margin: 10px 0;">${product.name}</h3>
                        <p style="color: var(--accent); font-size: 28px; font-weight: bold;">${this.formatPrice(product.price)}</p>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <h4 style="color: var(--text-light); margin-bottom: 10px;">Description</h4>
                        <p style="color: var(--text-muted); line-height: 1.6;">${product.description}</p>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <h4 style="color: var(--text-light); margin-bottom: 10px;">Features</h4>
                        <ul style="color: var(--text-muted); list-style: none; padding: 0;">
                            ${this.createFeatureList(product.features)}
                        </ul>
                    </div>
                    
                    <div style="display: flex; gap: 15px;">
                        <button onclick="productManager.addToCart(${product.id})" style="background: var(--accent); color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 16px; font-weight: 600; flex: 1;">
                            🛒 Add to Cart
                        </button>
                        <button onclick="productManager.buyNow(${product.id})" style="background: transparent; color: var(--accent); border: 2px solid var(--accent); padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 16px; font-weight: 600; flex: 1;">
                            👁️ View Details
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // Add animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                to { opacity: 1; }
            }
            @keyframes scaleIn {
                to { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }
    
    createProductThumbnails(product) {
        const thumbnails = [
            product.image,
            'images/art-of-fashion-01.avif',
            'images/art-of-fashion-02.avif'
        ];
        
        return thumbnails.map((thumb, index) => `
            <img src="${thumb}" alt="Thumbnail ${index + 1}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px; cursor: pointer; border: 2px solid ${index === 0 ? 'var(--accent)' : 'transparent'};">
        `).join('');
    }
    
    createFeatureList(features) {
        const defaultFeatures = [
            'High quality graphics',
            'Optimized performance',
            'Regular updates',
            '24/7 support'
        ];
        
        const featureList = features || defaultFeatures;
        
        return featureList.map(feature => `
            <li style="margin-bottom: 8px;">✓ ${feature}</li>
        `).join('');
    }
    
    closeProductDetail() {
        const modal = document.querySelector('.modal-overlay');
        if (modal) modal.remove();
    }
    
    // Shopping Cart Functions
    async addToCart(productId) {
        const products = await this.getProducts();
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
        
        // Close product modal
        this.closeProductDetail();
    }
    
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id != productId);
        this.saveCart();
        this.updateCartUI();
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
        
        this.updateCartItems();
    }
    
    updateCartItems() {
        const cartItems = document.getElementById('cartItems');
        if (!cartItems) return;
        
        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div style="text-align: center; padding: 60px 20px;">
                    <div style="width: 80px; height: 80px; background: rgba(255, 255, 255, 0.05); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 36px;">
                        🛒
                    </div>
                    <h3 style="color: var(--text-light); margin: 0; font-size: 18px;">Your cart is empty</h3>
                    <p style="color: var(--text-muted); margin: 10px 0 0; font-size: 14px;">Add some items to get started!</p>
                </div>
            `;
            return;
        }
        
        cartItems.innerHTML = this.cart.map((item, index) => `
            <div class="cart-item" style="display: flex; align-items: center; padding: 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); opacity: 0; animation-delay: ${index * 0.1}s;">
                <div style="position: relative; margin-right: 20px;">
                    <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);">
                    <div style="position: absolute; top: -5px; right: -5px; background: var(--accent); color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; box-shadow: 0 2px 8px rgba(255, 51, 102, 0.4);">
                        ${item.quantity}
                    </div>
                </div>
                <div style="flex: 1;">
                    <h4 style="color: var(--text-light); margin: 0 0 5px; font-size: 16px; font-weight: 600;">${item.name}</h4>
                    <p style="color: var(--accent); margin: 0; font-size: 18px; font-weight: 700;">${this.formatPrice(item.price)}</p>
                    <p style="color: var(--text-muted); margin: 5px 0 0; font-size: 12px;">Item subtotal: ${this.formatPrice(item.price * item.quantity)}</p>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <button onclick="productManager.updateQuantity(${item.id}, ${item.quantity - 1})" class="quantity-btn" style="background: rgba(255, 255, 255, 0.1); border: none; color: white; width: 32px; height: 32px; border-radius: 6px; cursor: pointer; font-size: 16px; font-weight: bold; display: flex; align-items: center; justify-content: center;">−</button>
                    <span style="color: white; min-width: 30px; text-align: center; font-weight: 600;">${item.quantity}</span>
                    <button onclick="productManager.updateQuantity(${item.id}, ${item.quantity + 1})" class="quantity-btn" style="background: rgba(255, 255, 255, 0.1); border: none; color: white; width: 32px; height: 32px; border-radius: 6px; cursor: pointer; font-size: 16px; font-weight: bold; display: flex; align-items: center; justify-content: center;">+</button>
                    <button onclick="productManager.removeFromCart(${item.id})" class="remove-btn" style="background: rgba(255, 255, 255, 0.1); border: none; color: var(--text-muted); width: 32px; height: 32px; border-radius: 6px; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center;">×</button>
                </div>
            </div>
        `).join('');
    }
    
    toggleCart() {
        const cartModal = document.getElementById('cartModal');
        if (cartModal) {
            cartModal.remove();
        } else {
            this.showCart();
        }
    }
    
    showCart() {
        // Remove existing modal
        const existingModal = document.getElementById('cartModal');
        if (existingModal) existingModal.remove();
        
        const modal = document.createElement('div');
        modal.id = 'cartModal';
        modal.className = 'modal-overlay';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            animation: fadeIn 0.3s forwards;
        `;
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(10, 10, 10, 0.95) 100%);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 0;
            max-width: 600px;
            width: 90%;
            max-height: 85vh;
            overflow: hidden;
            backdrop-filter: blur(20px);
            transform: scale(0.9);
            animation: slideInUp 0.4s 0.1s forwards;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
        `;
        
        const total = this.cart.reduce((sum, item) => {
            const cleanPrice = parseFloat(item.price.toString().replace(/[^0-9.]/g, ''));
            return sum + (cleanPrice * item.quantity);
        }, 0);
        
        modalContent.innerHTML = `
            <div style="padding: 30px; padding-bottom: 0;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <div style="width: 50px; height: 50px; background: linear-gradient(135deg, var(--accent), var(--accent-hover)); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px;">
                            🛒
                        </div>
                        <div>
                            <h2 style="color: var(--text-light); margin: 0; font-size: 24px; font-weight: 700;">Shopping Cart</h2>
                            <p style="color: var(--text-muted); margin: 0; font-size: 14px;">${this.cart.length} items</p>
                        </div>
                    </div>
                    <button onclick="this.closest('.modal-overlay').remove()" style="background: rgba(255, 255, 255, 0.1); border: none; color: var(--text-muted); font-size: 28px; cursor: pointer; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;">×</button>
                </div>
            </div>
            
            <div style="max-height: 400px; overflow-y: auto; padding: 0 30px;" id="cartItems">
                <!-- Cart items will be inserted here -->
            </div>
            
            <div style="padding: 30px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                    <div>
                        <p style="color: var(--text-muted); margin: 0; font-size: 14px;">Total Amount</p>
                        <p style="color: var(--text-light); margin: 0; font-size: 24px; font-weight: 700;">${this.formatPrice(total)}</p>
                    </div>
                    <div style="text-align: right;">
                        <button onclick="productManager.clearCart()" style="background: transparent; color: var(--text-muted); border: 1px solid rgba(255, 255, 255, 0.2); padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 12px; margin-bottom: 10px; transition: all 0.3s ease;">Clear Cart</button>
                    </div>
                </div>
                <button onclick="productManager.checkout()" style="background: linear-gradient(135deg, var(--accent), var(--accent-hover)); color: white; border: none; padding: 16px 32px; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: 600; width: 100%; transition: all 0.3s ease; box-shadow: 0 8px 25px rgba(255, 51, 102, 0.3); text-transform: uppercase; letter-spacing: 1px;">
                    Proceed to Checkout
                </button>
            </div>
        `;
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // Add animations
        if (!document.querySelector('#cartAnimations')) {
            const style = document.createElement('style');
            style.id = 'cartAnimations';
            style.textContent = `
                @keyframes fadeIn {
                    to { opacity: 1; }
                }
                @keyframes slideInUp {
                    to { 
                        transform: scale(1) translateY(0); 
                        opacity: 1;
                    }
                }
                @keyframes slideIn {
                    from { 
                        transform: translateX(-20px); 
                        opacity: 0;
                    }
                    to { 
                        transform: translateX(0); 
                        opacity: 1;
                    }
                }
                .cart-item {
                    animation: slideIn 0.3s ease forwards;
                }
                .cart-item:hover {
                    background: rgba(255, 255, 255, 0.05);
                    transform: translateX(5px);
                }
                .quantity-btn {
                    transition: all 0.2s ease;
                }
                .quantity-btn:hover {
                    background: var(--accent) !important;
                    transform: scale(1.1);
                }
                .quantity-btn:active {
                    transform: scale(0.95);
                }
                .remove-btn {
                    transition: all 0.2s ease;
                }
                .remove-btn:hover {
                    background: #ff1a4d !important;
                    transform: scale(1.05);
                }
            `;
            document.head.appendChild(style);
        }
        
        this.updateCartItems();
        
        // Add hover effect for close button
        const closeBtn = modalContent.querySelector('button[onclick*="remove"]');
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.background = 'rgba(255, 51, 102, 0.2)';
            closeBtn.style.color = 'white';
        });
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.background = 'rgba(255, 255, 255, 0.1)';
            closeBtn.style.color = 'var(--text-muted)';
        });
    }
    
    clearCart() {
        if (this.cart.length === 0) {
            this.showNotification('Cart is already empty!');
            return;
        }
        
        if (confirm('Are you sure you want to clear your cart?')) {
            this.cart = [];
            this.saveCart();
            this.updateCartUI();
            this.showNotification('Cart cleared successfully!');
            this.closeCart();
        }
    }
    
    closeCart() {
        const cartModal = document.getElementById('cartModal');
        if (cartModal) cartModal.remove();
    }
    
    checkout() {
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
            this.closeCart();
        }
    }
    
    buyNow(productId) {
        this.addToCart(productId);
        this.toggleCart();
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
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
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Add animations if not already present
        if (!document.querySelector('#notificationAnimations')) {
            const style = document.createElement('style');
            style.id = 'notificationAnimations';
            style.textContent = `
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
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    async getProducts() {
        // Try loading from Firebase first
        if (typeof db !== 'undefined') {
            try {
                const productsDoc = await db.collection('storeData').doc('products').get();
                if (productsDoc.exists) {
                    const firebaseProducts = productsDoc.data().items || [];
                    if (firebaseProducts.length > 0) {
                        return firebaseProducts;
                    }
                }
            } catch (error) {
                console.log('Firebase load failed, using localStorage:', error.message);
            }
        }

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
window.productManager = new ProductManager();
