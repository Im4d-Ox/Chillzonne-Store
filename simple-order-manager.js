// Simple Order Management System
class SimpleOrderManager {
    constructor() {
        this.orders = this.loadOrders();
        this.init();
    }
    
    init() {
        this.createOrderSection();
        this.bindEvents();
        this.displayOrders();
    }
    
    loadOrders() {
        try {
            const saved = localStorage.getItem('adminOrders');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.warn('Error loading orders:', error);
            return [];
        }
    }
    
    saveOrders() {
        try {
            localStorage.setItem('adminOrders', JSON.stringify(this.orders));
        } catch (error) {
            console.error('Error saving orders:', error);
        }
    }
    
    createOrderSection() {
        // Check if orders section already exists
        if (document.getElementById('ordersSection')) {
            return;
        }
        
        const ordersSection = document.createElement('div');
        ordersSection.id = 'ordersSection';
        ordersSection.className = 'content-section';
        ordersSection.innerHTML = `
            <div class="section-header">
                <h2>📦 Order Management</h2>
                <p>View and manage customer orders</p>
            </div>
            
            <div class="orders-toolbar">
                <div class="toolbar-left">
                    <input type="text" id="orderSearch" placeholder="Search orders..." class="search-input">
                    <select id="statusFilter" class="filter-select">
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
                <div class="toolbar-right">
                    <button id="refreshBtn" class="btn btn-primary">🔄 Refresh</button>
                    <button id="exportBtn" class="btn btn-secondary">📊 Export</button>
                </div>
            </div>
            
            <div class="orders-stats">
                <div class="stat-card">
                    <div class="stat-number" id="totalOrders">0</div>
                    <div class="stat-label">Total Orders</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="totalRevenue">$0</div>
                    <div class="stat-label">Total Revenue</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="pendingOrders">0</div>
                    <div class="stat-label">Pending</div>
                </div>
            </div>
            
            <div class="orders-table-wrapper">
                <table class="orders-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="ordersTableBody">
                        <tr>
                            <td colspan="6" style="text-align: center; padding: 40px; color: #666;">
                                Loading orders...
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
        
        // Add to admin content
        const adminContent = document.querySelector('.admin-content');
        if (adminContent) {
            adminContent.appendChild(ordersSection);
            console.log('Orders section added to admin content');
        } else {
            console.error('Admin content area not found!');
        }
        
        this.addStyles();
    }
    
    bindEvents() {
        // Search functionality
        const searchInput = document.getElementById('orderSearch');
        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterOrders());
        }
        
        // Status filter
        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', () => this.filterOrders());
        }
        
        // Refresh button
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshOrders());
        }
        
        // Export button
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportOrders());
        }
        
        // Listen for new orders
        document.addEventListener('orderPlaced', (e) => {
            this.addOrder(e.detail);
        });
    }
    
    filterOrders() {
        const searchTerm = document.getElementById('orderSearch')?.value.toLowerCase() || '';
        const statusFilter = document.getElementById('statusFilter')?.value || '';
        
        const filteredOrders = this.orders.filter(order => {
            const matchesSearch = !searchTerm || 
                order.id.toLowerCase().includes(searchTerm) ||
                (order.customer && order.customer.toLowerCase().includes(searchTerm));
            
            const matchesStatus = !statusFilter || order.status === statusFilter;
            
            return matchesSearch && matchesStatus;
        });
        
        this.displayOrders(filteredOrders);
    }
    
    displayOrders(orders = this.orders) {
        const tbody = document.getElementById('ordersTableBody');
        if (!tbody) return;
        
        if (orders.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 40px; color: #666;">
                        No orders found
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = orders.map(order => `
            <tr>
                <td class="order-id">${order.id}</td>
                <td>${new Date(order.date).toLocaleDateString()}</td>
                <td>${order.items ? order.items.length : 0} items</td>
                <td style="color: #ff3366; font-weight: 600;">$${order.total.toFixed(2)}</td>
                <td>
                    <span class="status-badge status-${order.status}">${order.status}</span>
                </td>
                <td>
                    <button class="btn-small btn-view" onclick="simpleOrderManager.viewOrder('${order.id}')">View</button>
                    <button class="btn-small btn-edit" onclick="simpleOrderManager.updateStatus('${order.id}')">Update</button>
                </td>
            </tr>
        `).join('');
        
        this.updateStats();
    }
    
    updateStats() {
        const totalOrdersEl = document.getElementById('totalOrders');
        const totalRevenueEl = document.getElementById('totalRevenue');
        const pendingOrdersEl = document.getElementById('pendingOrders');
        
        if (totalOrdersEl) totalOrdersEl.textContent = this.orders.length;
        
        const revenue = this.orders.reduce((sum, order) => 
            sum + (order.status === 'delivered' ? order.total : 0), 0);
        if (totalRevenueEl) totalRevenueEl.textContent = `$${revenue.toFixed(2)}`;
        
        const pending = this.orders.filter(order => order.status === 'pending').length;
        if (pendingOrdersEl) pendingOrdersEl.textContent = pending;
    }
    
    viewOrder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;
        
        const itemsHtml = order.items ? order.items.map(item => `
            <div class="order-item">
                <strong>${item.name}</strong><br>
                Quantity: ${item.quantity} × $${item.price} = $${(item.quantity * item.price).toFixed(2)}
            </div>
        `).join('') : 'No items';
        
        alert(`Order Details: ${order.id}\\n\\n\\nCustomer: ${order.customer || 'Guest'}\\n\\nItems:\\n${itemsHtml}\\n\\nTotal: $${order.total.toFixed(2)}\\n\\nStatus: ${order.status}`);
    }
    
    updateStatus(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;
        
        const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        const currentIndex = statuses.indexOf(order.status);
        const nextStatus = statuses[(currentIndex + 1) % statuses.length];
        
        order.status = nextStatus;
        order.lastUpdated = new Date().toISOString();
        
        this.saveOrders();
        this.displayOrders();
        
        this.showNotification(`Order ${orderId} status updated to ${nextStatus}`, 'success');
    }
    
    addOrder(order) {
        // Add customer info if not present
        if (!order.customer) {
            order.customer = 'Guest User';
            order.email = 'guest@example.com';
        }
        
        this.orders.unshift(order);
        this.saveOrders();
        this.displayOrders();
        
        this.showNotification(`New order received: ${order.id}`, 'success');
    }
    
    refreshOrders() {
        // Load orders from order history
        const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
        
        orderHistory.forEach(order => {
            if (!this.orders.find(o => o.id === order.id)) {
                this.addOrder(order);
            }
        });
        
        this.showNotification('Orders refreshed', 'info');
    }
    
    exportOrders() {
        if (this.orders.length === 0) {
            this.showNotification('No orders to export', 'warning');
            return;
        }
        
        const csv = [
            ['Order ID', 'Date', 'Customer', 'Items', 'Total', 'Status'],
            ...this.orders.map(order => [
                order.id,
                new Date(order.date).toLocaleString(),
                order.customer || 'Guest',
                order.items ? order.items.length : 0,
                order.total.toFixed(2),
                order.status
            ])
        ].map(row => row.join(',')).join('\\n');
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        this.showNotification('Orders exported successfully', 'success');
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            z-index: 100001;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            animation: slideIn 0.3s ease-out;
            max-width: 300px;
            font-size: 14px;
            font-weight: 500;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 3000);
        }, 3000);
    }
    
    addStyles() {
        if (document.getElementById('simpleOrderStyles')) return;
        
        const style = document.createElement('style');
        style.id = 'simpleOrderStyles';
        style.textContent = `
            .orders-container {
                max-width: 1200px;
                margin: 40px auto;
                padding: 20px;
                background: linear-gradient(135deg, #1a1a1a, #0a0a0a);
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            }
            
            .orders-header {
                text-align: center;
                margin-bottom: 30px;
            }
            
            .orders-header h1 {
                color: var(--text-light, #ffffff);
                font-size: 32px;
                margin-bottom: 10px;
            }
            
            .orders-header p {
                color: var(--text-muted, #999);
                font-size: 16px;
                margin-bottom: 20px;
            }
            
            .back-to-shop {
                display: inline-block;
                background: var(--accent, #ff3366);
                color: white;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                transition: all 0.3s ease;
            }
            
            .back-to-shop:hover {
                background: var(--accent-hover, #ff1a4d);
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(255, 51, 102, 0.3);
            }
            
            .orders-info {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 20px;
                border-left: 4px solid var(--accent, #ff3366);
            }
            
            .orders-info h3 {
                color: var(--text-light, #ffffff);
                margin-bottom: 10px;
            }
            
            .orders-info p {
                color: var(--text-muted, #999);
                line-height: 1.6;
            }
            
            .orders-info ul {
                list-style: none;
                padding: 0;
            }
            
            .orders-info li {
                padding: 8px 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                color: var(--text-light, #ffffff);
            }
            
            .orders-info li:last-child {
                border-bottom: none;
            }
            
            .orders-info li strong {
                color: var(--accent, #ff3366);
                font-weight: 600;
            }
            
            .orders-info ul {
                list-style: none;
                padding: 0;
            }
            
            .orders-info li:last-child {
                border-bottom: none;
            }
            
            .orders-info li strong {
                color: var(--accent, #ff3366);
                font-weight: 600;
            }
            
            .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, var(--accent, #ff3366), var(--accent-hover, #ff1a4d));
                color: white;
                padding: 16px 32px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                transition: all 0.3s ease;
                margin-top: 20px;
            }
            
            .cta-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(255, 51, 102, 0.4);
            }
            
            .orders-toolbar {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding: 15px;
                background: var(--bg-dark, #000000);
                border-radius: 8px;
                gap: 10px;
                flex-wrap: wrap;
            }
            
            .toolbar-left, .toolbar-right {
                justify-content: center;
            }
            
            .search-input, .filter-select {
                padding: 8px 12px;
                border: 1px solid #444;
                border-radius: 6px;
                background: var(--bg-section, #1a1a1a);
                color: white;
                font-size: 14px;
            }
            
            .search-input {
                width: 200px;
            }
            
            .orders-stats {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 15px;
                margin-bottom: 20px;
            }
            
            .stat-card {
                background: linear-gradient(135deg, var(--bg-section, #1a1a1a), var(--bg-dark, #0a0a0a));
                border: 1px solid #444;
                border-radius: 8px;
                padding: 20px;
                text-align: center;
            }
            
            .stat-number {
                font-size: 24px;
                font-weight: 700;
                color: var(--accent, #ff3366);
                margin-bottom: 5px;
            }
            
            .stat-label {
                color: var(--text-muted, #999);
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .orders-table-wrapper {
                background: var(--bg-section, #1a1a1a);
                border-radius: 8px;
                overflow: hidden;
                border: 1px solid #444;
            }
            
            .orders-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 14px;
            }
            
            .orders-table th {
                background: var(--bg-dark, #0a0a0a);
                color: white;
                font-weight: 600;
                text-align: left;
                padding: 12px;
                border-bottom: 2px solid var(--accent, #ff3366);
            }
            
            .orders-table td {
                padding: 12px;
                border-bottom: 1px solid #444;
                color: var(--text-muted, #ccc);
            }
            
            .orders-table tbody tr:hover {
                background: rgba(255, 51, 102, 0.05);
            }
            
            .order-id {
                font-family: monospace;
                font-weight: 600;
                color: var(--accent, #ff3366);
            }
            
            .status-badge {
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .status-pending { background: #f59e0b; color: #92400e; }
            .status-processing { background: #3b82f6; color: white; }
            .status-shipped { background: #8b5cf6; color: white; }
            .status-delivered { background: #10b981; color: white; }
            .status-cancelled { background: #ef4444; color: white; }
            
            .btn-small {
                padding: 4px 8px;
                font-size: 11px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                margin-right: 5px;
                transition: all 0.2s;
            }
            
            .btn-view { background: #3b82f6; color: white; }
            .btn-view:hover { background: #2563eb; }
            .btn-edit { background: #f59e0b; color: #92400e; }
            .btn-edit:hover { background: #d97706; }
            
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOut {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(100%); opacity: 0; }
            }
            
            @media (max-width: 768px) {
                .orders-container {
                    margin: 20px;
                    padding: 15px;
                }
                
                .orders-header h1 {
                    font-size: 24px;
                }
                
                .orders-header p {
                    font-size: 14px;
                }
                
                .back-to-shop {
                    display: block;
                    text-align: center;
                    margin-bottom: 20px;
                }
                
                .orders-toolbar {
                    flex-direction: column;
                    align-items: stretch;
                }
                
                .toolbar-left, .toolbar-right {
                    justify-content: center;
                }
                
                .search-input {
                    width: 100%;
                    margin-bottom: 10px;
                }
                
                .orders-stats {
                    grid-template-columns: repeat(2, 1fr);
                }
            }
        `;
        
        document.head.appendChild(style);
    }
}

// Show orders section when menu is clicked
function showOrdersSection() {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Remove active class from all menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show orders section
    const ordersSection = document.getElementById('ordersSection');
    if (ordersSection) {
        ordersSection.style.display = 'block';
    }
    
    // Add active class to orders menu item
    const ordersMenuItem = document.querySelector('[data-section="orders"]');
    if (ordersMenuItem) {
        ordersMenuItem.classList.add('active');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.simpleOrderManager = new SimpleOrderManager();
    
    // Add click handler for orders menu item
    const ordersMenuItem = document.querySelector('[data-section="orders"]');
    if (ordersMenuItem) {
        ordersMenuItem.addEventListener('click', (e) => {
            e.preventDefault();
            showOrdersSection();
        });
    }
});
