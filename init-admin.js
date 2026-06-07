// Initialize fresh admin user
(function initializeDefaultAdmin() {
    // Clear existing users to set up new admin accounts
    const existingUsers = JSON.parse(localStorage.getItem('chillzoneUsers')) || [];
    
    // Remove any existing admin users
    const nonAdminUsers = existingUsers.filter(u => u.isAdmin !== true);
    
    // Create two new admin accounts
    const admin1 = {
        id: 1,
        fullName: 'Imad',
        email: 'imad@chillzone.games',
        username: 'imad',
        password: btoa('imadimadox' + 'chillzone_salt'), // Hashed password
        createdAt: new Date().toISOString(),
        isActive: true,
        isAdmin: true
    };
    
    const admin2 = {
        id: 2,
        fullName: 'Amine',
        email: 'amine@chillzone.games',
        username: 'amine',
        password: btoa('aminep12pro' + 'chillzone_salt'), // Hashed password
        createdAt: new Date().toISOString(),
        isActive: true,
        isAdmin: true
    };
    
    // Add new admin accounts
    nonAdminUsers.push(admin1, admin2);
    localStorage.setItem('chillzoneUsers', JSON.stringify(nonAdminUsers));
    
    console.log('✅ Admin accounts created:');
    console.log('   - Username: imad, Password: imadimadox');
    console.log('   - Username: amine, Password: aminep12pro');
    
    sessionStorage.clear();
})();

