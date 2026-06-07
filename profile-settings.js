// Profile and Settings Management System
class ProfileSettingsManager {
    constructor() {
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        // Profile form submission
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => this.handleProfileUpdate(e));
        }
        
        // Settings form submission
        const settingsForm = document.getElementById('settingsForm');
        if (settingsForm) {
            settingsForm.addEventListener('submit', (e) => this.handlePasswordUpdate(e));
        }
    }
    
    showProfile() {
        console.log('showProfile called');
        const user = UserSessionManager.getCurrentUser();
        console.log('User:', user);
        if (!user.isLoggedIn) {
            window.location.href = 'login.html';
            return;
        }
        
        this.createProfileSection();
        this.loadProfileData();
    }
    
    showSettings() {
        console.log('showSettings called');
        const user = UserSessionManager.getCurrentUser();
        console.log('User:', user);
        if (!user.isLoggedIn) {
            window.location.href = 'login.html';
            return;
        }
        
        this.createSettingsSection();
    }
    
    createProfileSection() {
        // Remove existing section
        this.removeExistingSections();
        
        const section = document.createElement('div');
        section.id = 'profileSection';
        section.style.cssText = 'position: fixed; top: 80px; right: 20px; background: rgba(0, 0, 0, 0.95); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 20px; max-width: 400px; z-index: 1000; backdrop-filter: blur(10px); color: var(--text-light); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);';
        
        section.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3 style="color: var(--text-light); margin: 0;">My Profile</h3>
                <button onclick="ProfileSettingsManager.removeExistingSections()" style="background: transparent; border: none; color: var(--text-muted); font-size: 20px; cursor: pointer;">×</button>
            </div>
            
            <form id="profileForm">
                <div style="margin-bottom: 15px;">
                    <label style="display: block; color: var(--text-light); margin-bottom: 5px; font-size: 12px; font-weight: 500;">Full Name</label>
                    <input type="text" id="profileFullName" name="fullName" required style="width: 100%; padding: 8px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 4px; color: white; font-size: 13px; box-sizing: border-box;">
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; color: var(--text-light); margin-bottom: 5px; font-size: 12px; font-weight: 500;">Username</label>
                    <input type="text" id="profileUsername" name="username" required style="width: 100%; padding: 8px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 4px; color: white; font-size: 13px; box-sizing: border-box;">
                </div>
                <div style="margin-bottom: 20px;">
                    <label style="display: block; color: var(--text-light); margin-bottom: 5px; font-size: 12px; font-weight: 500;">Email Address</label>
                    <input type="email" id="profileEmail" name="email" required style="width: 100%; padding: 8px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 4px; color: white; font-size: 13px; box-sizing: border-box;">
                </div>
                <div style="display: flex; gap: 10px;">
                    <button type="submit" style="background: var(--accent); color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: 500;">Save</button>
                    <button type="button" onclick="ProfileSettingsManager.removeExistingSections()" style="background: transparent; color: var(--text-light); border: 1px solid rgba(255, 255, 255, 0.2); padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 13px;">Cancel</button>
                </div>
            </form>
            
            <div id="profileMessage" style="margin-top: 15px; padding: 10px; border-radius: 4px; font-size: 12px; display: none;"></div>
        `;
        
        document.body.appendChild(section);
        
        // Add event listeners
        section.querySelector('form').addEventListener('submit', (e) => this.handleProfileUpdate(e));
    }
    
    createSettingsSection() {
        // Remove existing section
        this.removeExistingSections();
        
        const section = document.createElement('div');
        section.id = 'settingsSection';
        section.style.cssText = 'position: fixed; top: 80px; right: 20px; background: rgba(0, 0, 0, 0.95); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 20px; max-width: 400px; z-index: 1000; backdrop-filter: blur(10px); color: var(--text-light); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);';
        
        section.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3 style="color: var(--text-light); margin: 0;">Settings</h3>
                <button onclick="ProfileSettingsManager.removeExistingSections()" style="background: transparent; border: none; color: var(--text-muted); font-size: 20px; cursor: pointer;">×</button>
            </div>
            
            <form id="settingsForm">
                <div style="margin-bottom: 15px;">
                    <label style="display: block; color: var(--text-light); margin-bottom: 5px; font-size: 12px; font-weight: 500;">Current Password</label>
                    <input type="password" id="currentPassword" name="currentPassword" placeholder="Enter current password" style="width: 100%; padding: 8px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 4px; color: white; font-size: 13px; box-sizing: border-box;">
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; color: var(--text-light); margin-bottom: 5px; font-size: 12px; font-weight: 500;">New Password</label>
                    <input type="password" id="newPassword" name="newPassword" placeholder="Enter new password" style="width: 100%; padding: 8px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 4px; color: white; font-size: 13px; box-sizing: border-box;">
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; color: var(--text-light); margin-bottom: 5px; font-size: 12px; font-weight: 500;">Confirm New Password</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm new password" style="width: 100%; padding: 8px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 4px; color: white; font-size: 13px; box-sizing: border-box;">
                </div>
                <div style="display: flex; gap: 10px;">
                    <button type="submit" style="background: var(--accent); color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: 500;">Update</button>
                    <button type="button" onclick="ProfileSettingsManager.removeExistingSections()" style="background: transparent; color: var(--text-light); border: 1px solid rgba(255, 255, 255, 0.2); padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 13px;">Cancel</button>
                </div>
            </form>
            
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255, 51, 102, 0.3);">
                <h3 style="color: var(--accent); font-size: 16px; margin-bottom: 5px;">Danger Zone</h3>
                <p style="color: var(--text-muted); font-size: 12px; margin-bottom: 10px;">Once you delete your account, there is no going back.</p>
                <button type="button" onclick="ProfileSettingsManager.deleteAccount()" style="background: var(--accent); color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">Delete Account</button>
            </div>
            
            <div id="settingsMessage" style="margin-top: 15px; padding: 10px; border-radius: 4px; font-size: 12px; display: none;"></div>
        `;
        
        document.body.appendChild(section);
        
        // Add event listeners
        section.querySelector('form').addEventListener('submit', (e) => this.handlePasswordUpdate(e));
    }
    
    removeExistingSections() {
        const existingProfile = document.getElementById('profileSection');
        const existingSettings = document.getElementById('settingsSection');
        
        if (existingProfile) existingProfile.remove();
        if (existingSettings) existingSettings.remove();
    }
    
    loadProfileData() {
        const user = UserSessionManager.getCurrentUser();
        
        // Load current user data into form
        const fullNameInput = document.getElementById('profileFullName');
        const usernameInput = document.getElementById('profileUsername');
        const emailInput = document.getElementById('profileEmail');
        
        if (fullNameInput) fullNameInput.value = user.fullName || '';
        if (usernameInput) usernameInput.value = user.username || '';
        if (emailInput) emailInput.value = user.email || '';
    }
    
    handleProfileUpdate(e) {
        e.preventDefault();
        
        const formData = {
            fullName: document.getElementById('profileFullName').value.trim(),
            username: document.getElementById('profileUsername').value.trim(),
            email: document.getElementById('profileEmail').value.trim().toLowerCase()
        };
        
        // Validate form
        const validation = this.validateProfileForm(formData);
        if (!validation.valid) {
            this.showMessage('profile', 'error', validation.message);
            return;
        }
        
        // Update user data
        this.updateUserData(formData);
        this.showMessage('profile', 'success', 'Profile updated successfully!');
        
        // Close section after successful update
        setTimeout(() => this.removeExistingSections(), 2000);
    }
    
    validateProfileForm(data) {
        if (!data.fullName || !data.username || !data.email) {
            return { valid: false, message: 'Please fill in all fields' };
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            return { valid: false, message: 'Please enter a valid email address' };
        }
        
        // Validate username
        const usernameRegex = /^[a-zA-Z0-9_-]+$/;
        if (!usernameRegex.test(data.username)) {
            return { valid: false, message: 'Username can only contain letters, numbers, underscores, and hyphens' };
        }
        
        if (data.username.length < 3) {
            return { valid: false, message: 'Username must be at least 3 characters long' };
        }
        
        return { valid: true };
    }
    
    updateUserData(formData) {
        const users = JSON.parse(localStorage.getItem('chillzoneUsers')) || [];
        const currentUserId = sessionStorage.getItem('userId');
        
        // Find and update user
        const userIndex = users.findIndex(user => user.id == currentUserId);
        if (userIndex >= 0) {
            users[userIndex].fullName = formData.fullName;
            users[userIndex].username = formData.username;
            users[userIndex].email = formData.email;
            
            // Save updated users
            localStorage.setItem('chillzoneUsers', JSON.stringify(users));
            
            // Update session storage
            sessionStorage.setItem('userFullName', formData.fullName);
            sessionStorage.setItem('userUsername', formData.username);
            sessionStorage.setItem('userEmail', formData.email);
            
            // Update navigation display
            const userProfile = document.getElementById('userProfile');
            if (userProfile) {
                userProfile.textContent = formData.username;
            }
        }
    }
    
    handlePasswordUpdate(e) {
        e.preventDefault();
        
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Validate form
        const validation = this.validatePasswordForm(currentPassword, newPassword, confirmPassword);
        if (!validation.valid) {
            this.showMessage('settings', 'error', validation.message);
            return;
        }
        
        // Update password
        this.updateUserPassword(currentPassword, newPassword);
        this.showMessage('settings', 'success', 'Password updated successfully!');
        
        // Clear form and close section
        document.getElementById('settingsForm').reset();
        setTimeout(() => this.removeExistingSections(), 2000);
    }
    
    validatePasswordForm(currentPassword, newPassword, confirmPassword) {
        if (!currentPassword || !newPassword || !confirmPassword) {
            return { valid: false, message: 'Please fill in all password fields' };
        }
        
        if (newPassword.length < 6) {
            return { valid: false, message: 'New password must be at least 6 characters long' };
        }
        
        if (newPassword !== confirmPassword) {
            return { valid: false, message: 'New passwords do not match' };
        }
        
        return { valid: true };
    }
    
    updateUserPassword(currentPassword, newPassword) {
        const users = JSON.parse(localStorage.getItem('chillzoneUsers')) || [];
        const currentUserId = sessionStorage.getItem('userId');
        
        // Find user
        const user = users.find(user => user.id == currentUserId);
        if (user) {
            // Verify current password
            const currentHash = btoa(currentPassword + 'chillzone_salt');
            if (user.password !== currentHash) {
                this.showMessage('settings', 'error', 'Current password is incorrect');
                return;
            }
            
            // Update password
            user.password = btoa(newPassword + 'chillzone_salt');
            
            // Save updated users
            localStorage.setItem('chillzoneUsers', JSON.stringify(users));
        }
    }
    
    deleteAccount() {
        if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            return;
        }
        
        if (!confirm('This will permanently delete all your data. Are you absolutely sure?')) {
            return;
        }
        
        const users = JSON.parse(localStorage.getItem('chillzoneUsers')) || [];
        const currentUserId = sessionStorage.getItem('userId');
        
        // Remove user from database
        const updatedUsers = users.filter(user => user.id != currentUserId);
        localStorage.setItem('chillzoneUsers', JSON.stringify(updatedUsers));
        
        // Clear session and redirect
        UserSessionManager.logout();
    }
    
    showMessage(modal, type, message) {
        const messageDiv = document.getElementById(modal + 'Message');
        if (messageDiv) {
            messageDiv.textContent = message;
            messageDiv.style.display = 'block';
            
            if (type === 'success') {
                messageDiv.style.background = 'rgba(76, 175, 80, 0.1)';
                messageDiv.style.border = '1px solid #4CAF50';
                messageDiv.style.color = '#4CAF50';
            } else {
                messageDiv.style.background = 'rgba(255, 51, 102, 0.1)';
                messageDiv.style.border = '1px solid var(--accent)';
                messageDiv.style.color = 'var(--accent)';
            }
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 5000);
        }
    }
}

// Make it globally available
window.ProfileSettingsManager = ProfileSettingsManager;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing ProfileSettingsManager');
    window.profileSettingsManager = new ProfileSettingsManager();
});
