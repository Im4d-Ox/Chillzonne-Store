// Firebase Configuration
// Your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMHaH7zqEg1SSOasrwSdq6yGCE0A3G6pY",
  authDomain: "chilzone-store.firebaseapp.com",
  projectId: "chilzone-store",
  storageBucket: "chilzone-store.firebasestorage.app",
  messagingSenderId: "49037430897",
  appId: "1:49037430897:web:469940823276a142e80bd0",
  measurementId: "G-W098J22N7N"
};

// Initialize Firebase
try {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    console.log('✅ Firebase initialized successfully');
} catch (error) {
    console.error('❌ Firebase initialization error:', error);
    // Continue with localStorage fallback if Firebase fails
}

// Initialize services (only Firestore needed for products)
const db = firebase.firestore();

// Make db globally accessible
window.db = db;

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { firebase, db };
}
