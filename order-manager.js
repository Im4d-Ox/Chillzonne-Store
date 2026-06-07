// Order Management System for Admin Panel
class OrderManager {
    constructor() {
        this.orders = this.loadOrders();
        this.init();
    }
    
    init() {
        this.createOrderUI();
        this.bindEvents();
        this.updateOrdersList();
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
    
    createOrderUI() {
        const ordersSection = document.createElement('div');
        ordersSection.className = 'content-section';
        ordersSection.id = 'orders';
        ordersSection.innerHTML = `
            <div class="section-header">
                <h2>Order Management</h2>
                <p>Manage customer orders and track sales</p>
            </div>
            
            <div class="orders-controls">
                <div class="control-group">
                    <input type="text" id="orderSearch" placeholder="Search orders..." class="search-input">
                    <select id="orderStatusFilter" class="filter-select">
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    <input type="date" id="orderDateFilter" class="date-input">
                </div>
                <div class="control-group">
                    <button id="exportOrders" class="btn btn-secondary">Export CSV</button>
                    <button id="refreshOrders" class="btn btn-primary">Refresh</button>
                </div>
            </div>
            
            <div class="orders-stats">
                <div class="stat-card">
                    <div class="stat-icon">📦</div>
                    <div class="stat-content">
                        <div class="stat-number" id="totalOrders">0</div>
                        <div class="stat-label">Total Orders</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">💰</div>
                    <div class="stat-content">
                        <div class="stat-number" id="totalRevenue">$0</div>
                        <div class="stat-label">Total Revenue</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">⏳</div>
                    <div class="stat-content">
                        <div class="stat-number" id="pendingOrders">0</div>
                        <div class="stat-label">Pending</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">✅</div>
                    <div class="stat-content">
                        <div class="stat-number" id="completedOrders">0</div>
                        <div class="stat-label">Completed</div>
                    </div>
                </div>
            </div>
            
            <div class="orders-table-container">
                <table class="orders-table" id="ordersTable">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Customer</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="ordersTableBody">
                        <tr>
                            <td colspan="7" style="text-align: center; padding: 40px; color: #999;">
                                Loading orders...
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div class="order-details-modal" id="orderDetailsModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Order Details</h3>
                        <button class="modal-close" id="closeOrderModal">×</button>
                    </div>
                    <div class="modal-body" id="orderDetailsBody">
                        <!-- Order details will be populated here -->
                    </div>
                </div>
            </div>
        `;
        
        // Find the admin content area and add orders section
        const adminContent = document.querySelector('.admin-content');
        if (adminContent) {
            adminContent.appendChild(ordersSection);
        }
        
        this.injectStyles();
    }
    
    injectStyles() {
        if (document.getElementById('orderManagerStyles')) return;
        
        const style = document.createElement('style');
        style.id = 'orderManagerStyles';
        style.textContent = `
            .orders-controls {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 30px;
                padding: 20px;
                background: #2a2a2a;
                border-radius: 8px;
                flex-wrap: wrap;
                gap: 15px;
                border: 1px solid #444;
            }
            
            .control-group {
                display: flex;
                gap: 10px;
                align-items: center;
            }
            
            .search-input, .filter-select, .date-input {
                padding: 10px 15px;
                border: 1px solid #444;
                border-radius: 6px;
                background: #1a1a1a;
                color: white;
                font-size: 14px;
            }
            
            .search-input {
                width: 250px;
            }
            
            .orders-stats {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }
            
            .stat-card {
                background: linear-gradient(135deg, #2a2a2a, #1a1a1a);
                border: 1px solid #444;
                border-radius: 12px;
                padding: 20px;
                display: flex;
                align-items: center;
                gap: 15px;
                transition: transform 0.2s;
            }
            
            .stat-card:hover {
                transform: translateY(-2px);
            }
            
            .stat-icon {
                font-size: 32px;
                width: 60px;
                height: 60px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(255, 51, 102, 0.1);
                border-radius: 50%;
            }
            
            .stat-content {
                flex: 1;
            }
            
            .stat-number {
                font-size: 24px;
                font-weight: 700;
                color: #ff3366;
                margin-bottom: 5px;
            }
            
            .stat-label {
                color: #999;
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .orders-table-container {
                background: #2a2a2a;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                border: 1px solid #444;
            }
            
            .orders-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 14px;
                color: #ccc;
            }
            
            .orders-table th {
                background: #1a1a1a;
                color: white;
                font-weight: 600;
                text-align: left;
                padding: 15px;
                border-bottom: 2px solid #ff3366;
                text-transform: uppercase;
                font-size: 12px;
                letter-spacing: 0.5px;
            }
            
            .orders-table td {
                padding: 15px;
                border-bottom: 1px solid #444;
                color: #ccc;
            }
            
            .orders-table tbody tr:hover {
                background: rgba(255, 51, 102, 0.05);
            }
            
            .order-id {
                font-family: monospace;
                font-weight: 600;
                color: #ff3366;
            }
            
            .status-badge {
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .status-pending {
                background: #f59e0b;
                color: #92400e;
            }
            
            .status-processing {
                background: #3b82f6;
                color: white;
            }
            
            .status-shipped {
                background: #8b5cf6;
                color: white;
            }
            
            .status-delivered {
                background: #10b981;
                color: white;
            }
            
            .status-cancelled {
                background: #ef4444;
                color: white;
            }
            
            .action-buttons {
                display: flex;
                gap: 5px;
            }
            
            .btn-small {
                padding: 6px 12px;
                font-size: 12px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .btn-view {
                background: #3b82f6;
                color: white;
            }
            
            .btn-view:hover {
                background: #2563eb;
            }
            
            .btn-edit {
                background: #f59e0b;
                color: #92400e;
            }
            
            .btn-edit:hover {
                background: #d97706;
            }
            
            .order-details-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: none;
                align-items: center;
                justify-content: center;
                z-index: 100000;
            }
            
            .order-details-modal.active {
                display: flex;
            }
            
            .modal-content {
                background: #2a2a2a;
                border-radius: 12px;
                width: 90%;
                max-width: 800px;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
                border: 1px solid #444;
            }
            
            .modal-header {
                padding: 20px;
                border-bottom: 1px solid #444;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .modal-header h3 {
                margin: 0;
                color: white;
                font-size: 20px;
            }
            
            .modal-close {
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
            
            .modal-close:hover {
                background: #ff3366;
                color: white;
            }
            
            .modal-body {
                padding: 20px;
                color: #ccc;
            }
            
            .order-info-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }
            
            .info-group {
                background: #1a1a1a;
                padding: 15px;
                border-radius: 8px;
                border: 1px solid #444;
            }
            
            .info-label {
                color: #999;
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 5px;
            }
            
            .info-value {
                color: white;
                font-size: 16px;
                font-weight: 600;
            }
            
            .order-items-list {
                background: #1a1a1a;
                border-radius: 8px;
                padding: 20px;
                border: 1px solid #444;
            }
            
            .order-item {
                display: flex;
                align-items: center;
                padding: 15px;
                border-bottom: 1px solid #444;
                gap: 15px;
            }
            
            .order-item:last-child {
                border-bottom: none;
            }
            
            .item-image {
                width: 60px;
                height: 60px;
                object-fit: cover;
                border-radius: 8px;
            }
            
            .item-details {
                flex: 1;
            }
            
            .item-name {
                color: white;
                font-weight: 600;
                margin-bottom: 5px;
            }
            
            .item-meta {
                color: #999;
                font-size: 14px;
            }
            
            .order-summary {
                background: linear-gradient(135deg, #ff3366, #ff1a4d);
                color: white;
                padding: 20px;
                border-radius: 8px;
                margin-top: 20px;
            }
            
            .summary-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
            }
            
            .summary-row:last-child {
                margin-bottom: 0;
                padding-top: 10px;
                border-top: 1px solid rgba(255, 255, 255, 0.2);
                font-size: 18px;
                font-weight: 700;
            }
            
            .btn {
                padding: 10px 20px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 600;
                transition: all 0.2s;
            }
            
            .btn-primary {
                background: #ff3366;
                color: white;
            }
            
            .btn-primary:hover {
                background: #e63946;
            }
            
            .btn-secondary {
                background: #444;
                color: white;
                border: 1px solid #666;
            }
            
            .btn-secondary:hover {
                background: #555;
            }
            
            @media (max-width: 768px) {
                .orders-controls {
                    flex-direction: column;
                    align-items: stretch;
                }
                
                .control-group {
                    justify-content: center;
                }
                
                .search-input {
                    width: 100%;
                }
                
                .orders-stats {
                    grid-template-columns: repeat(2, 1fr);
                }
                
                .orders-table-container {
                    overflow-x: auto;
                }
                
                .modal-content {
                    width: 95%;
                    margin: 10px;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    bindEvents() {
        // Search functionality
        const searchInput = document.getElementById('orderSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterOrders();
            });
        }
        
        // Status filter
        const statusFilter = document.getElementById('orderStatusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', () => {
                this.filterOrders();
            });
        }
        
        // Date filter
        const dateFilter = document.getElementById('orderDateFilter');
        if (dateFilter) {
            dateFilter.addEventListener('change', () => {
                this.filterOrders();
            });
        }
        
        // Export button
        const exportBtn = document.getElementById('exportOrders');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportToCSV();
            });
        }
        
        // Refresh button
        const refreshBtn = document.getElementById('refreshOrders');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.loadOrdersFromHistory();
            });
        }
        
        // Modal close
        const modalClose = document.getElementById('closeOrderModal');
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                this.closeOrderModal();
            });
        }
        
        // Close modal on outside click
        const modal = document.getElementById('orderDetailsModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeOrderModal();
                }
            });
        }
        
        // Listen for new orders
        document.addEventListener('orderPlaced', (e) => {
            this.addOrder(e.detail);
        });
    }
    
    filterOrders() {
        const searchTerm = document.getElementById('orderSearch')?.value.toLowerCase() || '';
        const statusFilter = document.getElementById('orderStatusFilter')?.value || '';
        const dateFilter = document.getElementById('orderDateFilter')?.value || '';
        
        const filteredOrders = this.orders.filter(order => {
            const matchesSearch = !searchTerm || 
                order.id.toLowerCase().includes(searchTerm) ||
                order.customer?.toLowerCase().includes(searchTerm);
            
            const matchesStatus = !statusFilter || order.status === statusFilter;
            
            const matchesDate = !dateFilter || 
                new Date(order.date).toDateString() === new Date(dateFilter).toDateString();
            
            return matchesSearch && matchesStatus && matchesDate;
        });
        
        this.updateOrdersTable(filteredOrders);
    }
    
    updateOrdersList() {
        this.updateOrdersTable(this.orders);
        this.updateStats();
    }
    
    updateOrdersTable(orders) {
        const tbody = document.getElementById('ordersTableBody');
        if (!tbody) return;
        
        if (orders.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 40px; color: #999;">
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
                <td>${order.customer || 'Guest'}</td>
                <td>${order.items.length} items</td>
                <td style="color: #ff3366; font-weight: 600;">$${order.total.toFixed(2)}</td>
                <td>
                    <span class="status-badge status-${order.status}">${order.status}</span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-small btn-view" onclick="orderManager.viewOrderDetails('${order.id}')">View</button>
                        <button class="btn-small btn-edit" onclick="orderManager.updateOrderStatus('${order.id}')">Update</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
    
    updateStats() {
        const totalOrders = document.getElementById('totalOrders');
        const totalRevenue = document.getElementById('totalRevenue');
        const pendingOrders = document.getElementById('pendingOrders');
        const completedOrders = document.getElementById('completedOrders');
        
        if (totalOrders) totalOrders.textContent = this.orders.length;
        
        const revenue = this.orders.reduce((sum, order) => 
            sum + (order.status === 'delivered' ? order.total : 0), 0);
        if (totalRevenue) totalRevenue.textContent = `$${revenue.toFixed(2)}`;
        
        const pending = this.orders.filter(order => order.status === 'pending').length;
        if (pendingOrders) pendingOrders.textContent = pending;
        
        const completed = this.orders.filter(order => order.status === 'delivered').length;
        if (completedOrders) completedOrders.textContent = completed;
    }
    
    viewOrderDetails(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;
        
        const modal = document.getElementById('orderDetailsModal');
        const modalBody = document.getElementById('orderDetailsBody');
        
        if (modal && modalBody) {
            modalBody.innerHTML = `
                <div class="order-info-grid">
                    <div class="info-group">
                        <div class="info-label">Order ID</div>
                        <div class="info-value">${order.id}</div>
                    </div>
                    <div class="info-group">
                        <div class="info-label">Date</div>
                        <div class="info-value">${new Date(order.date).toLocaleString()}</div>
                    </div>
                    <div class="info-group">
                        <div class="info-label">Customer</div>
                        <div class="info-value">${order.customer || 'Guest'}</div>
                    </div>
                    <div class="info-group">
                        <div class="info-label">Status</div>
                        <div class="info-value">
                            <span class="status-badge status-${order.status}">${order.status}</span>
                        </div>
                    </div>
                    <div class="info-group">
                        <div class="info-label">Payment Method</div>
                        <div class="info-value">${order.paymentMethod || 'Pending'}</div>
                    </div>
                    <div class="info-group">
                        <div class="info-label">Total Amount</div>
                        <div class="info-value" style="color: #ff3366;">$${order.total.toFixed(2)}</div>
                    </div>
                </div>
                
                <div class="order-items-list">
                    <h4 style="margin-bottom: 15px; color: white;">Order Items</h4>
                    ${order.items.map(item => `
                        <div class="order-item">
                            <img src="${item.image}" alt="${item.name}" class="item-image"
                                 onerror="this.src='images/urban-edge.avif'">
                            <div class="item-details">
                                <div class="item-name">${item.name}</div>
                                <div class="item-meta">
                                    Quantity: ${item.quantity} × $${parseFloat(item.price).toFixed(2)} = $${(item.quantity * parseFloat(item.price)).toFixed(2)}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="order-summary">
                    <div class="summary-row">
                        <span>Subtotal:</span>
                        <span>$${order.subtotal.toFixed(2)}</span>
                    </div>
                    <div class="summary-row">
                        <span>Tax (10%):</span>
                        <span>$${order.tax.toFixed(2)}</span>
                    </div>
                    <div class="summary-row">
                        <span>Total:</span>
                        <span>$${order.total.toFixed(2)}</span>
                    </div>
                </div>
            `;
            
            modal.classList.add('active');
        }
    }
    
    closeOrderModal() {
        const modal = document.getElementById('orderDetailsModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }
    
    updateOrderStatus(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;
        
        const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        const currentStatusIndex = statuses.indexOf(order.status);
        const nextStatus = statuses[(currentStatusIndex + 1) % statuses.length];
        
        order.status = nextStatus;
        order.lastUpdated = new Date().toISOString();
        
        this.saveOrders();
        this.updateOrdersList();
        
        this.showNotification(`Order ${orderId} status updated to ${nextStatus}`, 'success');
    }
    
    addOrder(order) {
        // Add customer info (in real app, this would come from user session)
        order.customer = 'Guest User';
        order.email = 'guest@example.com';
        
        this.orders.unshift(order);
        this.saveOrders();
        this.updateOrdersList();
        
        this.showNotification(`New order received: ${order.id}`, 'success');
    }
    
    loadOrdersFromHistory() {
        // Load orders from order history (from cart system)
        const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
        
        orderHistory.forEach(order => {
            if (!this.orders.find(o => o.id === order.id)) {
                this.addOrder(order);
            }
        });
        
        this.showNotification('Orders refreshed', 'info');
    }
    
    exportToCSV() {
        if (this.orders.length === 0) {
            this.showNotification('No orders to export', 'warning');
            return;
        }
        
        const headers = ['Order ID', 'Date', 'Customer', 'Items', 'Subtotal', 'Tax', 'Total', 'Status'];
        const csvContent = [
            headers.join(','),
            ...this.orders.map(order => [
                order.id,
                new Date(order.date).toLocaleString(),
                order.customer || 'Guest',
                order.items.length,
                order.subtotal.toFixed(2),
                order.tax.toFixed(2),
                order.total.toFixed(2),
                order.status
            ].join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
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
        notification.className = 'admin-notification';
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
            z-index: 100001;
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
}

// Initialize order manager when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            window.orderManager = new OrderManager();
        }, 100); // Small delay to ensure admin panel is ready
    });
} else {
    setTimeout(() => {
        window.orderManager = new OrderManager();
    }, 100);
}
