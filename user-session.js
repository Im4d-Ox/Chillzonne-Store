// Admin Session Management System

class AdminSessionManager {
    constructor() {
        this.initializeSession();
        this.setupEventListeners();
    }
    
    initializeSession() {
        const isAdminLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
        
        if (isAdminLoggedIn) {
            this.showAdminMenu();
        } else {
            this.showAdminLink();
        }
    }
    
    showAdminLink() {
        const adminLink = document.getElementById('adminLink');
        if (adminLink) adminLink.style.display = 'block';
    }
    
    showAdminMenu() {
        const adminLink = document.getElementById('adminLink');
        if (adminLink) adminLink.style.display = 'none';
    }
    
    setupEventListeners() {
        window.addEventListener('storage', (e) => {
            if (e.key === 'adminLoggedIn') {
                this.initializeSession();
            }
        });
    }
    
    static logout() {
        sessionStorage.removeItem('adminLoggedIn');
        sessionStorage.removeItem('adminUsername');
        window.location.reload();
    }
    
    static requireAdmin() {
        if (sessionStorage.getItem('adminLoggedIn') !== 'true') {
            window.location.href = 'admin-dashboard.html';
            return false;
        }
        return true;
    }
}

// Initialize session manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new AdminSessionManager();
});

// Make it globally available
window.AdminSessionManager = AdminSessionManager;
